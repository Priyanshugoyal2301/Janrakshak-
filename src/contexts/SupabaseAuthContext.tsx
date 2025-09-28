import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, userData?: any) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

interface SupabaseAuthProviderProps {
  children: React.ReactNode;
}

export const SupabaseAuthProvider: React.FC<SupabaseAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await checkAdminStatus(session.user);
        }
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkAdminStatus(session.user);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (user: User) => {
    try {
      console.log('Checking admin status for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      console.log('Admin status check result:', { data, error });

      if (error) {
        console.error('Error checking admin status:', error?.message || JSON.stringify(error));
        // If table doesn't exist or user doesn't have profile, assume admin for Supabase users
        setIsAdmin(true);
      } else {
        setIsAdmin(data?.role === 'admin');
      }
    } catch (error) {
      console.error('Error checking admin status:', error?.message || JSON.stringify(error));
      // If there's any error, assume admin for Supabase users
      setIsAdmin(true);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true);
      console.log('Starting signup process...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        return { user: null, error };
      }

      if (data.user) {
        console.log('User created, attempting to create profile...');
        
        // Try to create user profile with admin role
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              full_name: userData?.full_name || '',
              role: 'admin', // All Supabase signups are admins
              created_at: new Date().toISOString()
            });

          if (profileError) {
            console.error('Error creating user profile:', profileError);
            // Don't fail the signup if profile creation fails
            toast.warning('Account created but profile setup failed. Please contact support.');
          } else {
            console.log('User profile created successfully');
          }
        } catch (profileErr) {
          console.error('Profile creation error:', profileErr);
          toast.warning('Account created but profile setup failed. Please contact support.');
        }
      }

      toast.success('Admin account created successfully! Please check your email to verify your account.');
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account');
      return { user: null, error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Starting signin process...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Signin response:', { data, error });

      if (error) {
        console.error('Signin error:', error);
        toast.error(error.message);
        return { user: null, error };
      }

      console.log('Signin successful, user:', data.user);
      toast.success('Welcome back, Admin!');
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in');
      return { user: null, error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Logged out successfully');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset email sent!');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Failed to send reset email');
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    }
  };

  const value: SupabaseAuthContextType = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    loading,
    isAdmin
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};