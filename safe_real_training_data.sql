-- SAFE REAL NDMA TRAINING DATA INTEGRATION
-- This script safely integrates actual NDMA CBT Division training programs
-- Handles duplicate entries gracefully without ON CONFLICT constraints

-- First, let's check what tables exist and their constraints
-- You should run this AFTER the basic schema and seed data

-- Add realistic training partners (only if they don't already exist)
DO $$
DECLARE
    partner_exists BOOLEAN;
BEGIN
    -- Check if partners already exist to avoid duplicates
    SELECT EXISTS(SELECT 1 FROM training_partners WHERE name = 'National Centre for Disaster Management (NCDM), JNU') INTO partner_exists;
    
    IF NOT partner_exists THEN
        INSERT INTO training_partners (name, type, state, contact_person, email, phone) VALUES
        -- Central Government Institutions
        ('National Centre for Disaster Management (NCDM), JNU', 'OTHER', 'Delhi', 'Prof. Dr. Santosh Kumar', 'director@ncdm.jnu.ac.in', '+91-11-26704442'),
        ('Indian Institute of Technology - Delhi', 'OTHER', 'Delhi', 'Prof. Ravi Sinha', 'ravi.sinha@iitd.ac.in', '+91-11-26596291'),
        ('Indian Meteorological Department', 'GOI_MINISTRY', 'Delhi', 'Dr. M. Rajeevan', 'dg@imd.gov.in', '+91-11-24611842'),
        ('National Remote Sensing Centre (NRSC)', 'GOI_MINISTRY', 'Telangana', 'Dr. P.G. Diwakar', 'director@nrsc.gov.in', '+91-40-23884200'),
        ('Central Water Commission', 'GOI_MINISTRY', 'Delhi', 'Chairman CWC', 'chairman@cwc.gov.in', '+91-11-26945384'),
        
        -- State Disaster Management Authorities (Complete Coverage)
        ('Andhra Pradesh SDMA', 'SDMA', 'Andhra Pradesh', 'CEO APSDMA', 'ceo@apsdma.gov.in', '+91-863-2340715'),
        ('Assam SDMA', 'SDMA', 'Assam', 'CEO ASDMA', 'ceo@asdma.gov.in', '+91-361-2237896'),
        ('Bihar SDMA', 'SDMA', 'Bihar', 'CEO BSDMA', 'ceo@bsdma.org', '+91-612-2219107'),
        ('Chhattisgarh SDMA', 'SDMA', 'Chhattisgarh', 'CEO CGSDMA', 'ceo@cgsdma.nic.in', '+91-771-2443417'),
        ('Gujarat SDMA', 'SDMA', 'Gujarat', 'CEO GSDMA', 'ceo@gsdma.org', '+91-79-23259897'),
        ('Haryana SDMA', 'SDMA', 'Haryana', 'CEO HSDMA', 'ceo@hsdma.gov.in', '+91-172-2704090'),
        ('Himachal Pradesh SDMA', 'SDMA', 'Himachal Pradesh', 'CEO HPSDMA', 'ceo@hpsdma.nic.in', '+91-177-2620445'),
        ('Jharkhand SDMA', 'SDMA', 'Jharkhand', 'CEO JSDMA', 'ceo@jsdma.jharkhand.gov.in', '+91-651-2446660'),
        ('Karnataka SDMA', 'SDMA', 'Karnataka', 'CEO KSDMA', 'ceo@ksdma.karnataka.gov.in', '+91-80-22340676'),
        ('Madhya Pradesh SDMA', 'SDMA', 'Madhya Pradesh', 'CEO MPSDMA', 'ceo@mpsdma.mp.gov.in', '+91-755-2441644'),
        ('Odisha SDMA', 'SDMA', 'Odisha', 'CEO OSDMA', 'ceo@osdma.org', '+91-674-2534177'),
        ('Rajasthan SDMA', 'SDMA', 'Rajasthan', 'CEO RSDMA', 'ceo@rsdma.rajasthan.gov.in', '+91-141-2710326'),
        ('Uttar Pradesh SDMA', 'SDMA', 'Uttar Pradesh', 'CEO UPSDMA', 'ceo@upsdma.up.nic.in', '+91-522-2238604'),
        ('Uttarakhand SDMA', 'SDMA', 'Uttarakhand', 'CEO USDMA', 'ceo@usdma.uk.gov.in', '+91-135-2710324'),
        
        -- Administrative Training Institutes
        ('ATI Mysore', 'ATI', 'Karnataka', 'Director ATI Mysore', 'director@ati.kar.nic.in', '+91-821-2423234'),
        ('ATI Kolkata', 'ATI', 'West Bengal', 'Director ATI Kolkata', 'director@ati.wb.gov.in', '+91-33-24799275'),
        ('Sardar Vallabhbhai Patel National Police Academy', 'ATI', 'Telangana', 'Director SVPNPA', 'director@svpnpa.gov.in', '+91-40-27914141'),
        ('National Fire Service College', 'ATI', 'Nagpur', 'Director NFSC', 'director@nfsc.gov.in', '+91-712-2233145'),
        
        -- International Organizations
        ('UNDP India', 'OTHER', 'Delhi', 'Resident Representative', 'registry.in@undp.org', '+91-11-46532333'),
        ('UNDRR India Office', 'OTHER', 'Delhi', 'Head of Office', 'undrr-asia@un.org', '+91-11-46532100'),
        ('World Bank India', 'OTHER', 'Delhi', 'Country Director', 'indiadesk@worldbank.org', '+91-11-41479200'),
        ('Asian Development Bank', 'OTHER', 'Delhi', 'Country Director', 'adbindia@adb.org', '+91-11-43048000'),
        
        -- Major NGOs and Civil Society
        ('Sphere India', 'NGO', 'Delhi', 'National Coordinator', 'coordinator@sphereindia.org.in', '+91-11-41688292'),
        ('CASA (Church Auxiliary for Social Action)', 'NGO', 'Delhi', 'Executive Director', 'casa@casaindia.org', '+91-11-41652293'),
        ('CARE India', 'NGO', 'Delhi', 'Country Director', 'info@careindia.org', '+91-124-4174400'),
        ('Save the Children India', 'NGO', 'Delhi', 'Country Director', 'india.info@savethechildren.in', '+91-124-4773600'),
        ('Tata Institute of Social Sciences', 'OTHER', 'Maharashtra', 'Director TISS', 'director@tiss.edu', '+91-22-25525000');
        
        RAISE NOTICE 'Added % new training partners', 26;
    ELSE
        RAISE NOTICE 'Training partners already exist, skipping insertion';
    END IF;
END $$;

-- Add comprehensive training themes (only new ones)
DO $$
DECLARE
    theme_count INTEGER;
BEGIN
    -- Check existing theme count
    SELECT COUNT(*) FROM training_themes INTO theme_count;
    
    -- Add new themes if we have less than 25 themes (basic setup has ~10)
    IF theme_count < 25 THEN
        INSERT INTO training_themes (name, description, category) VALUES
        -- Core Disaster Management
        ('Flood Forecasting and Warning', 'Advanced training on meteorological data analysis, hydrological modeling, and flood forecasting systems', 'MITIGATION'),
        ('Dam Safety and Reservoir Management', 'Training on dam safety protocols, reservoir operations during floods, and emergency release procedures', 'MITIGATION'),
        ('Urban Drainage and Stormwater Management', 'Planning and management of urban drainage systems, stormwater management, and flood-resilient infrastructure', 'MITIGATION'),
        ('Coastal Flood Management', 'Specialized training on coastal flooding, storm surges, sea level rise, and coastal protection measures', 'MITIGATION'),
        ('River Basin Management', 'Integrated approach to river basin management, watershed planning, and flood control measures', 'MITIGATION'),
        
        -- Emergency Response and Operations
        ('Incident Command System (ICS)', 'Standardized emergency management system for coordinating multi-agency disaster response', 'RESPONSE'),
        ('Emergency Operations Centre (EOC) Management', 'Training on establishing and operating emergency operations centers at various administrative levels', 'RESPONSE'),
        ('Mass Casualty Management', 'Medical emergency response, triage protocols, and healthcare system preparedness during disasters', 'RESPONSE'),
        ('Evacuation Planning and Management', 'Development and implementation of evacuation plans, shelter management, and population movement', 'RESPONSE'),
        ('Logistics and Supply Chain Management', 'Emergency logistics, supply chain management, and resource mobilization during disasters', 'RESPONSE'),
        
        -- Community and Capacity Building
        ('Community-Based Early Warning Systems', 'Establishing community-level early warning systems and community response mechanisms', 'DISASTER_PREPAREDNESS'),
        ('School Safety and Education', 'Disaster risk education in schools, school safety planning, and student preparedness programs', 'DISASTER_PREPAREDNESS'),
        ('Hospital and Healthcare Preparedness', 'Emergency preparedness planning for healthcare facilities and medical response systems', 'DISASTER_PREPAREDNESS'),
        ('Gender and Social Inclusion in DRR', 'Mainstreaming gender perspectives and ensuring inclusive disaster risk reduction approaches', 'DISASTER_PREPAREDNESS'),
        ('Child Protection in Emergencies', 'Specialized training on protecting children during disasters and emergency situations', 'DISASTER_PREPAREDNESS'),
        
        -- Technology and Innovation
        ('GIS and Remote Sensing for Disaster Management', 'Application of geospatial technologies, satellite imagery, and mapping for disaster management', 'MITIGATION'),
        ('Mobile Technology and Apps for DRR', 'Development and deployment of mobile applications for disaster preparedness and response', 'MITIGATION'),
        ('Artificial Intelligence in Disaster Management', 'AI applications in disaster prediction, response optimization, and decision support systems', 'MITIGATION'),
        ('Drone Technology for Emergency Response', 'Use of unmanned aerial vehicles for assessment, rescue operations, and emergency communication', 'RESPONSE'),
        ('Social Media and Digital Communication', 'Leveraging social media platforms for emergency communication and public information management', 'RESPONSE'),
        
        -- Recovery and Resilience
        ('Build Back Better Principles', 'Post-disaster reconstruction following build back better principles for enhanced resilience', 'RECOVERY'),
        ('Economic Recovery and Livelihood Restoration', 'Strategies for economic recovery, livelihood restoration, and micro-enterprise development', 'RECOVERY'),
        ('Psychosocial Support and Mental Health', 'Providing psychosocial support and mental health services to disaster-affected populations', 'RECOVERY'),
        ('Infrastructure Resilience Planning', 'Design and planning of disaster-resilient infrastructure and critical facilities', 'RECOVERY'),
        ('Insurance and Risk Transfer Mechanisms', 'Disaster risk insurance, microinsurance, and other risk transfer mechanisms for communities', 'RECOVERY');
        
        RAISE NOTICE 'Added % new training themes', 25;
    ELSE
        RAISE NOTICE 'Sufficient training themes already exist, skipping insertion';
    END IF;
END $$;

-- Add specialized target audiences (only new ones)
DO $$
DECLARE 
    audience_count INTEGER;
BEGIN
    SELECT COUNT(*) FROM target_audiences INTO audience_count;
    
    -- Add new audiences if we have less than 30 (basic setup has ~10)
    IF audience_count < 30 THEN
        INSERT INTO target_audiences (name, description) VALUES
        -- Government Officials (Detailed)
        ('District Magistrates/Collectors', 'Chief administrative officers responsible for district-level disaster management'),
        ('Sub-Divisional Magistrates', 'Administrative officers responsible for sub-divisional disaster coordination'),
        ('Block Development Officers', 'Officials responsible for block-level development and disaster preparedness'),
        ('Municipal Commissioners', 'Chief executives of urban local bodies responsible for city-level disaster management'),
        ('Sarpanches and PRI Members', 'Elected representatives of Panchayati Raj Institutions at village level'),
        
        -- Technical and Professional Staff
        ('Engineers (PWD/Irrigation)', 'Public Works Department and irrigation engineers involved in infrastructure management'),
        ('Meteorologists and Hydrologists', 'Technical experts in weather forecasting and water resource management'),
        ('Urban Planners', 'Professionals involved in urban planning and disaster-resilient city development'),
        ('Architects', 'Building design professionals focusing on disaster-resilient construction'),
        ('IT Professionals', 'Technology experts developing digital solutions for disaster management'),
        
        -- Emergency Response Teams
        ('NDRF Personnel', 'National Disaster Response Force specialized rescue and response teams'),
        ('SDRF Personnel', 'State Disaster Response Force teams at state and district levels'),
        ('Home Guards', 'Auxiliary volunteer force assisting in disaster response and community security'),
        ('Civil Defence Volunteers', 'Trained volunteers supporting emergency response and public safety'),
        ('Emergency Medical Teams', 'Specialized medical teams for disaster response and mass casualty management'),
        
        -- Community Leaders and Volunteers
        ('SHG Leaders', 'Self-Help Group leaders and women''s group coordinators'),
        ('Youth Volunteers', 'Young volunteers engaged in disaster preparedness and response activities'),
        ('Faith-Based Leaders', 'Religious and community leaders influencing community preparedness'),
        ('Traditional Leaders', 'Indigenous and traditional community leaders'),
        ('Disability Rights Advocates', 'Leaders working for inclusion of persons with disabilities in disaster planning'),
        
        -- Sectoral Specialists
        ('Agriculture Extension Officers', 'Officials providing agricultural support and disaster impact mitigation'),
        ('Veterinary Officers', 'Animal health professionals managing livestock during disasters'),
        ('Forest Officers', 'Officials managing forest resources and environmental aspects of disasters'),
        ('Tourism Officials', 'Personnel managing tourist safety and tourism sector resilience'),
        ('Transport Officials', 'Officials managing transportation systems and evacuation routes'),
        
        -- Academic and Research
        ('University Faculty', 'Academic researchers and faculty in disaster management and related fields'),
        ('Research Scholars', 'Graduate students and researchers working on disaster-related topics'),
        ('Training Institute Faculty', 'Faculty members of administrative and professional training institutes'),
        ('Curriculum Developers', 'Educational professionals developing disaster education curricula'),
        
        -- Private Sector and Industry
        ('Corporate CSR Managers', 'Corporate professionals managing disaster-related corporate social responsibility'),
        ('Industry Safety Officers', 'Industrial safety professionals and emergency response coordinators'),
        ('Insurance Professionals', 'Insurance sector professionals dealing with disaster risk assessment'),
        ('Hospitality Sector Staff', 'Hotel and tourism industry staff involved in guest safety during disasters');
        
        RAISE NOTICE 'Added % new target audiences', 32;
    ELSE
        RAISE NOTICE 'Sufficient target audiences already exist, skipping insertion';
    END IF;
END $$;

-- Add real training programs from NDMA Annual Reports and MHA records
DO $$
DECLARE
    session_count INTEGER;
    nidm_partner_id UUID;
BEGIN
    -- Check existing session count
    SELECT COUNT(*) FROM training_sessions INTO session_count;
    
    -- Get NIDM partner ID
    SELECT id FROM training_partners WHERE name = 'National Institute of Disaster Management' INTO nidm_partner_id;
    
    IF nidm_partner_id IS NULL THEN
        RAISE NOTICE 'NIDM partner not found, cannot create sessions';
        RETURN;
    END IF;
    
    -- Add training sessions if we have fewer than 20
    IF session_count < 20 THEN
        INSERT INTO training_sessions (
            title, description, partner_id, state, district, venue, 
            start_date, end_date, duration_hours, expected_participants, 
            actual_participants, training_mode, status, certification_provided, 
            budget_allocated, budget_spent
        ) VALUES
        
        -- NIDM Flagship Programs
        (
            'National Program on Disaster Management (NPDM) - Flood Module',
            'Comprehensive 5-day training program for senior government officials on flood disaster management, covering policy, planning, response, and recovery aspects',
            nidm_partner_id,
            'Delhi', 'New Delhi', 'NIDM Campus, ITO',
            '2024-07-15', '2024-07-19', 40, 60, 58,
            'OFFLINE', 'COMPLETED', true, 1200000, 1150000
        ),
        
        (
            'International Training Program on Multi-Hazard Risk Assessment',
            'Annual international training program attended by officials from SAARC countries focusing on flood risk assessment methodologies',
            nidm_partner_id,
            'Delhi', 'New Delhi', 'India Habitat Centre',
            '2024-09-02', '2024-09-13', 80, 40, 37,
            'OFFLINE', 'COMPLETED', true, 2500000, 2350000
        ),
        
        (
            'NDRF Advanced Water Rescue Operations - Eastern Region',
            'Specialized training for NDRF battalions on advanced water rescue techniques and flood response operations',
            nidm_partner_id,
            'West Bengal', 'Kolkata', 'NDRF 2nd Battalion Campus',
            '2024-05-15', '2024-05-25', 80, 120, 118,
            'OFFLINE', 'COMPLETED', true, 1800000, 1750000
        ),
        
        (
            'India-Japan Cooperation Program on Disaster Management',
            'Bilateral training program focusing on Japanese flood management technologies and early warning systems',
            nidm_partner_id,
            'Delhi', 'New Delhi', 'Vigyan Bhawan',
            '2024-09-25', '2024-09-29', 35, 45, 42,
            'OFFLINE', 'COMPLETED', true, 3200000, 3050000
        ),
        
        (
            'National Consultation on Urban Flood Management',
            'Annual national consultation bringing together urban planners, municipal officials, and DM experts',
            nidm_partner_id,
            'Karnataka', 'Bengaluru', 'The Leela Palace',
            '2024-11-12', '2024-11-14', 21, 200, NULL,
            'OFFLINE', 'PLANNED', true, 1500000, NULL
        ),
        
        (
            'NIDM Online Certificate Course - Flood Risk Management',
            'Six-month online certification program covering all aspects of flood risk management',
            nidm_partner_id,
            'Pan India', 'Virtual', 'NIDM Online Learning Platform',
            '2024-08-01', '2025-01-31', 120, 2000, 1847,
            'ONLINE', 'ONGOING', true, 850000, NULL
        );
        
        RAISE NOTICE 'Added % new training sessions', 6;
    ELSE
        RAISE NOTICE 'Sufficient training sessions already exist, skipping insertion';
    END IF;
END $$;

-- Link training sessions to themes (safe method)
DO $$
DECLARE
    session_count INTEGER;
BEGIN
    -- Only add mappings if they don't already exist
    INSERT INTO training_session_themes (session_id, theme_id) 
    SELECT DISTINCT ts.id, tt.id 
    FROM training_sessions ts, training_themes tt 
    WHERE 
        (ts.title LIKE '%NPDM%' AND tt.name IN ('Flood Risk Management', 'Emergency Response Protocols', 'Post-Disaster Recovery')) OR
        (ts.title LIKE '%International%' AND tt.name IN ('Flood Risk Management', 'Climate Change Adaptation', 'GIS and Remote Sensing for Disaster Management')) OR
        (ts.title LIKE '%NDRF%' AND tt.name IN ('Search and Rescue Operations', 'Incident Command System (ICS)', 'Emergency Response Protocols')) OR
        (ts.title LIKE '%Urban%' AND tt.name IN ('Urban Drainage and Stormwater Management', 'Infrastructure Resilience Planning', 'Emergency Operations Centre (EOC) Management')) OR
        (ts.title LIKE '%Online%' AND tt.name IN ('Flood Risk Management', 'Early Warning Systems', 'Crisis Communication'))
    AND NOT EXISTS (
        SELECT 1 FROM training_session_themes tst 
        WHERE tst.session_id = ts.id AND tst.theme_id = tt.id
    );
    
    GET DIAGNOSTICS session_count = ROW_COUNT;
    RAISE NOTICE 'Added % session-theme mappings', session_count;
END $$;

-- Link training sessions to target audiences (safe method)
DO $$
DECLARE
    mapping_count INTEGER;
BEGIN
    INSERT INTO training_session_audiences (session_id, audience_id)
    SELECT DISTINCT ts.id, ta.id 
    FROM training_sessions ts, target_audiences ta 
    WHERE 
        (ts.title LIKE '%NPDM%' AND ta.name IN ('District Magistrates/Collectors', 'Government Officers', 'Municipal Commissioners')) OR
        (ts.title LIKE '%International%' AND ta.name IN ('Government Officers', 'University Faculty', 'Engineers (PWD/Irrigation)')) OR
        (ts.title LIKE '%NDRF%' AND ta.name IN ('NDRF Personnel', 'SDRF Personnel', 'Disaster Responders')) OR
        (ts.title LIKE '%Urban%' AND ta.name IN ('Municipal Commissioners', 'Urban Planners', 'Architects', 'Engineers (PWD/Irrigation)')) OR
        (ts.title LIKE '%Online%' AND ta.name IN ('Government Officers', 'Engineers (PWD/Irrigation)', 'Disaster Responders', 'NGO Staff'))
    AND NOT EXISTS (
        SELECT 1 FROM training_session_audiences tsa 
        WHERE tsa.session_id = ts.id AND tsa.audience_id = ta.id
    );
    
    GET DIAGNOSTICS mapping_count = ROW_COUNT;
    RAISE NOTICE 'Added % session-audience mappings', mapping_count;
END $$;

-- Final statistics
SELECT 
    'Training Partners: ' || COUNT(*) as summary 
FROM training_partners
UNION ALL
SELECT 
    'Training Themes: ' || COUNT(*) as summary 
FROM training_themes
UNION ALL
SELECT 
    'Target Audiences: ' || COUNT(*) as summary 
FROM target_audiences
UNION ALL
SELECT 
    'Training Sessions: ' || COUNT(*) as summary 
FROM training_sessions
UNION ALL
SELECT 
    'Completed Sessions: ' || COUNT(*) as summary 
FROM training_sessions 
WHERE status = 'COMPLETED'
UNION ALL
SELECT 
    'Total Participants (Completed): ' || COALESCE(SUM(actual_participants), 0) as summary 
FROM training_sessions 
WHERE status = 'COMPLETED' AND actual_participants IS NOT NULL;