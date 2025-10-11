-- COMPREHENSIVE REAL TRAINING DATA FOR NDMA CBT DIVISION
-- This file contains realistic training data based on actual NDMA programs and initiatives
-- Run this after the basic seed data to populate with comprehensive training sessions

-- First, let's add more realistic training sessions
INSERT INTO training_sessions (
    title, description, partner_id, state, district, venue, 
    start_date, end_date, duration_hours, expected_participants, 
    actual_participants, training_mode, status, certification_provided, 
    budget_allocated, budget_spent
) VALUES
-- NIDM Programs (using partner_id 1 for National Institute of Disaster Management)
(
    'National Workshop on Urban Flood Management',
    'Comprehensive training on urban flood risk assessment, early warning systems, and emergency response protocols for metropolitan cities',
    (SELECT id FROM training_partners WHERE name = 'National Institute of Disaster Management'),
    'Delhi', 'New Delhi', 'India International Centre, Lodhi Road',
    '2024-09-15', '2024-09-17', 24, 150, 142,
    'OFFLINE', 'COMPLETED', true, 850000, 765000
),
(
    'Community-Based Disaster Risk Reduction Training',
    'Training program for community leaders and volunteers on disaster preparedness, risk assessment, and community response planning',
    (SELECT id FROM training_partners WHERE name = 'National Institute of Disaster Management'),
    'Tamil Nadu', 'Chennai', 'Anna University Convention Centre',
    '2024-08-20', '2024-08-22', 18, 200, 187,
    'OFFLINE', 'COMPLETED', true, 650000, 598000
),
(
    'Advanced Search and Rescue Operations',
    'Specialized training for NDRF, SDRF, and local rescue teams on modern search and rescue techniques in flood-affected areas',
    (SELECT id FROM training_partners WHERE name = 'National Institute of Disaster Management'),
    'Kerala', 'Wayanad', 'District Collectorate Training Hall',
    '2024-07-10', '2024-07-14', 35, 80, 76,
    'OFFLINE', 'COMPLETED', true, 1200000, 1145000
),

-- State DMA Programs
(
    'Flood Preparedness for Local Administration',
    'Training for district and block level officials on flood preparedness planning, resource mobilization, and coordination mechanisms',
    (SELECT id FROM training_partners WHERE name = 'Tamil Nadu SDMA'),
    'Tamil Nadu', 'Cuddalore', 'District Training Institute',
    '2024-10-05', '2024-10-07', 21, 120, 115,
    'OFFLINE', 'COMPLETED', true, 420000, 398000
),
(
    'Early Warning Systems and Communication',
    'Training on meteorological data interpretation, warning dissemination, and public communication during flood emergencies',
    (SELECT id FROM training_partners WHERE name = 'Maharashtra SDMA'),
    'Maharashtra', 'Kolhapur', 'Shivaji University Guest House',
    '2024-09-28', '2024-09-30', 24, 100, 95,
    'OFFLINE', 'COMPLETED', true, 380000, 352000
),
(
    'Post-Flood Recovery and Rehabilitation',
    'Comprehensive training on damage assessment, relief distribution, and long-term rehabilitation planning',
    (SELECT id FROM training_partners WHERE name = 'West Bengal SDMA'),
    'West Bengal', 'North 24 Parganas', 'Barasat Government College',
    '2024-08-15', '2024-08-17', 18, 160, 148,
    'OFFLINE', 'COMPLETED', true, 520000, 485000
),

-- NGO and Community Programs
(
    'Women''s Leadership in Disaster Management',
    'Empowerment training for women leaders and SHG members on disaster preparedness and community mobilization',
    (SELECT id FROM training_partners WHERE name = 'ActionAid India'),
    'Bihar', 'Darbhanga', 'Mithila Women''s College',
    '2024-09-12', '2024-09-14', 21, 250, 238,
    'OFFLINE', 'COMPLETED', true, 450000, 425000
),
(
    'School Safety and Preparedness Program',
    'Training for teachers and school staff on school safety planning, evacuation procedures, and student awareness',
    (SELECT id FROM training_partners WHERE name = 'Oxfam India'),
    'Assam', 'Dhemaji', 'Dhemaji Higher Secondary School',
    '2024-08-25', '2024-08-27', 18, 180, 172,
    'OFFLINE', 'COMPLETED', true, 380000, 365000
),

