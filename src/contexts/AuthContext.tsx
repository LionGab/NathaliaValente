import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isDemoMode: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: unknown }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signInDemo: () => Promise<void>;
  signInSocial: (socialUser: any) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching profile:', error);
      }
      // Silently fail - profile is optional
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        // Only set loading to false if it was true
        setLoading(prev => prev ? false : prev);
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      return { error };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Signup error:', error);
      }
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInDemo = async () => {
    // Create mock user and session for demo mode
    const mockUser: User = {
      id: 'demo-user-123',
      email: 'demo@clubnath.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {
        full_name: 'Nathalia Arcuri',
        username: 'nathalia_arcuri'
      },
      identities: [],
      factors: []
    };

    const mockSession: Session = {
      access_token: 'demo-token-' + Date.now(),
      refresh_token: 'demo-refresh-' + Date.now(),
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: mockUser
    };

    const mockProfile: Profile = {
      id: 'demo-user-123',
      full_name: 'Nathalia Arcuri',
      username: 'nathalia_arcuri',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Mãe, empresária e inspiradora. Bem-vinda ao ClubNath VIP!',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setUser(mockUser);
    setSession(mockSession);
    setProfile(mockProfile);
    setIsDemoMode(true);
    setLoading(false);
  };

  const signInSocial = async (socialUser: any) => {
    // Create mock user and session for social login
    const mockUser: User = {
      id: socialUser.id,
      email: `${socialUser.username}@clubnath.com`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {
        full_name: socialUser.full_name,
        username: socialUser.username
      },
      identities: [],
      factors: []
    };

    const mockSession: Session = {
      access_token: socialUser.access_token,
      refresh_token: 'social-refresh-' + Date.now(),
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: mockUser
    };

    const mockProfile: Profile = {
      id: socialUser.id,
      full_name: socialUser.full_name,
      username: socialUser.username,
      avatar_url: socialUser.profile_picture_url,
      bio: `Mãe ativa na comunidade ClubNath VIP! ${socialUser.followers_count} seguidores.`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setUser(mockUser);
    setSession(mockSession);
    setProfile(mockProfile);
    setIsDemoMode(false);
    setLoading(false);
  };

  const signOut = async () => {
    if (isDemoMode) {
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsDemoMode(false);
    } else {
      await supabase.auth.signOut();
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isDemoMode,
        signUp,
        signIn,
        signInDemo,
        signInSocial,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
