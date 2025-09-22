const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

const db = admin.firestore();

// GraphHopper configuration
const GRAPHOPPER_API_URL = 'https://graphhopper.com/api/1';
const GRAPHOPPER_API_KEY = 'ecaf0074-5a6b-4e05-a880-db7db67f193f';

// Update flood data from ISRO Bhuvan (simulated)
exports.updateFloodData = functions.pubsub.schedule('every 30 minutes').onRun(async (context) => {
  console.log('Running flood data update...');
  
  try {
    // In production, fetch real ISRO Bhuvan data
    // For now, simulate flood data updates
    const simulatedFloodData = [
      {
        road_id: 'ROAD_001',
        name: 'NH-1 Ludhiana Section',
        status: 'blocked',
        reason: 'Sutlej River flooding',
        coordinates: [
          [30.85, 75.80],
          [30.87, 75.82],
          [30.89, 75.84]
        ],
        last_updated: Date.now()
      },
      {
        road_id: 'ROAD_002',
        name: 'State Highway 15 Amritsar',
        status: 'risky',
        reason: 'Beas River high water level',
        coordinates: [
          [31.60, 74.85],
          [31.62, 74.87],
          [31.64, 74.89]
        ],
        last_updated: Date.now()
      }
    ];

    // Update roads collection
    const batch = db.batch();
    for (const road of simulatedFloodData) {
      const roadRef = db.collection('roads').doc(road.road_id);
      batch.set(roadRef, road);
    }
    await batch.commit();

    console.log('Flood data updated successfully');
    return null;
  } catch (error) {
    console.error('Error updating flood data:', error);
    return null;
  }
});

// Get safe route using GraphHopper
exports.getSafeRoute = functions.https.onCall(async (data, context) => {
  const { start, destination, blockedEdges = [] } = data;
  
  if (!start || !destination) {
    throw new functions.https.HttpsError('invalid-argument', 'Start and destination are required');
  }

  try {
    const url = new URL(`${GRAPHOPPER_API_URL}/route`);
    url.searchParams.set('point', `${start.lat},${start.lon}`);
    url.searchParams.append('point', `${destination.lat},${destination.lon}`);
    url.searchParams.set('profile', 'car');
    url.searchParams.set('locale', 'en');
    url.searchParams.set('points_encoded', 'true');
    url.searchParams.set('instructions', 'true');
    url.searchParams.set('key', GRAPHOPPER_API_KEY);

    if (blockedEdges.length > 0) {
      url.searchParams.set('block_area', blockedEdges.join(','));
    }

    const response = await axios.get(url.toString());
    const routeData = response.data;
    
    if (!routeData.paths || routeData.paths.length === 0) {
      throw new functions.https.HttpsError('not-found', 'No route found');
    }

    const path = routeData.paths[0];
    const result = {
      route: {
        polyline: path.points,
        distance_km: path.distance / 1000,
        duration_min: path.time / 60000,
        steps: (path.instructions || []).map(instruction => instruction.text)
      },
      warnings: routeData.info?.warnings || []
    };

    // Store route in Firestore
    await db.collection('routes').add({
      ...result,
      user_start: start,
      destination: destination,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return result;
  } catch (error) {
    console.error('Error getting safe route:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get route');
  }
});

// Get nearest shelter
exports.getNearestShelter = functions.https.onCall(async (data, context) => {
  const { lat, lon, radiusKm = 20 } = data;
  
  if (!lat || !lon) {
    throw new functions.https.HttpsError('invalid-argument', 'Latitude and longitude are required');
  }

  try {
    // Query shelters within radius
    const sheltersRef = db.collection('shelters');
    const snapshot = await sheltersRef.where('status', '==', 'operational').get();
    
    const shelters = [];
    snapshot.forEach(doc => {
      const shelter = doc.data();
      const distance = calculateDistance(lat, lon, shelter.lat, shelter.lon);
      if (distance <= radiusKm) {
        shelters.push({
          ...shelter,
          distance,
          shelter_id: doc.id
        });
      }
    });

    if (shelters.length === 0) {
      throw new functions.https.HttpsError('not-found', 'No shelters found within radius');
    }

    // Sort by available capacity and distance
    shelters.sort((a, b) => {
      const scoreA = a.available - (a.distance * 10); // Distance penalty
      const scoreB = b.available - (b.distance * 10);
      return scoreB - scoreA;
    });

    const bestShelter = shelters[0];
    return {
      shelter: {
        name: bestShelter.name,
        lat: bestShelter.lat,
        lon: bestShelter.lon,
        capacity_available: bestShelter.available,
        shelter_id: bestShelter.shelter_id
      }
    };
  } catch (error) {
    console.error('Error getting nearest shelter:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get nearest shelter');
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