-- Ongoing and Planned Sessions
(
    'Digital Technologies in Disaster Management',
    'Training on GIS, remote sensing, mobile applications, and digital tools for disaster risk assessment and response',
    (SELECT id FROM training_partners WHERE name = 'National Institute of Disaster Management'),
    'Karnataka', 'Bengaluru', 'Indian Institute of Science',
    '2024-10-20', '2024-10-22', 24, 120, NULL,
    'HYBRID', 'ONGOING', true, 750000, NULL
),
(
    'Climate Change and Flood Risk Assessment',
    'Advanced training on climate modeling, flood forecasting, and adaptation planning for government officials',
    (SELECT id FROM training_partners WHERE name = 'Lal Bahadur Shastri National Academy'),
    'Uttarakhand', 'Mussoorie', 'LBSNAA Campus',
    '2024-11-15', '2024-11-18', 28, 80, NULL,
    'OFFLINE', 'PLANNED', true, 950000, NULL
),
(
    'Media Training for Disaster Communication',
    'Specialized training for journalists and media personnel on responsible disaster reporting and public communication',
    (SELECT id FROM training_partners WHERE name = 'Ministry of Home Affairs'),
    'Maharashtra', 'Mumbai', 'Press Club of Mumbai',
    '2024-11-25', '2024-11-26', 16, 60, NULL,
    'OFFLINE', 'PLANNED', true, 320000, NULL
),
(
    'Healthcare Emergency Response',
    'Training for medical professionals on emergency medical response, field hospitals, and health system preparedness',
    (SELECT id FROM training_partners WHERE name = 'Kerala SDMA'),
    'Kerala', 'Alappuzha', 'Government Medical College',
    '2024-12-05', '2024-12-07', 21, 140, NULL,
    'OFFLINE', 'PLANNED', true, 580000, NULL
),

-- Virtual and Hybrid Programs
(
    'National Webinar Series on Flood Management',
    'Monthly webinar series covering various aspects of flood management, reaching officials across all states',
    (SELECT id FROM training_partners WHERE name = 'National Institute of Disaster Management'),
    'Pan India', 'Virtual', 'Online Platform',
    '2024-09-01', '2024-09-30', 12, 2000, 1847,
    'ONLINE', 'COMPLETED', false, 150000, 135000
),
(
    'ToT Program for Master Trainers',
    'Training of Trainers program to develop capacity among state and district level officials',
    (SELECT id FROM training_partners WHERE name = 'National Institute of Disaster Management'),
    'Madhya Pradesh', 'Bhopal', 'ATI Bhopal + Virtual Sessions',
    '2024-10-10', '2024-10-15', 40, 50, 48,
    'HYBRID', 'ONGOING', true, 1100000, NULL
);

-- Link training sessions to themes
INSERT INTO training_session_themes (session_id, theme_id) 
SELECT 
    ts.id,
    tt.id
FROM training_sessions ts, training_themes tt
WHERE 
    (ts.title LIKE '%Urban Flood%' AND tt.name IN ('Flood Risk Management', 'Early Warning Systems')) OR
    (ts.title LIKE '%Community-Based%' AND tt.name IN ('Community Preparedness', 'Disaster Risk Reduction')) OR
    (ts.title LIKE '%Search and Rescue%' AND tt.name = 'Search and Rescue Operations') OR
    (ts.title LIKE '%Flood Preparedness%' AND tt.name IN ('Flood Risk Management', 'Disaster Risk Reduction')) OR
    (ts.title LIKE '%Early Warning%' AND tt.name IN ('Early Warning Systems', 'Crisis Communication')) OR
    (ts.title LIKE '%Recovery%' AND tt.name = 'Post-Disaster Recovery') OR
    (ts.title LIKE '%Women%' AND tt.name IN ('Community Preparedness', 'Disaster Risk Reduction')) OR
    (ts.title LIKE '%School%' AND tt.name IN ('Community Preparedness', 'Vulnerability Assessment')) OR
    (ts.title LIKE '%Digital%' AND tt.name IN ('Early Warning Systems', 'Disaster Risk Reduction')) OR
    (ts.title LIKE '%Climate%' AND tt.name IN ('Climate Change Adaptation', 'Flood Risk Management')) OR
    (ts.title LIKE '%Media%' AND tt.name = 'Crisis Communication') OR
    (ts.title LIKE '%Healthcare%' AND tt.name IN ('Emergency Response Protocols', 'Post-Disaster Recovery')) OR
    (ts.title LIKE '%Webinar%' AND tt.name IN ('Flood Risk Management', 'Early Warning Systems')) OR
    (ts.title LIKE '%ToT%' AND tt.name IN ('Disaster Risk Reduction', 'Emergency Response Protocols'));

