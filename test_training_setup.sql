-- Test query to verify NDMA training tables exist
-- Run this in Supabase SQL Editor to check if tables are created

-- Check if all training tables exist
SELECT 
    schemaname, 
    tablename 
FROM pg_tables 
WHERE tablename LIKE '%training%' 
    OR tablename LIKE '%target_audiences%'
ORDER BY tablename;

-- Check training_themes data
SELECT name, category, COUNT(*) 
FROM training_themes 
GROUP BY name, category 
LIMIT 5;

-- Check training_partners data  
SELECT name, type, state 
FROM training_partners 
LIMIT 5;

-- Check training_coverage data
SELECT state, district, flood_risk_level, priority_score 
FROM training_coverage 
ORDER BY priority_score DESC 
LIMIT 10;