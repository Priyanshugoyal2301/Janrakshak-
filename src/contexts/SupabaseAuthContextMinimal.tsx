import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

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

export const useSupabaseAuthMinimal = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuthMinimal must be used within a SupabaseAuthProviderMinimal');
  }
  return context;
};

interface SupabaseAuthProviderMinimalProps {
  children: React.ReactNode;
}

export const SupabaseAuthProviderMinimal: React.FC<SupabaseAuthProviderMinimalProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('SupabaseAuthProviderMinimal: Initializing...');
    
    // Get initial session with error handling
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        console.log('SupabaseAuthProviderMinimal: Initial session:', session);
        if (error) {
          console.error('SupabaseAuthProviderMinimal: Session error:', error);
        }
        setSession(session);
        setUser(session?.user ?? null);
        setIsAdmin(true); // All Supabase users are admins
        setLoading(false);
      })
      .catch((error) => {
        console.error('SupabaseAuthProviderMinimal: Failed to get session:', error);
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      });

    // Listen for auth changes with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      try {
        console.log('SupabaseAuthProviderMinimal: Auth state changed:', _event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAdmin(true); // All Supabase users are admins
        setLoading(false);
      } catch (error) {
        console.error('SupabaseAuthProviderMinimal: Error handling auth state change:', error);
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.error('SupabaseAuthProviderMinimal: Error unsubscribing:', error);
      }
    };
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        console.error('SupabaseAuthProviderMinimal: Signup error:', error);
        return { user: null, error };
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('SupabaseAuthProviderMinimal: Signup error:', error);
      return { user: null, error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('SupabaseAuthProviderMinimal: Signin error:', error);
        return { user: null, error };
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('SupabaseAuthProviderMinimal: Signin error:', error);
      return { user: null, error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('SupabaseAuthProviderMinimal: Signout error:', error);
      }
    } catch (error) {
      console.error('SupabaseAuthProviderMinimal: Signout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        console.error('SupabaseAuthProviderMinimal: Reset password error:', error);
      }
    } catch (error) {
      console.error('SupabaseAuthProviderMinimal: Reset password error:', error);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      // For Supabase admin users, we don't need to update a separate profile table
      console.log('SupabaseAuthProviderMinimal: Profile update (no-op):', updates);
    } catch (error) {
      console.error('SupabaseAuthProviderMinimal: Update profile error:', error);
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

  console.log('SupabaseAuthProviderMinimal: Providing context:', { user: user?.email, loading, isAdmin });

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};