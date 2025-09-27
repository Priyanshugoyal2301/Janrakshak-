import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yctbapuirfppmqbzgvqo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdGJhcHVpcmZwcG1xYnpndnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwMDAyOTcsImV4cCI6MjA3NDU3NjI5N30.HyuVCIlShAfZbEvFrLEk0dXJQKw4Hsu2yYjkjp68C2E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface FloodReport {
  id?: string;
  user_id: string;
  user_name: string;
  user_email: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    address: string;
    state: string;
    district: string;
  };
  images: string[];
  status: 'pending' | 'verified' | 'resolved' | 'false_alarm';
  created_at?: string;
  updated_at?: string;
}

export interface LocationData {
  id?: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
  current_water_level: number;
  risk_level: 'safe' | 'warning' | 'critical';
  weather_data: {
    temperature: number;
    humidity: number;
    precipitation: number;
    wind_speed: number;
  };
  last_updated: string;
}

export interface UserLocation {
  id?: string;
  user_id: string;
  lat: number;
  lng: number;
  address: string;
  state: string;
  district: string;
  is_primary: boolean;
  created_at?: string;
}

// Helper functions
export const uploadImage = async (file: File, bucket: string = 'images'): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const deleteImage = async (url: string, bucket: string = 'images'): Promise<boolean> => {
  try {
    const fileName = url.split('/').pop();
    if (!fileName) return false;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    return !error;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

export const submitFloodReport = async (report: Omit<FloodReport, 'id' | 'created_at' | 'updated_at'>): Promise<FloodReport | null> => {
  try {
    const { data, error } = await supabase
      .from('flood_reports')
      .insert([report])
      .select()
      .single();

    if (error) {
      console.error('Error submitting report:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error submitting report:', error);
    return null;
  }
};

export const getLocationData = async (state: string, district?: string): Promise<LocationData[]> => {
  try {
    let query = supabase
      .from('location_data')
      .select('*')
      .eq('state', state);

    if (district) {
      query = query.eq('district', district);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching location data:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching location data:', error);
    return [];
  }
};

export const getNearbyReports = async (lat: number, lng: number, radiusKm: number = 50): Promise<FloodReport[]> => {
  try {
    // Note: This is a simplified query. For production, you'd want to use PostGIS for proper distance calculation
    const { data, error } = await supabase
      .from('flood_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching nearby reports:', error);
      return [];
    }

    // Simple distance filtering (in production, use PostGIS)
    return data?.filter(report => {
      const distance = calculateDistance(
        lat, lng,
        report.location.lat, report.location.lng
      );
      return distance <= radiusKm;
    }) || [];
  } catch (error) {
    console.error('Error fetching nearby reports:', error);
    return [];
  }
};

export const saveUserLocation = async (location: Omit<UserLocation, 'id' | 'created_at'>): Promise<UserLocation | null> => {
  try {
    const { data, error } = await supabase
      .from('user_locations')
      .insert([location])
      .select()
      .single();

    if (error) {
      console.error('Error saving user location:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error saving user location:', error);
    return null;
  }
};

// Utility function to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in kilometers
  return d;
};