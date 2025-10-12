import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  UserProfile,
  UserRole,
  RoleBasedAuthService,
} from "@/lib/roleBasedAuth";

interface RoleAwareAuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    profileData: {
      name: string;
      role: UserRole;
      organization?: string;
      district?: string;
      state?: string;
      phone?: string;
    }
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const RoleAwareAuthContext = createContext<RoleAwareAuthContextType | null>(
  null
);

export const useRoleAwareAuth = () => {
  const context = useContext(RoleAwareAuthContext);
  if (!context) {
    throw new Error(
      "useRoleAwareAuth must be used within RoleAwareAuthProvider"
    );
  }
  return context;
};

interface RoleAwareAuthProviderProps {
  children: React.ReactNode;
}

export const RoleAwareAuthProvider: React.FC<RoleAwareAuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const profile = await RoleBasedAuthService.getUserProfile(userId);
      console.log("✅ Profile loaded:", {
        role: profile?.role,
        email: profile?.email,
      });
      setUserProfile(profile);

      // Update last login
      if (profile) {
        await RoleBasedAuthService.updateLastLogin(userId);
      }
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      setUserProfile(null);
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log("🚀 RoleAwareAuthContext initializing...");
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error("Session error:", error);
      }

      console.log("🔄 RoleAwareAuthContext session check:", {
        hasSession: !!session,
        userEmail: session?.user?.email,
        userConfirmed: session?.user?.email_confirmed_at,
        pathname: window.location.pathname,
      });

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    profileData: {
      name: string;
      role: UserRole;
      organization?: string;
      district?: string;
      state?: string;
      phone?: string;
    }
  ) => {
    try {
      setLoading(true);

      // First create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: "Failed to create user account" };
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: profileData.name,
          role: profileData.role,
          organization: profileData.organization || null,
          district: profileData.district || null,
          state: profileData.state || null,
          phone: profileData.phone || null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        return { success: false, error: "Failed to create user profile" };
      }

      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
      }
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  const value: RoleAwareAuthContextType = {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return (
    <RoleAwareAuthContext.Provider value={value}>
      {children}
    </RoleAwareAuthContext.Provider>
  );
};
