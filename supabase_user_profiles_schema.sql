-- Create user_profiles table for storing user data from Firebase
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL, -- Firebase UID
  email TEXT NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'emergency_responder')),
  disabled BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_firebase_uid ON public.user_profiles(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_disabled ON public.user_profiles(disabled);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (firebase_uid = auth.uid()::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (firebase_uid = auth.uid()::text);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.firebase_uid = auth.uid()::text 
      AND up.role = 'admin'
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to sync Firebase user to Supabase
CREATE OR REPLACE FUNCTION sync_firebase_user(
  p_firebase_uid TEXT,
  p_email TEXT,
  p_display_name TEXT DEFAULT NULL,
  p_photo_url TEXT DEFAULT NULL,
  p_role TEXT DEFAULT 'user'
)
RETURNS UUID AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Insert or update user profile
  INSERT INTO public.user_profiles (
    firebase_uid,
    email,
    display_name,
    photo_url,
    role,
    last_login
  ) VALUES (
    p_firebase_uid,
    p_email,
    p_display_name,
    p_photo_url,
    p_role,
    NOW()
  )
  ON CONFLICT (firebase_uid) 
  DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    photo_url = EXCLUDED.photo_url,
    last_login = NOW(),
    updated_at = NOW()
  RETURNING id INTO user_id;
  
  RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all users for admin (with pagination)
CREATE OR REPLACE FUNCTION get_all_users_for_admin(
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0,
  p_search TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  firebase_uid TEXT,
  email TEXT,
  display_name TEXT,
  photo_url TEXT,
  role TEXT,
  disabled BOOLEAN,
  joined_at TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.firebase_uid,
    up.email,
    up.display_name,
    up.photo_url,
    up.role,
    up.disabled,
    up.joined_at,
    up.last_login,
    up.created_at,
    up.updated_at
  FROM public.user_profiles up
  WHERE 
    (p_search IS NULL OR 
     up.email ILIKE '%' || p_search || '%' OR 
     up.display_name ILIKE '%' || p_search || '%')
  ORDER BY up.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user role
CREATE OR REPLACE FUNCTION update_user_role(
  p_firebase_uid TEXT,
  p_role TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  admin_check BOOLEAN;
BEGIN
  -- Check if current user is admin
  SELECT EXISTS(
    SELECT 1 FROM public.user_profiles 
    WHERE firebase_uid = auth.uid()::text AND role = 'admin'
  ) INTO admin_check;
  
  IF NOT admin_check THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  
  -- Update user role
  UPDATE public.user_profiles 
  SET role = p_role, updated_at = NOW()
  WHERE firebase_uid = p_firebase_uid;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle user status (enable/disable)
CREATE OR REPLACE FUNCTION toggle_user_status(
  p_firebase_uid TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  admin_check BOOLEAN;
BEGIN
  -- Check if current user is admin
  SELECT EXISTS(
    SELECT 1 FROM public.user_profiles 
    WHERE firebase_uid = auth.uid()::text AND role = 'admin'
  ) INTO admin_check;
  
  IF NOT admin_check THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  
  -- Toggle user status
  UPDATE public.user_profiles 
  SET disabled = NOT disabled, updated_at = NOW()
  WHERE firebase_uid = p_firebase_uid;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete user profile
CREATE OR REPLACE FUNCTION delete_user_profile(
  p_firebase_uid TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  admin_check BOOLEAN;
BEGIN
  -- Check if current user is admin
  SELECT EXISTS(
    SELECT 1 FROM public.user_profiles 
    WHERE firebase_uid = auth.uid()::text AND role = 'admin'
  ) INTO admin_check;
  
  IF NOT admin_check THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  
  -- Delete user profile
  DELETE FROM public.user_profiles 
  WHERE firebase_uid = p_firebase_uid;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics()
RETURNS TABLE (
  total_users BIGINT,
  active_users BIGINT,
  disabled_users BIGINT,
  admin_users BIGINT,
  emergency_responders BIGINT,
  recent_signups BIGINT
) AS $$
DECLARE
  admin_check BOOLEAN;
BEGIN
  -- Check if current user is admin
  SELECT EXISTS(
    SELECT 1 FROM public.user_profiles 
    WHERE firebase_uid = auth.uid()::text AND role = 'admin'
  ) INTO admin_check;
  
  IF NOT admin_check THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  
  RETURN QUERY
  SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE disabled = FALSE) as active_users,
    COUNT(*) FILTER (WHERE disabled = TRUE) as disabled_users,
    COUNT(*) FILTER (WHERE role = 'admin') as admin_users,
    COUNT(*) FILTER (WHERE role = 'emergency_responder') as emergency_responders,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as recent_signups
  FROM public.user_profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;