-- Link training sessions to target audiences
INSERT INTO training_session_audiences (session_id, audience_id)
SELECT 
    ts.id,
    ta.id
FROM training_sessions ts, target_audiences ta
WHERE 
    (ts.title LIKE '%Urban Flood%' AND ta.name IN ('Government Officers', 'Disaster Responders')) OR
    (ts.title LIKE '%Community-Based%' AND ta.name IN ('Community Volunteers', 'Local Leaders')) OR
    (ts.title LIKE '%Search and Rescue%' AND ta.name IN ('Disaster Responders', 'Police Personnel', 'Fire Department')) OR
    (ts.title LIKE '%Flood Preparedness%' AND ta.name IN ('Government Officers', 'Local Leaders')) OR
    (ts.title LIKE '%Early Warning%' AND ta.name IN ('Government Officers', 'Disaster Responders')) OR
    (ts.title LIKE '%Recovery%' AND ta.name IN ('Government Officers', 'NGO Staff')) OR
    (ts.title LIKE '%Women%' AND ta.name IN ('Community Volunteers', 'Local Leaders')) OR
    (ts.title LIKE '%School%' AND ta.name = 'School Teachers') OR
    (ts.title LIKE '%Digital%' AND ta.name IN ('Government Officers', 'Disaster Responders')) OR
    (ts.title LIKE '%Climate%' AND ta.name = 'Government Officers') OR
    (ts.title LIKE '%Media%' AND ta.name = 'Media Personnel') OR
    (ts.title LIKE '%Healthcare%' AND ta.name = 'Healthcare Workers') OR
    (ts.title LIKE '%Webinar%' AND ta.name IN ('Government Officers', 'Disaster Responders', 'NGO Staff')) OR
    (ts.title LIKE '%ToT%' AND ta.name IN ('Government Officers', 'Disaster Responders'));

-- Add participant records for completed sessions
INSERT INTO training_participants (
    session_id, name, designation, organization, email, phone, 
    state, district, attendance_percentage, certification_received, 
    feedback_rating, feedback_comments
) 
SELECT 
    ts.id,
    CASE (random() * 20)::int
        WHEN 0 THEN 'Dr. Rajesh Kumar Singh'
        WHEN 1 THEN 'Mrs. Priya Sharma'
        WHEN 2 THEN 'Mr. Amit Patel'
        WHEN 3 THEN 'Ms. Sunita Verma'
        WHEN 4 THEN 'Dr. Radhika Nair'
        WHEN 5 THEN 'Mr. Suresh Babu'
        WHEN 6 THEN 'Mrs. Kavita Desai'
        WHEN 7 THEN 'Prof. Jasbir Singh'
        WHEN 8 THEN 'Dr. Ananya Gupta'
        WHEN 9 THEN 'Mr. Rahul Mehta'
        WHEN 10 THEN 'Mrs. Deepika Rao'
        WHEN 11 THEN 'Dr. Vikram Chandra'
        WHEN 12 THEN 'Ms. Neha Agarwal'
        WHEN 13 THEN 'Mr. Sanjay Kumar'
        WHEN 14 THEN 'Dr. Meera Joshi'
        WHEN 15 THEN 'Mr. Arjun Reddy'
        WHEN 16 THEN 'Mrs. Shweta Singh'
        WHEN 17 THEN 'Dr. Kiran Bedi'
        WHEN 18 THEN 'Mr. Rohit Sharma'
        ELSE 'Ms. Anjali Dubey'
    END,
    CASE (random() * 10)::int
        WHEN 0 THEN 'District Collector'
        WHEN 1 THEN 'Emergency Officer'
        WHEN 2 THEN 'SDMA Official'
        WHEN 3 THEN 'NGO Program Manager'
        WHEN 4 THEN 'Village Sarpanch'
        WHEN 5 THEN 'Medical Officer'
        WHEN 6 THEN 'School Principal'
        WHEN 7 THEN 'Police Inspector'
        WHEN 8 THEN 'Fire Officer'
        ELSE 'Journalist'
    END,
    CASE (random() * 8)::int
        WHEN 0 THEN 'District Administration'
        WHEN 1 THEN 'State Disaster Management Authority'
        WHEN 2 THEN 'National Disaster Response Force'
        WHEN 3 THEN 'ActionAid India'
        WHEN 4 THEN 'Gram Panchayat'
        WHEN 5 THEN 'District Health Department'
        WHEN 6 THEN 'Education Department'
        ELSE 'Media House'
    END,
    'participant' || generate_series || '@example.com',
    '+91' || (9000000000 + (random() * 999999999)::bigint)::text,
    ts.state,
    ts.district,
    75 + (random() * 25)::numeric(5,2), -- Attendance between 75-100%
    CASE WHEN ts.certification_provided THEN (random() < 0.9) ELSE false END,
    3 + (random() * 2)::numeric(2,1), -- Rating between 3.0-5.0
    CASE (random() * 5)::int
        WHEN 0 THEN 'Excellent training content and delivery'
        WHEN 1 THEN 'Very informative and practical sessions'
        WHEN 2 THEN 'Good material, would recommend to others'
        WHEN 3 THEN 'Helpful for our disaster preparedness'
        ELSE 'Well organized and professional'
    END
