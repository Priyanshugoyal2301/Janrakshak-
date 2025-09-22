import { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { decodePolyline, getNearestShelter, getSafeRoute } from "@/lib/routing";
import { BLOCKED_ROADS, FLOOD_ZONES, PUNJAB_SHELTERS } from "@/lib/punjabData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Phone, ExternalLink, AlertTriangle } from "lucide-react";

const shelterIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const startIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Map click handler component
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

type Props = {
  start?: { lat: number; lon: number };
};

const EvacuationPlanner = ({ start }: Props) => {
  const [current, setCurrent] = useState<{ lat: number; lon: number } | null>(start || null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [blocked, setBlocked] = useState<[number, number][][]>([]);
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [shelter, setShelter] = useState<{ name: string; lat: number; lon: number; capacity_available: number; shelter_id?: string } | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [directions, setDirections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance_km: number; duration_min: number } | null>(null);
  const [allShelters, setAllShelters] = useState<any[]>([]);

  // Initialize data
  useEffect(() => {
    setAllShelters(PUNJAB_SHELTERS);
    const blockedRoads = BLOCKED_ROADS.map(road => road.coordinates);
    setBlocked(blockedRoads);
  }, []);

  // Derive default start from browser geolocation if not provided
  useEffect(() => {
    if (!current && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrent({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setCurrent({ lat: 30.7333, lon: 76.7794 }) // Default to Punjab center
      );
    }
  }, [current]);

  // Handle map click for location selection
  const handleMapClick = (lat: number, lon: number) => {
    setSelectedLocation({ lat, lon });
    setCurrent({ lat, lon });
  };

  // Fetch route when location changes
  const fetchRoute = async (start: { lat: number; lon: number }) => {
    setIsLoading(true);
    try {
      const nearest = await getNearestShelter(start);
      setShelter(nearest.shelter);
      const res = await getSafeRoute(start, { lat: nearest.shelter.lat, lon: nearest.shelter.lon });
      setWarnings(res.warnings || []);
      setDirections(res.route.steps || []);
      setRoutePoints(decodePolyline(res.route.polyline));
      setRouteInfo({
        distance_km: res.route.distance_km,
        duration_min: res.route.duration_min
      });
    } catch (error) {
      console.error("Failed to fetch route:", error);
      setWarnings(["Failed to fetch route. Using offline data."]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch route when current location changes
  useEffect(() => {
    if (current) {
      fetchRoute(current);
    }
  }, [current?.lat, current?.lon]);

  // Open Google Maps with directions
  const openGoogleMaps = (start: { lat: number; lon: number }, destination: { lat: number; lon: number }) => {
    const url = `https://www.google.com/maps/dir/${start.lat},${start.lon}/${destination.lat},${destination.lon}`;
    window.open(url, '_blank');
  };

  // Call emergency numbers
  const callEmergency = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const center = useMemo<[number, number]>(() => {
    if (routePoints.length) return routePoints[Math.floor(routePoints.length / 2)];
    if (current) return [current.lat, current.lon];
    return [30.7333, 76.7794];
  }, [routePoints, current]);

  return (
    <div className="relative h-96 w-full">
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onMapClick={handleMapClick} />
        
        {/* Current/Selected Location */}
        {current && (
          <Marker position={[current.lat, current.lon]} icon={startIcon}>
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-blue-600">Your Location</div>
                <div className="text-xs text-gray-600">
                  {current.lat.toFixed(4)}, {current.lon.toFixed(4)}
                </div>
                <Button 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={() => navigator.geolocation.getCurrentPosition(
                    (pos) => setCurrent({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                    () => {}
                  )}
                >
                  <Navigation className="w-3 h-3 mr-1" />
                  Update Location
                </Button>
              </div>
            </Popup>
          </Marker>
        )}

        {/* All Shelters */}
        {allShelters.map((shelterData, idx) => (
          <Marker key={idx} position={[shelterData.lat, shelterData.lon]} icon={shelterIcon}>
            <Popup>
              <div className="min-w-[200px]">
                <div className="font-semibold text-green-600">{shelterData.name}</div>
                <div className="text-xs text-gray-600 mb-2">{shelterData.district}</div>
                <div className="text-xs space-y-1">
                  <div>Capacity: {shelterData.available}/{shelterData.capacity}</div>
                  <div>Contact: {shelterData.contact}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {shelterData.amenities.map((amenity: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setCurrent({ lat: shelterData.lat, lon: shelterData.lon });
                    }}
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    Route Here
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => openGoogleMaps(
                      current || { lat: 30.7333, lon: 76.7794 },
                      { lat: shelterData.lat, lon: shelterData.lon }
                    )}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Safe Route */}
        {routePoints.length > 1 && (
          <Polyline positions={routePoints} pathOptions={{ color: "#16a34a", weight: 5 }} />
        )}

        {/* Blocked Roads */}
        {blocked.map((seg, idx) => (
          <Polyline key={`blocked-${idx}`} positions={seg} pathOptions={{ color: "#ef4444", weight: 4, dashArray: "6 8" }} />
        ))}

        {/* Flood Zones */}
        {FLOOD_ZONES.map((zone, idx) => (
          <Polyline 
            key={`flood-${idx}`} 
            positions={zone.coordinates} 
            pathOptions={{ 
              color: zone.severity === "critical" ? "#dc2626" : zone.severity === "high" ? "#ea580c" : "#f59e0b", 
              weight: 3, 
              fillColor: zone.severity === "critical" ? "#dc2626" : zone.severity === "high" ? "#ea580c" : "#f59e0b",
              fillOpacity: 0.2
            }} 
          />
        ))}
      </MapContainer>

      {/* Route Info Panel */}
      {routeInfo && shelter && (
        <div className="absolute top-3 right-3 w-80 bg-white/95 rounded-lg p-4 shadow-lg">
          <div className="text-sm font-semibold text-slate-900 mb-3">Evacuation Route</div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Destination:</span>
              <span className="font-medium">{shelter.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Distance:</span>
              <span className="font-medium">{routeInfo.distance_km.toFixed(1)} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{Math.round(routeInfo.duration_min)} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Space:</span>
              <span className="font-medium text-green-600">{shelter.capacity_available} people</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => openGoogleMaps(
                current || { lat: 30.7333, lon: 76.7794 },
                { lat: shelter.lat, lon: shelter.lon }
              )}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Open in Google Maps
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => callEmergency(shelter.contact || "+91-98765-43210")}
            >
              <Phone className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Directions Panel */}
      {directions.length > 0 && (
        <div className="absolute top-3 left-3 w-80 bg-white/95 rounded-lg p-4 shadow-lg max-h-64 overflow-y-auto">
          <div className="text-sm font-semibold text-slate-900 mb-2">Step-by-Step Directions</div>
          <ol className="list-decimal pl-4 text-xs text-slate-700 space-y-1">
            {directions.map((step, i) => (
              <li key={i} className="py-1">{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Emergency Panel */}
      <div className="absolute bottom-3 left-3 bg-white/90 rounded-lg p-3 shadow">
        <div className="text-xs font-semibold text-red-600 mb-2">Emergency Contacts</div>
        <div className="space-y-1">
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full text-xs h-8"
            onClick={() => callEmergency("108")}
          >
            <Phone className="w-3 h-3 mr-1" />
            Emergency: 108
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full text-xs h-8"
            onClick={() => callEmergency("100")}
          >
            <Phone className="w-3 h-3 mr-1" />
            Police: 100
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full text-xs h-8"
            onClick={() => callEmergency("101")}
          >
            <Phone className="w-3 h-3 mr-1" />
            Fire: 101
          </Button>
        </div>
      </div>

      {/* Warnings Panel */}
      {warnings.length > 0 && (
        <div className="absolute bottom-3 right-3 w-80 bg-white/90 rounded-lg p-3 shadow">
          <div className="text-xs font-semibold text-red-600 mb-2 flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Flood Warnings
          </div>
          <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-3 left-3 bg-white/90 rounded-lg p-3 shadow text-xs">
        <div className="font-semibold mb-2">Map Legend</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Safe Route</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Blocked Roads</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Flood Zones</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Shelters</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          Click anywhere on map to set location
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="text-sm font-medium">Finding safe route...</div>
            <div className="text-xs text-gray-600">Please wait</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvacuationPlanner;


