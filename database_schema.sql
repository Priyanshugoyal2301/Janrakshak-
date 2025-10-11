-- NDMA Training Management System Database Schema
-- Integrates with existing JalRakshak schema
-- Run these queries in Supabase SQL editor after your existing tables

-- 1. Training Partners/Organizations Table
CREATE TABLE IF NOT EXISTS training_partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('NIDM', 'LBSNAA', 'SDMA', 'ATI', 'NGO', 'GOI_MINISTRY', 'OTHER')),
    state TEXT,
    district TEXT,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Training Categories/Themes Table
CREATE TABLE IF NOT EXISTS training_themes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT CHECK (category IN ('DISASTER_PREPAREDNESS', 'RESPONSE', 'RECOVERY', 'MITIGATION', 'CAPACITY_BUILDING')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Training Sessions Table
CREATE TABLE IF NOT EXISTS training_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    partner_id UUID REFERENCES training_partners(id),
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    venue TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_hours INTEGER,
    expected_participants INTEGER,
    actual_participants INTEGER DEFAULT 0,
    status TEXT DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED')),
    training_mode TEXT CHECK (training_mode IN ('OFFLINE', 'ONLINE', 'HYBRID')),
    certification_provided BOOLEAN DEFAULT false,
    budget_allocated DECIMAL(12, 2),
    budget_spent DECIMAL(12, 2),
    feedback_score DECIMAL(3, 2),
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Training Session Themes (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS training_session_themes (
    session_id UUID REFERENCES training_sessions(id) ON DELETE CASCADE,
    theme_id UUID REFERENCES training_themes(id) ON DELETE CASCADE,
    PRIMARY KEY (session_id, theme_id)
);

-- 5. Target Audiences Table
CREATE TABLE IF NOT EXISTS target_audiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Training Session Target Audiences (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS training_session_audiences (
    session_id UUID REFERENCES training_sessions(id) ON DELETE CASCADE,
    audience_id UUID REFERENCES target_audiences(id) ON DELETE CASCADE,
    expected_count INTEGER,
    actual_count INTEGER DEFAULT 0,
    PRIMARY KEY (session_id, audience_id)
);

-- 7. Participants Table
CREATE TABLE IF NOT EXISTS training_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES training_sessions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    organization TEXT,
    designation TEXT,
    audience_type_id UUID REFERENCES target_audiences(id),
    attendance_status TEXT DEFAULT 'REGISTERED' CHECK (attendance_status IN ('REGISTERED', 'ATTENDED', 'ABSENT')),
    completion_status TEXT DEFAULT 'ENROLLED' CHECK (completion_status IN ('ENROLLED', 'COMPLETED', 'DROPPED')),
    certificate_issued BOOLEAN DEFAULT false,
    pre_training_score INTEGER,
    post_training_score INTEGER,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Training Reports Table
CREATE TABLE IF NOT EXISTS training_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES training_sessions(id) ON DELETE CASCADE,
    report_type TEXT CHECK (report_type IN ('SESSION_SUMMARY', 'MONTHLY', 'QUARTERLY', 'ANNUAL')),
    title TEXT NOT NULL,
    content JSONB,
    file_url TEXT,
    generated_by TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Training Resources Table
CREATE TABLE IF NOT EXISTS training_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES training_sessions(id) ON DELETE CASCADE,
    resource_type TEXT CHECK (resource_type IN ('PRESENTATION', 'DOCUMENT', 'VIDEO', 'MANUAL', 'ASSESSMENT')),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    uploaded_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Geographic Coverage Tracking
CREATE TABLE IF NOT EXISTS training_coverage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    total_sessions INTEGER DEFAULT 0,
    total_participants INTEGER DEFAULT 0,
    last_training_date DATE,
    coverage_score DECIMAL(5, 2), -- Calculated field for gap analysis
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE training_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_reports ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_training_sessions_state ON training_sessions(state);
CREATE INDEX IF NOT EXISTS idx_training_sessions_date ON training_sessions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_training_sessions_status ON training_sessions(status);
CREATE INDEX IF NOT EXISTS idx_training_sessions_partner ON training_sessions(partner_id);
CREATE INDEX IF NOT EXISTS idx_training_participants_session ON training_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_training_coverage_state_district ON training_coverage(state, district);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_training_partners_updated_at BEFORE UPDATE ON training_partners 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_sessions_updated_at BEFORE UPDATE ON training_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_coverage_updated_at BEFORE UPDATE ON training_coverage 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();