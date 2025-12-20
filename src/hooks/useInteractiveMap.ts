import { useState, useCallback, useRef } from 'react';
import L from 'leaflet';
import { graphHopperService, GraphHopperPoint } from '@/services/graphhopper';
import { supabase } from '@/lib/supabase';

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  type: 'origin' | 'waypoint' | 'destination';
  label?: string;
}

export interface RouteInfo {
  distance: string;
  duration: string;
  points: GraphHopperPoint[];
  instructions: Array<{
    text: string;
    distance: number;
    time: number;
  }>;
  isWaterRoute?: boolean;
}

export interface InteractiveMapState {
  points: MapPoint[];
  routes: RouteInfo[];
  isCalculating: boolean;
  showInstructions: boolean;
  floodReports: any[];
  useWaterRoutes: boolean;
}

export const useInteractiveMap = () => {
  const [state, setState] = useState<InteractiveMapState>({
    points: [],
    routes: [],
    isCalculating: false,
    showInstructions: false,
    floodReports: [],
    useWaterRoutes: false
  });

  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylinesRef = useRef<L.Polyline[]>([]);

  // Fetch recent flood reports
  const fetchFloodReports = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('flood_reports')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      console.log('Fetched flood reports for route calculation:', data);
      setState(prev => ({ ...prev, floodReports: data || [] }));
      
      // Auto-enable water routes if there are recent flood reports
      if (data && data.length > 0) {
        setState(prev => ({ ...prev, useWaterRoutes: true }));
      }
    } catch (error) {
      console.error('Error fetching flood reports:', error);
    }
  }, []);

  // Toggle water route mode
  const toggleWaterRoutes = useCallback(() => {
    setState(prev => ({ ...prev, useWaterRoutes: !prev.useWaterRoutes }));
  }, []);

  // Add point to map
  const addPoint = useCallback((lat: number, lng: number, type: MapPoint['type'], label?: string) => {
    const newPoint: MapPoint = {
      id: `point-${Date.now()}`,
      lat,
      lng,
      type,
      label
    };

    setState(prev => ({
      ...prev,
      points: [...prev.points, newPoint]
    }));

    return newPoint;
  }, []);

  // Remove point from map
  const removePoint = useCallback((pointId: string) => {
    setState(prev => ({
      ...prev,
      points: prev.points.filter(p => p.id !== pointId)
    }));
  }, []);

  // Clear all points
  const clearPoints = useCallback(() => {
    setState(prev => ({
      ...prev,
      points: [],
      routes: []
    }));
  }, []);

  // Calculate precise route between points for rescue operations
  const calculateRoute = useCallback(async () => {
    if (state.points.length < 2) {
      throw new Error('At least 2 points are required for route calculation');
    }

    setState(prev => ({ ...prev, isCalculating: true }));

    // Fetch flood reports if not already fetched
    if (state.floodReports.length === 0) {
      await fetchFloodReports();
    }

    try {
      const graphHopperPoints: GraphHopperPoint[] = state.points.map(p => ({
        lat: p.lat,
        lng: p.lng
      }));

      console.log('Calculating route for points:', graphHopperPoints);
      console.log('Water route mode:', state.useWaterRoutes);
      console.log('Flood reports:', state.floodReports);

      // Use water route if enabled or if floods detected
      const response = await graphHopperService.calculateRoute({
        points: graphHopperPoints,
        vehicle: state.useWaterRoutes ? 'boat' : 'car',
        optimize: false,
        instructions: true,
        useWaterRoutes: state.useWaterRoutes,
        floodReports: state.floodReports
      });

      console.log('Route response:', response);

      const routes: RouteInfo[] = response.paths.map(path => {
        console.log('Processing path:', path);
        const decodedPoints = graphHopperService.decodePolyline(path.points);
        console.log('Decoded points:', decodedPoints);
        
        return {
          distance: graphHopperService.formatDistance(path.distance),
          duration: graphHopperService.formatDuration(path.time),
          points: decodedPoints,
          instructions: path.instructions || [],
          isWaterRoute: response.isWaterRoute
        };
      });

      console.log('Final routes:', routes);

      setState(prev => ({
        ...prev,
        routes,
        isCalculating: false
      }));

      return routes;
    } catch (error) {
      console.error('Route calculation error:', error);
      setState(prev => ({ ...prev, isCalculating: false }));
      throw error;
    }
  }, [state.points, state.useWaterRoutes, state.floodReports, fetchFloodReports]);

  // Optimize route (TSP) for rescue operations with precise optimization
  const optimizeRoute = useCallback(async () => {
    if (state.points.length < 3) {
      throw new Error('At least 3 points are required for route optimization');
    }

    setState(prev => ({ ...prev, isCalculating: true }));

    // Fetch flood reports if not already fetched
    if (state.floodReports.length === 0) {
      await fetchFloodReports();
    }

    try {
      const graphHopperPoints: GraphHopperPoint[] = state.points.map(p => ({
        lat: p.lat,
        lng: p.lng
      }));

      console.log('Optimizing route for points:', graphHopperPoints);
      console.log('Water route mode:', state.useWaterRoutes);

      // Use water route if enabled
      const response = await graphHopperService.calculateRoute({
        points: graphHopperPoints,
        vehicle: state.useWaterRoutes ? 'boat' : 'car',
        optimize: true,
        instructions: true,
        useWaterRoutes: state.useWaterRoutes,
        floodReports: state.floodReports
      });
      
      console.log('Optimized route response:', response);

      const routes: RouteInfo[] = response.paths.map(path => {
        console.log('Processing optimized path:', path);
        const decodedPoints = graphHopperService.decodePolyline(path.points);
        console.log('Decoded optimized points:', decodedPoints);
        
        return {
          distance: graphHopperService.formatDistance(path.distance),
          duration: graphHopperService.formatDuration(path.time),
          points: decodedPoints,
          instructions: path.instructions || [],
          isWaterRoute: response.isWaterRoute
        };
      });

      console.log('Final optimized routes:', routes);

      setState(prev => ({
        ...prev,
        routes,
        isCalculating: false
      }));

      return routes;
    } catch (error) {
      console.error('Route optimization error:', error);
      setState(prev => ({ ...prev, isCalculating: false }));
      throw error;
    }
  }, [state.points, state.useWaterRoutes, state.floodReports, fetchFloodReports]);

  // Toggle instructions visibility
  const toggleInstructions = useCallback(() => {
    setState(prev => ({ ...prev, showInstructions: !prev.showInstructions }));
  }, []);

  // Get point by type
  const getPointByType = useCallback((type: MapPoint['type']) => {
    return state.points.find(p => p.type === type);
  }, [state.points]);

  // Reorder points for optimization
  const reorderPoints = useCallback((newOrder: string[]) => {
    const reorderedPoints = newOrder
      .map(id => state.points.find(p => p.id === id))
      .filter(Boolean) as MapPoint[];

    setState(prev => ({
      ...prev,
      points: reorderedPoints
    }));
  }, [state.points]);

  return {
    ...state,
    addPoint,
    removePoint,
    clearPoints,
    calculateRoute,
    optimizeRoute,
    toggleInstructions,
    getPointByType,
    reorderPoints,
    fetchFloodReports,
    toggleWaterRoutes,
    mapRef,
    markersRef,
    polylinesRef
  };
};