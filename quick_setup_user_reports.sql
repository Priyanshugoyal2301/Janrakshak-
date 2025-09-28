-- Quick Setup SQL for User-Specific Reports
-- Run these commands in your Supabase SQL editor

-- 1. Add unique constraint to prevent duplicate reports from same user
ALTER TABLE flood_reports 
ADD CONSTRAINT unique_user_report UNIQUE (user_id, location, created_at);

-- 2. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flood_reports_user_id ON flood_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_flood_reports_created_at ON flood_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flood_reports_user_created ON flood_reports(user_id, created_at DESC);

-- 3. Enable Row Level Security
ALTER TABLE flood_reports ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for user-specific access
-- Users can only see their own reports
CREATE POLICY "Users can view own reports" ON flood_reports
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can insert their own reports
CREATE POLICY "Users can insert own reports" ON flood_reports
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Users can update their own reports
CREATE POLICY "Users can update own reports" ON flood_reports
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Users can delete their own reports
CREATE POLICY "Users can delete own reports" ON flood_reports
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 5. Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON flood_reports TO authenticated;

-- 6. Create a function to get user reports
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

GRANT EXECUTE ON FUNCTION get_user_reports(UUID) TO authenticated;