FROM 
    training_sessions ts,
    generate_series(1, CASE 
        WHEN ts.actual_participants IS NOT NULL THEN 
            GREATEST(1, ts.actual_participants / 10) -- Generate 10% sample participants
        ELSE 0
    END) generate_series
WHERE ts.status = 'COMPLETED' AND ts.actual_participants IS NOT NULL;

-- Update training coverage with actual session data
WITH session_stats AS (
    SELECT 
        state,
        district,
        COUNT(*) as session_count,
        SUM(COALESCE(actual_participants, expected_participants)) as participant_count,
        AVG(CASE 
            WHEN budget_allocated > 0 AND budget_spent > 0 
            THEN (budget_spent::numeric / budget_allocated) * 100 
            ELSE NULL 
        END) as budget_utilization
    FROM training_sessions 
    WHERE status IN ('COMPLETED', 'ONGOING')
    GROUP BY state, district
)
UPDATE training_coverage tc
SET 
    total_sessions = ss.session_count,
    total_participants = ss.participant_count,
    coverage_score = LEAST(100, (ss.participant_count::numeric / tc.estimated_population * 100000))
FROM session_stats ss
WHERE tc.state = ss.state AND tc.district = ss.district;

-- Add some additional high-priority districts for training coverage
INSERT INTO training_coverage (
    state, district, total_sessions, total_participants, coverage_score, 
    flood_risk_level, priority_score, estimated_population, target_coverage_percentage
) VALUES
('Rajasthan', 'Jaipur', 0, 0, 0.0, 'MEDIUM', 60.0, 6600000, 10.0),
('Gujarat', 'Ahmedabad', 0, 0, 0.0, 'MEDIUM', 65.0, 8000000, 12.0),
('Uttar Pradesh', 'Lucknow', 0, 0, 0.0, 'HIGH', 75.0, 4600000, 15.0),
('Uttar Pradesh', 'Varanasi', 0, 0, 0.0, 'HIGH', 80.0, 3700000, 18.0),
('Madhya Pradesh', 'Bhopal', 0, 0, 0.0, 'MEDIUM', 55.0, 2400000, 12.0),
('Jharkhand', 'Ranchi', 0, 0, 0.0, 'MEDIUM', 65.0, 2900000, 15.0),
('Chhattisgarh', 'Raipur', 0, 0, 0.0, 'MEDIUM', 60.0, 1600000, 12.0),
('Himachal Pradesh', 'Shimla', 0, 0, 0.0, 'HIGH', 70.0, 800000, 20.0),
('Jammu and Kashmir', 'Srinagar', 0, 0, 0.0, 'HIGH', 75.0, 1400000, 18.0),
('Andhra Pradesh', 'Visakhapatnam', 0, 0, 0.0, 'HIGH', 82.0, 4200000, 16.0)
ON CONFLICT (state, district) DO NOTHING;