import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  floodPredictionService,
  LOCATION_COORDS,
  PredictionResponse,
} from "@/lib/floodPredictionService";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface FlowPoint {
  lat: number;
  lng: number;
  intensity: number;
  direction: number; // in degrees
  speed: number;
  age: number; // how long this flow point has been active
}

interface FloodFlowSimulationProps {
  floodData: Array<{
    lat: number;
    lng: number;
    intensity: number;
    severity: string;
  }>;
  center?: [number, number];
  zoom?: number;
  height?: string;
  isPlaying?: boolean;
  speed?: number;
  showFlowVectors?: boolean;
  showFlowTrails?: boolean;
  usePredictionData?: boolean;
}

// Component to handle flood flow simulation
const FloodFlowLayer: React.FC<{
  floodData: Array<{
    lat: number;
    lng: number;
    intensity: number;
    severity: string;
  }>;
  isPlaying: boolean;
  speed: number;
  showFlowVectors: boolean;
  showFlowTrails: boolean;
  usePredictionData: boolean;
}> = ({
  floodData,
  isPlaying,
  speed,
  showFlowVectors,
  showFlowTrails,
  usePredictionData,
}) => {
  const map = useMap();
  const flowPointsRef = useRef<FlowPoint[]>([]);
  const flowLayerRef = useRef<L.LayerGroup | null>(null);
  const trailLayerRef = useRef<L.LayerGroup | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const [predictionData, setPredictionData] = useState<PredictionResponse[]>(
    []
  );
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  // Fetch prediction data for all supported locations
  const fetchPredictionData = async () => {
    if (!usePredictionData) return;

    setLoadingPredictions(true);
    try {
      console.log("Fetching flood prediction data for flow simulation...");
      const predictions: PredictionResponse[] = [];

      // Get predictions for all supported locations
      for (const [locationName, coords] of Object.entries(LOCATION_COORDS)) {
        try {
          const prediction = await floodPredictionService.predictRegionalRisk(
            locationName
          );
          predictions.push(prediction);
          console.log(
            `Prediction for ${locationName}:`,
            prediction.main_prediction
          );
        } catch (error) {
          console.error(`Failed to get prediction for ${locationName}:`, error);
        }
      }

      setPredictionData(predictions);
      console.log("Loaded prediction data:", predictions.length, "locations");
    } catch (error) {
      console.error("Error fetching prediction data:", error);
    } finally {
      setLoadingPredictions(false);
    }
  };

  // Convert prediction data to flow points
  const getPredictionFlowPoints = (): FlowPoint[] => {
    if (!usePredictionData || !predictionData.length) return [];

    const flowPoints: FlowPoint[] = [];

    predictionData.forEach((prediction) => {
      const locationName = prediction.main_prediction?.Location;
      if (!locationName || !LOCATION_COORDS[locationName]) return;

      const coords = LOCATION_COORDS[locationName];
      const riskLevel = prediction.main_prediction?.["Risk Level"];
      const confidence = parseFloat(
        prediction.main_prediction?.["Confidence"]?.replace("%", "") || "0"
      );

      // Convert risk level to intensity
      let intensity = 0;
      switch (riskLevel) {
        case "Critical":
          intensity = 0.9;
          break;
        case "High Risk":
          intensity = 0.7;
          break;
        case "Medium Risk":
          intensity = 0.5;
          break;
        case "Low Risk":
          intensity = 0.3;
          break;
        default:
          intensity = 0.1;
      }

      // Adjust intensity based on confidence
      intensity = intensity * (confidence / 100);

      // Only add points with significant risk
      if (intensity > 0.2) {
        flowPoints.push({
          lat: coords.lat,
          lng: coords.lon,
          intensity: intensity,
          direction: Math.random() * 360,
          speed: intensity * 0.002, // Higher speed for prediction data
          age: 0,
        });
      }
    });

    console.log("Generated flow points from predictions:", flowPoints.length);
    return flowPoints;
  };

  // Fetch prediction data when component mounts
  useEffect(() => {
    if (usePredictionData) {
      fetchPredictionData();
    }
  }, [usePredictionData]);

  // Initialize flow points from flood data or prediction data
  useEffect(() => {
    if (!map) return;

    console.log("Initializing flow points:", {
      usePredictionData,
      predictionDataLength: predictionData.length,
      floodDataLength: floodData.length,
    });

    if (usePredictionData && predictionData.length > 0) {
      // Use prediction data
      const predictionFlowPoints = getPredictionFlowPoints();
      flowPointsRef.current = predictionFlowPoints;
      console.log(
        "Initialized flow points from predictions:",
        flowPointsRef.current.length
      );
    } else if (!usePredictionData && floodData.length > 0) {
      // Use flood report data
      flowPointsRef.current = floodData.map((point) => ({
        lat: point.lat,
        lng: point.lng,
        intensity: point.intensity,
        direction: Math.random() * 360, // Random initial direction
        speed: point.intensity * 0.001, // Speed based on intensity
        age: 0,
      }));
      console.log(
        "Initialized flow points from flood reports:",
        flowPointsRef.current.length,
        "Sample:",
        flowPointsRef.current[0]
      );
    } else {
      console.warn("No flow data available to initialize flow points");
    }
  }, [map, floodData, usePredictionData, predictionData]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !map) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (timestamp - lastUpdateRef.current < 1000 / (speed * 10)) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      lastUpdateRef.current = timestamp;

      // Update flow points
      flowPointsRef.current = flowPointsRef.current.map((point) => {
        // Calculate new position based on direction and speed
        const distance = point.speed * speed;
        const radians = (point.direction * Math.PI) / 180;

        // Simple flow simulation - water flows downhill
        const newLat = point.lat + Math.cos(radians) * distance * 0.0001;
        const newLng = point.lng + Math.sin(radians) * distance * 0.0001;

        // Add some randomness to direction
        const newDirection = point.direction + (Math.random() - 0.5) * 30;

        // Age the point
        const newAge = point.age + 1;

        // Reduce intensity over time
        const newIntensity = point.intensity * (1 - newAge * 0.001);

        return {
          lat: newLat,
          lng: newLng,
          intensity: Math.max(0, newIntensity),
          direction: newDirection,
          speed: point.speed,
          age: newAge,
        };
      });

      // Remove old or low-intensity points
      flowPointsRef.current = flowPointsRef.current.filter(
        (point) => point.intensity > 0.1 && point.age < 1000
      );

      // Add new flow points from flood sources
      if (floodData.length > 0 && Math.random() < 0.1) {
        const sourcePoint =
          floodData[Math.floor(Math.random() * floodData.length)];
        if (sourcePoint) {
          flowPointsRef.current.push({
            lat: sourcePoint.lat + (Math.random() - 0.5) * 0.01,
            lng: sourcePoint.lng + (Math.random() - 0.5) * 0.01,
            intensity: sourcePoint.intensity,
            direction: Math.random() * 360,
            speed: sourcePoint.intensity * 0.001,
            age: 0,
          });
        }
      }

      // Update visualization
      updateFlowVisualization();

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, map, floodData]);

  const updateFlowVisualization = () => {
    if (!map) return;

    // Remove existing layers
    if (flowLayerRef.current) {
      map.removeLayer(flowLayerRef.current);
    }
    if (trailLayerRef.current) {
      map.removeLayer(trailLayerRef.current);
    }

    // Create new flow layer
    const flowLayer = L.layerGroup();
    const trailLayer = L.layerGroup();

    console.log("Updating flow visualization with", flowPointsRef.current.length, "points");

    flowPointsRef.current.forEach((point) => {
      if (point.intensity < 0.1) return;

      // Create flow circle (made more visible)
      const circle = L.circle([point.lat, point.lng], {
        radius: Math.max(point.intensity * 100, 50), // Minimum radius of 50m
        fillColor: getFlowColor(point.intensity, point.age),
        fillOpacity: Math.max(0.4, Math.min(0.8, point.intensity)),
        color: getFlowColor(point.intensity, point.age),
        weight: 2,
      });

      flowLayer.addLayer(circle);

      // Create flow vector if enabled
      if (showFlowVectors) {
        const endLat =
          point.lat + Math.cos((point.direction * Math.PI) / 180) * 0.001;
        const endLng =
          point.lng + Math.sin((point.direction * Math.PI) / 180) * 0.001;

        const line = L.polyline(
          [
            [point.lat, point.lng],
            [endLat, endLng],
          ],
          {
            color: getFlowColor(point.intensity, point.age),
            weight: 2,
            opacity: 0.7,
          }
        );

        flowLayer.addLayer(line);
      }

      // Create flow trail if enabled
      if (showFlowTrails && point.age > 10) {
        const trailLength = Math.min(point.age, 50);
        const trailPoints = [];

        for (let i = 0; i < trailLength; i++) {
          const trailAge = point.age - i;
          const trailIntensity = point.intensity * (1 - trailAge * 0.001);
          const trailLat =
            point.lat -
            Math.cos((point.direction * Math.PI) / 180) * i * 0.0001;
          const trailLng =
            point.lng -
            Math.sin((point.direction * Math.PI) / 180) * i * 0.0001;

          trailPoints.push([trailLat, trailLng]);
        }

        if (trailPoints.length > 1) {
          const trail = L.polyline(trailPoints, {
            color: getFlowColor(point.intensity, point.age),
            weight: 1,
            opacity: 0.3,
          });

          trailLayer.addLayer(trail);
        }
      }
    });

    // Add layers to map
    flowLayerRef.current = flowLayer;
    trailLayerRef.current = trailLayer;

    if (showFlowTrails) {
      map.addLayer(trailLayer);
    }
    map.addLayer(flowLayer);
  };

  const getFlowColor = (intensity: number, age: number): string => {
    // Color based on intensity and age
    const alpha = Math.min(1, intensity);
    const ageFactor = Math.max(0.3, 1 - age * 0.001);

    if (intensity > 0.7) {
      return `rgba(220, 38, 38, ${alpha * ageFactor})`; // Red
    } else if (intensity > 0.4) {
      return `rgba(245, 158, 11, ${alpha * ageFactor})`; // Orange
    } else if (intensity > 0.2) {
      return `rgba(59, 130, 246, ${alpha * ageFactor})`; // Blue
    } else {
      return `rgba(34, 197, 94, ${alpha * ageFactor})`; // Green
    }
  };

  return null;
};

const FloodFlowSimulation: React.FC<FloodFlowSimulationProps> = ({
  floodData,
  center = [20.5937, 78.9629],
  zoom = 6,
  height = "500px",
  isPlaying = false,
  speed = 1,
  showFlowVectors = true,
  showFlowTrails = true,
  usePredictionData = false,
}) => {
  return (
    <div
      style={{ height, width: "100%" }}
      className="rounded-lg overflow-hidden border"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FloodFlowLayer
          floodData={floodData}
          isPlaying={isPlaying}
          speed={speed}
          showFlowVectors={showFlowVectors}
          showFlowTrails={showFlowTrails}
          usePredictionData={usePredictionData}
        />
      </MapContainer>
    </div>
  );
};

export default FloodFlowSimulation;
