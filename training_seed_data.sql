-- INTEGRATED TRAINING SEED DATA
-- Run after creating the integrated training schema
-- This data aligns with your existing JalRakshak system

-- Insert Training Themes (Disaster Management focused)
INSERT INTO training_themes (name, description, category) VALUES
('Flood Risk Management', 'Training on flood risk assessment and management strategies', 'DISASTER_PREPAREDNESS'),
('Emergency Response Protocols', 'Standard operating procedures for disaster response', 'RESPONSE'),
('Community Preparedness', 'Training communities for disaster preparedness', 'DISASTER_PREPAREDNESS'),
('Early Warning Systems', 'Understanding and operating early warning systems', 'MITIGATION'),
('Search and Rescue Operations', 'Techniques and protocols for search and rescue', 'RESPONSE'),
('Post-Disaster Recovery', 'Recovery and rehabilitation after disasters', 'RECOVERY'),
('Climate Change Adaptation', 'Adapting to climate change impacts', 'MITIGATION'),
('Disaster Risk Reduction', 'Comprehensive disaster risk reduction strategies', 'MITIGATION'),
('Crisis Communication', 'Effective communication during emergencies', 'RESPONSE'),
('Vulnerability Assessment', 'Assessing community and infrastructure vulnerabilities', 'DISASTER_PREPAREDNESS')
ON CONFLICT (name) DO NOTHING;

-- Insert Target Audiences
INSERT INTO target_audiences (name, description) VALUES
('Government Officers', 'Central and state government officials'),
('Disaster Responders', 'Emergency response team members'),
('Community Volunteers', 'Local community disaster volunteers'),
('NGO Staff', 'Non-governmental organization personnel'),
('Local Leaders', 'Panchayat leaders and local representatives'),
('Healthcare Workers', 'Medical and health sector personnel'),
('School Teachers', 'Educational institution staff'),
('Police Personnel', 'Law enforcement officers'),
('Fire Department', 'Fire and rescue service personnel'),
('Media Personnel', 'Journalists and media representatives')
ON CONFLICT (name) DO NOTHING;

-- Insert Sample Training Partners
INSERT INTO training_partners (name, type, state, contact_person, email) VALUES
('National Institute of Disaster Management', 'NIDM', 'Delhi', 'Dr. Rajesh Kumar', 'rajesh@nidm.gov.in'),
('Lal Bahadur Shastri National Academy', 'LBSNAA', 'Uttarakhand', 'Dr. Priya Sharma', 'priya@lbsnaa.gov.in'),
('Tamil Nadu SDMA', 'SDMA', 'Tamil Nadu', 'Mr. Suresh Babu', 'suresh@tnsdma.gov.in'),
('Maharashtra SDMA', 'SDMA', 'Maharashtra', 'Mrs. Kavita Desai', 'kavita@mahasdma.gov.in'),
('Kerala SDMA', 'SDMA', 'Kerala', 'Dr. Radhika Nair', 'radhika@keralsdma.gov.in'),
('West Bengal SDMA', 'SDMA', 'West Bengal', 'Mr. Amit Roy', 'amit@wbsdma.gov.in'),
('Disaster Management Institute - ATI Punjab', 'ATI', 'Punjab', 'Prof. Jasbir Singh', 'jasbir@ati.punjab.gov.in'),
('ActionAid India', 'NGO', 'Delhi', 'Ms. Sunita Verma', 'sunita@actionaid.org'),
('Oxfam India', 'NGO', 'Delhi', 'Mr. Rahul Gupta', 'rahul@oxfam.org.in'),
('Ministry of Home Affairs', 'GOI_MINISTRY', 'Delhi', 'Secretary DM', 'secretary@mha.gov.in');

-- Insert Training Coverage data aligned with your flood prediction locations
INSERT INTO public.training_coverage (
    state, district, total_sessions, total_participants, coverage_score, 
    flood_risk_level, priority_score, estimated_population, target_coverage_percentage
) VALUES
-- High priority flood-prone areas from your LOCATION_COORDS
('Tamil Nadu', 'Chennai', 0, 0, 0.0, 'HIGH', 85.0, 8500000, 15.0),
('Telangana', 'Hyderabad', 0, 0, 0.0, 'MEDIUM', 70.0, 10000000, 12.0),
('Maharashtra', 'Kolhapur', 0, 0, 0.0, 'HIGH', 90.0, 600000, 20.0),
('Maharashtra', 'Sangli', 0, 0, 0.0, 'HIGH', 88.0, 500000, 20.0),
('Maharashtra', 'Satara', 0, 0, 0.0, 'MEDIUM', 65.0, 700000, 15.0),
('Kerala', 'Wayanad', 0, 0, 0.0, 'CRITICAL', 95.0, 850000, 25.0),
('Kerala', 'Idukki', 0, 0, 0.0, 'HIGH', 80.0, 1100000, 18.0),
('Punjab', 'Ludhiana', 0, 0, 0.0, 'MEDIUM', 60.0, 3500000, 10.0),
('Punjab', 'Firozpur', 0, 0, 0.0, 'MEDIUM', 55.0, 600000, 12.0),
('West Bengal', 'Kolkata', 0, 0, 0.0, 'HIGH', 85.0, 14000000, 15.0),

-- Additional high-risk districts
('Tamil Nadu', 'Cuddalore', 0, 0, 0.0, 'HIGH', 82.0, 2600000, 18.0),
('Tamil Nadu', 'Thanjavur', 0, 0, 0.0, 'HIGH', 78.0, 2400000, 16.0),
('Maharashtra', 'Mumbai', 0, 0, 0.0, 'HIGH', 87.0, 20000000, 12.0),
('Maharashtra', 'Pune', 0, 0, 0.0, 'MEDIUM', 68.0, 9400000, 10.0),
('Kerala', 'Alappuzha', 0, 0, 0.0, 'CRITICAL', 92.0, 2100000, 22.0),
('Kerala', 'Kottayam', 0, 0, 0.0, 'HIGH', 75.0, 2000000, 18.0),
('West Bengal', 'North 24 Parganas', 0, 0, 0.0, 'HIGH', 88.0, 10000000, 20.0),
('West Bengal', 'South 24 Parganas', 0, 0, 0.0, 'CRITICAL', 95.0, 8200000, 25.0),
('Assam', 'Dhemaji', 0, 0, 0.0, 'CRITICAL', 98.0, 700000, 30.0),
('Assam', 'Lakhimpur', 0, 0, 0.0, 'HIGH', 85.0, 1000000, 22.0),
('Bihar', 'Darbhanga', 0, 0, 0.0, 'CRITICAL', 92.0, 3900000, 25.0),
('Bihar', 'Muzaffarpur', 0, 0, 0.0, 'HIGH', 80.0, 4800000, 20.0),
('Odisha', 'Cuttack', 0, 0, 0.0, 'HIGH', 85.0, 2600000, 18.0),
('Odisha', 'Puri', 0, 0, 0.0, 'HIGH', 78.0, 1700000, 20.0),
('Uttarakhand', 'Haridwar', 0, 0, 0.0, 'MEDIUM', 70.0, 1900000, 15.0);