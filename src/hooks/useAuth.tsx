import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'tenant' | 'landlord' | 'admin';
  isVerified: boolean;
  phone?: string;
  avatar?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'tenant' | 'landlord';
  phone?: string;
  caretakerPhone?: string;
  displayPhonePreference?: 'owner' | 'caretaker';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!session;

  // Convert Supabase user + profile to our User type
  const convertToUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error || !profile) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return {
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        role: profile.role as 'tenant' | 'landlord' | 'admin',
        isVerified: profile.is_verified,
        phone: profile.phone,
        avatar: profile.avatar_url,
        createdAt: new Date(profile.created_at)
      };
    } catch (error) {
      console.error('Error converting user:', error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else if (session?.user) {
          setSession(session);
          const userData = await convertToUser(session.user);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Defer user profile fetch to avoid potential recursion
          setTimeout(async () => {
            const userData = await convertToUser(session.user);
            setUser(userData);
          }, 0);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const userData = await convertToUser(data.user);
        if (userData) {
          setUser(userData);
          setSession(data.session);
          return { success: true };
        } else {
          return { success: false, error: 'Failed to load user profile' };
        }
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
            phone: userData.phone,
            caretaker_phone: userData.caretakerPhone,
            display_phone_preference: userData.displayPhonePreference
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // User profile will be created automatically by the trigger
        // Wait a moment for the profile to be created
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData = await convertToUser(data.user);
        if (userData) {
          setUser(userData);
          setSession(data.session);
          return { success: true };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const updateData: any = {};
      if (userData.firstName) updateData.first_name = userData.firstName;
      if (userData.lastName) updateData.last_name = userData.lastName;
      if (userData.phone) updateData.phone = userData.phone;
      if (userData.avatar) updateData.avatar_url = userData.avatar;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...userData } : null);
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
