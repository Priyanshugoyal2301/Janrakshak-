-- SQL Queries to Update Supabase Table for User-Specific Reports
-- This script ensures reports are unique to each user using Firebase UUID

-- 1. First, let's check the current structure of the flood_reports table
-- You can run this to see the current structure:
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'flood_reports' 
-- ORDER BY ordinal_position;

-- 2. Add a unique constraint on user_id to ensure each user can only have one report per location/time
-- This prevents duplicate reports from the same user
ALTER TABLE flood_reports 
ADD CONSTRAINT unique_user_report UNIQUE (user_id, location, created_at);

-- 3. Add an index on user_id for faster queries when filtering by user
CREATE INDEX IF NOT EXISTS idx_flood_reports_user_id ON flood_reports(user_id);

-- 4. Add an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_flood_reports_created_at ON flood_reports(created_at DESC);

-- 5. Add a composite index for user_id and created_at for efficient user-specific queries
CREATE INDEX IF NOT EXISTS idx_flood_reports_user_created ON flood_reports(user_id, created_at DESC);

-- 6. Update the user_id column to ensure it's properly formatted as UUID
-- This ensures compatibility with Firebase UUIDs
ALTER TABLE flood_reports 
ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- 7. Add a check constraint to ensure user_id is not null
ALTER TABLE flood_reports 
ADD CONSTRAINT check_user_id_not_null CHECK (user_id IS NOT NULL);

-- 8. Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_flood_reports_updated_at ON flood_reports;
CREATE TRIGGER update_flood_reports_updated_at
    BEFORE UPDATE ON flood_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Add Row Level Security (RLS) to ensure users can only see their own reports
-- Enable RLS on the flood_reports table
ALTER TABLE flood_reports ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to only see their own reports
DROP POLICY IF EXISTS "Users can view own reports" ON flood_reports;
CREATE POLICY "Users can view own reports" ON flood_reports
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Create a policy that allows users to insert their own reports
DROP POLICY IF EXISTS "Users can insert own reports" ON flood_reports;
CREATE POLICY "Users can insert own reports" ON flood_reports
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create a policy that allows users to update their own reports
DROP POLICY IF EXISTS "Users can update own reports" ON flood_reports;
CREATE POLICY "Users can update own reports" ON flood_reports
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Create a policy that allows users to delete their own reports
DROP POLICY IF EXISTS "Users can delete own reports" ON flood_reports;
CREATE POLICY "Users can delete own reports" ON flood_reports
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 10. Create a policy for admins to see all reports (for admin panel)
-- This assumes you have a user_profiles table with role column
DROP POLICY IF EXISTS "Admins can view all reports" ON flood_reports;
CREATE POLICY "Admins can view all reports" ON flood_reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- 11. Add a function to get user-specific reports (for better performance)
CREATE OR REPLACE FUNCTION get_user_reports(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    user_name TEXT,
    user_email TEXT,
    title TEXT,
    description TEXT,
    severity TEXT,
    location JSONB,
    images TEXT[],
    status TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fr.id,
        fr.user_id,
        fr.user_name,
        fr.user_email,
        fr.title,
        fr.description,
        fr.severity,
        fr.location,
        fr.images,
        fr.status,
        fr.created_at,
        fr.updated_at
    FROM flood_reports fr
    WHERE fr.user_id = user_uuid
    ORDER BY fr.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Grant necessary permissions
-- Grant usage on the schema
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant select, insert, update, delete on flood_reports table
GRANT SELECT, INSERT, UPDATE, DELETE ON flood_reports TO authenticated;

-- Grant execute on the function
GRANT EXECUTE ON FUNCTION get_user_reports(UUID) TO authenticated;

-- 13. Optional: Create a view for easier querying of user reports
CREATE OR REPLACE VIEW user_reports_view AS
SELECT 
    fr.id,
    fr.user_id,
    fr.user_name,
    fr.user_email,
    fr.title,
    fr.description,
    fr.severity,
    fr.location,
    fr.images,
    fr.status,
    fr.created_at,
    fr.updated_at,
    CASE 
        WHEN fr.status = 'verified' THEN 'Verified'
        WHEN fr.status = 'resolved' THEN 'Resolved'
        WHEN fr.status = 'false_alarm' THEN 'False Alarm'
        ELSE 'Pending'
    END as status_display,
    CASE 
        WHEN fr.severity = 'critical' THEN 'Critical'
        WHEN fr.severity = 'high' THEN 'High'
        WHEN fr.severity = 'medium' THEN 'Medium'
        ELSE 'Low'
    END as severity_display
FROM flood_reports fr;

-- Grant select on the view
GRANT SELECT ON user_reports_view TO authenticated;

-- 14. Add a function to clean up old reports (optional - for data management)
CREATE OR REPLACE FUNCTION cleanup_old_reports(days_to_keep INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM flood_reports 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on cleanup function to authenticated users
GRANT EXECUTE ON FUNCTION cleanup_old_reports(INTEGER) TO authenticated;

-- 15. Create a function to get report statistics for a user
CREATE OR REPLACE FUNCTION get_user_report_stats(user_uuid UUID)
RETURNS TABLE (
    total_reports BIGINT,
    critical_reports BIGINT,
    verified_reports BIGINT,
    pending_reports BIGINT,
    resolved_reports BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_reports,
        COUNT(*) FILTER (WHERE severity = 'critical') as critical_reports,
        COUNT(*) FILTER (WHERE status = 'verified') as verified_reports,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_reports,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved_reports
    FROM flood_reports
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on stats function
GRANT EXECUTE ON FUNCTION get_user_report_stats(UUID) TO authenticated;

-- 16. Final verification queries (run these to check everything is working)
-- Check table structure
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'flood_reports' 
-- ORDER BY ordinal_position;

-- Check indexes
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'flood_reports';

-- Check policies
-- SELECT policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'flood_reports';

-- Check functions
-- SELECT routine_name, routine_type 
-- FROM information_schema.routines 
-- WHERE routine_schema = 'public' 
-- AND routine_name LIKE '%report%';

COMMIT;