-- Update user_profiles table to support user management features
-- Run this in your Supabase SQL editor

-- 1. Add disabled field to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS disabled BOOLEAN DEFAULT FALSE;

-- 2. Add updated_at field if it doesn't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;

-- Create the trigger
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profiles_updated_at();

-- 4. Update existing policies to allow admins to manage disabled status
-- Drop existing policies
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- Create new policy that allows admins to update all fields including disabled
CREATE POLICY "Admins can update all profiles" ON public.user_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 5. Add a policy for admins to delete profiles
CREATE POLICY "Admins can delete profiles" ON public.user_profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 6. Grant necessary permissions
GRANT UPDATE, DELETE ON public.user_profiles TO authenticated;

-- 7. Create a function to get all users for admin (with proper RLS)
CREATE OR REPLACE FUNCTION get_all_users_for_admin()
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    role TEXT,
    disabled BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    last_sign_in_at TIMESTAMPTZ
) AS $$
BEGIN
    -- Check if the current user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied: Admin role required';
    END IF;
    
    RETURN QUERY
    SELECT 
        up.id,
        up.email,
        up.full_name,
        up.role,
        up.disabled,
        up.created_at,
        up.updated_at,
        up.last_sign_in_at
    FROM public.user_profiles up
    ORDER BY up.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_all_users_for_admin() TO authenticated;

-- 8. Create a function to update user role
CREATE OR REPLACE FUNCTION update_user_role(user_uuid UUID, new_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if the current user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied: Admin role required';
    END IF;
    
    -- Validate role
    IF new_role NOT IN ('user', 'admin', 'emergency_responder') THEN
        RAISE EXCEPTION 'Invalid role: %', new_role;
    END IF;
    
    -- Update the user role
    UPDATE public.user_profiles 
    SET 
        role = new_role,
        updated_at = NOW()
    WHERE id = user_uuid;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_user_role(UUID, TEXT) TO authenticated;

-- 9. Create a function to toggle user disabled status
CREATE OR REPLACE FUNCTION toggle_user_status(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if the current user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied: Admin role required';
    END IF;
    
    -- Toggle the disabled status
    UPDATE public.user_profiles 
    SET 
        disabled = NOT disabled,
        updated_at = NOW()
    WHERE id = user_uuid;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION toggle_user_status(UUID) TO authenticated;

-- 10. Create a function to delete user profile
CREATE OR REPLACE FUNCTION delete_user_profile(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if the current user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied: Admin role required';
    END IF;
    
    -- Delete the user profile
    DELETE FROM public.user_profiles 
    WHERE id = user_uuid;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION delete_user_profile(UUID) TO authenticated;

COMMIT;