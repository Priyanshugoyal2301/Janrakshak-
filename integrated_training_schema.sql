-- INTEGRATED TRAINING MANAGEMENT SYSTEM
-- This integrates with your existing JalRakshak database schema
-- Run these queries AFTER your existing schema is in place

-- 1. Training Partners/Organizations Table
CREATE TABLE IF NOT EXISTS public.training_partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('NIDM', 'LBSNAA', 'SDMA', 'ATI', 'NGO', 'GOI_MINISTRY', 'OTHER')),
    state TEXT,
    district TEXT,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    coordinates JSONB, -- Using same format as your existing tables
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Training Themes Table
CREATE TABLE IF NOT EXISTS public.training_themes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT CHECK (category IN ('DISASTER_PREPAREDNESS', 'RESPONSE', 'RECOVERY', 'MITIGATION', 'CAPACITY_BUILDING')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Training Sessions Table (Enhanced to integrate with your system)
CREATE TABLE IF NOT EXISTS public.training_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    partner_id UUID REFERENCES public.training_partners(id),
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    venue TEXT,
    coordinates JSONB, -- Same format as your admin_shelters
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
    
    -- Integration with existing user system
    created_by TEXT, -- Can reference firebase_uid from user_profiles
    instructor_id TEXT, -- Reference to user_profiles for instructors
    
    -- Metadata for analytics (similar to your admin tables)
    metadata JSONB DEFAULT '{}'::JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Target Audiences Table
CREATE TABLE IF NOT EXISTS public.target_audiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Training Session Themes (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.training_session_themes (
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
    theme_id UUID REFERENCES public.training_themes(id) ON DELETE CASCADE,
    PRIMARY KEY (session_id, theme_id)
);

-- 6. Training Session Audiences (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.training_session_audiences (
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
    audience_id UUID REFERENCES public.target_audiences(id) ON DELETE CASCADE,
    expected_count INTEGER,
    actual_count INTEGER DEFAULT 0,
    PRIMARY KEY (session_id, audience_id)
);

-- 7. Training Participants (Enhanced to integrate with user_profiles)
CREATE TABLE IF NOT EXISTS public.training_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
    
    -- User integration - can link to existing users or be standalone
    user_profile_id UUID REFERENCES public.user_profiles(id), -- Link to existing users
    
    -- Standalone participant data (for non-registered users)
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    organization TEXT,
    designation TEXT,
    audience_type_id UUID REFERENCES public.target_audiences(id),
    
    -- Training specific data
    attendance_status TEXT DEFAULT 'REGISTERED' CHECK (attendance_status IN ('REGISTERED', 'ATTENDED', 'ABSENT')),
    completion_status TEXT DEFAULT 'ENROLLED' CHECK (completion_status IN ('ENROLLED', 'COMPLETED', 'DROPPED')),
    certificate_issued BOOLEAN DEFAULT false,
    certificate_url TEXT, -- Store certificate file URL
    
    -- Assessment scores
    pre_training_score INTEGER,
    post_training_score INTEGER,
    improvement_percentage DECIMAL(5, 2), -- Calculated field
    
    -- Feedback
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Training Resources Table
CREATE TABLE IF NOT EXISTS public.training_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
    resource_type TEXT CHECK (resource_type IN ('PRESENTATION', 'DOCUMENT', 'VIDEO', 'MANUAL', 'ASSESSMENT', 'CERTIFICATE_TEMPLATE')),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    file_size INTEGER, -- In bytes
    file_type TEXT, -- MIME type
    uploaded_by TEXT, -- Reference to firebase_uid
    is_public BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Training Reports (Integrates with your admin system)
CREATE TABLE IF NOT EXISTS public.training_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
    report_type TEXT CHECK (report_type IN ('SESSION_SUMMARY', 'MONTHLY', 'QUARTERLY', 'ANNUAL', 'CUSTOM')),
    title TEXT NOT NULL,
    
    -- Report data (similar to your admin_analytics_cache structure)
    content JSONB,
    
    -- File storage
    file_url TEXT,
    
    -- Metadata
    generated_by TEXT, -- firebase_uid of generator
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Report parameters
    filters JSONB DEFAULT '{}'::JSONB, -- Store the filters used to generate report
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Training Coverage Analytics (State/District tracking)
CREATE TABLE IF NOT EXISTS public.training_coverage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    
    -- Training statistics
    total_sessions INTEGER DEFAULT 0,
    total_participants INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    
    -- Coverage metrics
    coverage_score DECIMAL(5, 2) DEFAULT 0.0, -- 0-100 percentage
    last_training_date DATE,
    
    -- Population data for coverage calculation
    estimated_population INTEGER,
    target_coverage_percentage DECIMAL(5, 2) DEFAULT 10.0, -- Target percentage of population to train
    
    -- Risk correlation (integrate with your flood data)
    flood_risk_level TEXT CHECK (flood_risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    priority_score DECIMAL(5, 2) DEFAULT 0.0, -- Calculated priority for training
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Training Notifications (Extends your admin_notifications)
CREATE TABLE IF NOT EXISTS public.training_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Link to existing user system
    user_id TEXT NOT NULL, -- firebase_uid
    
    -- Training specific data
    session_id UUID REFERENCES public.training_sessions(id),
    
    notification_type TEXT CHECK (notification_type IN (
        'SESSION_REMINDER', 'ENROLLMENT_CONFIRMATION', 'COMPLETION_CERTIFICATE', 
        'FEEDBACK_REQUEST', 'UPCOMING_TRAINING', 'CANCELLATION'
    )),
    
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Delivery tracking
    status TEXT DEFAULT 'SENT' CHECK (status IN ('SENT', 'DELIVERED', 'READ', 'FAILED')),
    delivery_method TEXT CHECK (delivery_method IN ('EMAIL', 'SMS', 'IN_APP', 'PUSH')),
    
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Training Feedback & Assessments
CREATE TABLE IF NOT EXISTS public.training_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES public.training_participants(id) ON DELETE CASCADE,
    
    assessment_type TEXT CHECK (assessment_type IN ('PRE_TRAINING', 'POST_TRAINING', 'FEEDBACK', 'SKILL_TEST')),
    
    -- Structured assessment data
    questions JSONB, -- Store questions and answers
    responses JSONB, -- Store participant responses
    score DECIMAL(5, 2),
    max_score DECIMAL(5, 2),
    percentage DECIMAL(5, 2),
    
    -- Feedback specific
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    content_rating INTEGER CHECK (content_rating >= 1 AND content_rating <= 5),
    instructor_rating INTEGER CHECK (instructor_rating >= 1 AND instructor_rating <= 5),
    venue_rating INTEGER CHECK (venue_rating >= 1 AND venue_rating <= 5),
    
    comments TEXT,
    suggestions TEXT,
    
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (like your existing tables)
ALTER TABLE public.training_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_notifications ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance (following your pattern)
CREATE INDEX IF NOT EXISTS idx_training_sessions_state ON public.training_sessions(state);
CREATE INDEX IF NOT EXISTS idx_training_sessions_date ON public.training_sessions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_training_sessions_status ON public.training_sessions(status);
CREATE INDEX IF NOT EXISTS idx_training_sessions_partner ON public.training_sessions(partner_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_created_by ON public.training_sessions(created_by);

CREATE INDEX IF NOT EXISTS idx_training_participants_session ON public.training_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_training_participants_user ON public.training_participants(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_training_participants_status ON public.training_participants(attendance_status, completion_status);

CREATE INDEX IF NOT EXISTS idx_training_coverage_state_district ON public.training_coverage(state, district);
CREATE INDEX IF NOT EXISTS idx_training_coverage_priority ON public.training_coverage(priority_score DESC);

CREATE INDEX IF NOT EXISTS idx_training_notifications_user ON public.training_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_training_notifications_session ON public.training_notifications(session_id);
CREATE INDEX IF NOT EXISTS idx_training_notifications_type ON public.training_notifications(notification_type);

-- Create trigger function for updated_at (reuse if you already have it)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_training_partners_updated_at 
    BEFORE UPDATE ON public.training_partners 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_sessions_updated_at 
    BEFORE UPDATE ON public.training_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_coverage_updated_at 
    BEFORE UPDATE ON public.training_coverage 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to automatically update training coverage when sessions are completed
CREATE OR REPLACE FUNCTION update_training_coverage_on_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'COMPLETED' AND OLD.status != 'COMPLETED' THEN
        -- Update or insert training coverage data
        INSERT INTO public.training_coverage (state, district, total_sessions, total_participants, last_training_date, updated_at)
        VALUES (NEW.state, NEW.district, 1, COALESCE(NEW.actual_participants, 0), NEW.end_date, NOW())
        ON CONFLICT (state, district) 
        DO UPDATE SET 
            total_sessions = public.training_coverage.total_sessions + 1,
            total_participants = public.training_coverage.total_participants + COALESCE(NEW.actual_participants, 0),
            last_training_date = GREATEST(public.training_coverage.last_training_date, NEW.end_date),
            updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to automatically update coverage
CREATE TRIGGER trigger_update_training_coverage 
    AFTER UPDATE ON public.training_sessions
    FOR EACH ROW EXECUTE FUNCTION update_training_coverage_on_completion();

-- Create a view for training analytics dashboard
CREATE OR REPLACE VIEW public.training_dashboard_stats AS
SELECT 
    COUNT(*)::INTEGER as total_sessions,
    COUNT(*) FILTER (WHERE status = 'COMPLETED')::INTEGER as completed_sessions,
    COUNT(*) FILTER (WHERE status = 'ONGOING')::INTEGER as ongoing_sessions,
    COUNT(*) FILTER (WHERE status = 'PLANNED')::INTEGER as planned_sessions,
    COALESCE(SUM(actual_participants), 0)::INTEGER as total_participants,
    COUNT(DISTINCT state)::INTEGER as states_covered,
    COUNT(DISTINCT district)::INTEGER as districts_covered,
    COALESCE(AVG(feedback_score), 0)::DECIMAL(3,2) as avg_feedback_score,
    CASE 
        WHEN COUNT(*) > 0 THEN 
            ROUND((COUNT(*) FILTER (WHERE status = 'COMPLETED')::DECIMAL / COUNT(*)) * 100, 2)
        ELSE 0 
    END as completion_rate
FROM public.training_sessions
WHERE created_at >= CURRENT_DATE - INTERVAL '1 year';

-- Grant appropriate permissions (adjust based on your RLS policies)
-- These should match your existing permission structure