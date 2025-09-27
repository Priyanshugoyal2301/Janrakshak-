-- Create tables for JalRakshak Supabase integration

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create flood_reports table
CREATE TABLE IF NOT EXISTS flood_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
    location JSONB NOT NULL,
    images TEXT[] DEFAULT '{}',
    status TEXT CHECK (status IN ('pending', 'verified', 'resolved', 'false_alarm')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create location_data table for storing real-time flood data
CREATE TABLE IF NOT EXISTS location_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    current_water_level INTEGER DEFAULT 0,
    risk_level TEXT CHECK (risk_level IN ('safe', 'warning', 'critical')) DEFAULT 'safe',
    weather_data JSONB DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_locations table for storing user's saved locations
CREATE TABLE IF NOT EXISTS user_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    address TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alert_subscriptions table for managing user alert preferences
CREATE TABLE IF NOT EXISTS alert_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    location_id UUID REFERENCES user_locations(id),
    alert_types TEXT[] DEFAULT '{}',
    notification_methods TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flood_reports_user_id ON flood_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_flood_reports_severity ON flood_reports(severity);
CREATE INDEX IF NOT EXISTS idx_flood_reports_status ON flood_reports(status);
CREATE INDEX IF NOT EXISTS idx_flood_reports_created_at ON flood_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_location_data_state_district ON location_data(state, district);
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_subscriptions_user_id ON alert_subscriptions(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_flood_reports_updated_at 
    BEFORE UPDATE ON flood_reports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_location_data_updated_at 
    BEFORE UPDATE ON location_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for Punjab districts
INSERT INTO location_data (state, district, lat, lng, current_water_level, risk_level, weather_data) VALUES
('Punjab', 'Amritsar', 31.6340, 74.8723, 85, 'critical', '{"temperature": 28, "humidity": 75, "precipitation": 45, "wind_speed": 12}'),
('Punjab', 'Ludhiana', 30.9010, 75.8573, 62, 'warning', '{"temperature": 30, "humidity": 68, "precipitation": 25, "wind_speed": 8}'),
('Punjab', 'Jalandhar', 31.3260, 75.5762, 35, 'safe', '{"temperature": 29, "humidity": 60, "precipitation": 5, "wind_speed": 6}'),
('Punjab', 'Patiala', 30.3398, 76.3869, 15, 'safe', '{"temperature": 31, "humidity": 55, "precipitation": 2, "wind_speed": 4}'),
('Punjab', 'Bathinda', 30.2110, 74.9455, 40, 'safe', '{"temperature": 32, "humidity": 50, "precipitation": 8, "wind_speed": 7}'),
('Haryana', 'Gurugram', 28.4595, 77.0266, 25, 'safe', '{"temperature": 33, "humidity": 45, "precipitation": 3, "wind_speed": 5}'),
('Haryana', 'Faridabad', 28.4089, 77.3178, 30, 'safe', '{"temperature": 32, "humidity": 48, "precipitation": 4, "wind_speed": 6}')
ON CONFLICT DO NOTHING;

-- Set up Row Level Security (RLS)
ALTER TABLE flood_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- flood_reports policies
CREATE POLICY "Users can view all flood reports" ON flood_reports
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own flood reports" ON flood_reports
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own flood reports" ON flood_reports
    FOR UPDATE USING (auth.uid()::text = user_id);

-- user_locations policies
CREATE POLICY "Users can view their own locations" ON user_locations
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own locations" ON user_locations
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own locations" ON user_locations
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own locations" ON user_locations
    FOR DELETE USING (auth.uid()::text = user_id);

-- alert_subscriptions policies
CREATE POLICY "Users can view their own alert subscriptions" ON alert_subscriptions
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own alert subscriptions" ON alert_subscriptions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own alert subscriptions" ON alert_subscriptions
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own alert subscriptions" ON alert_subscriptions
    FOR DELETE USING (auth.uid()::text = user_id);

-- location_data is read-only for all users
CREATE POLICY "Anyone can view location data" ON location_data
    FOR SELECT USING (true);