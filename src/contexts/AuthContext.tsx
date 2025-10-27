import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';
import { authWithRetry } from '../lib/apiClient';
import { handleError } from '../lib/errorHandler';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isDemoMode: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: unknown }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signInDemo: () => Promise<void>;
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

  // Refs para controlar race conditions
  const fetchProfileRef = useRef<Set<string>>(new Set());
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingAuthRef = useRef(false);

  const fetchProfile = useCallback(async (userId: string) => {
    // Evitar múltiplas chamadas para o mesmo usuário
    if (fetchProfileRef.current.has(userId)) {
      return;
    }

    fetchProfileRef.current.add(userId);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching profile:', error);
      }
      // Silently fail - profile is optional
    } finally {
      // Remover da lista de processamento após completar
      fetchProfileRef.current.delete(userId);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  // Função debounced para processar mudanças de auth
  const processAuthChange = useCallback(async (session: Session | null) => {
    // Cancelar timeout anterior se existir
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce de 100ms para evitar múltiplos processamentos
    debounceTimeoutRef.current = setTimeout(async () => {
      // Evitar processamento simultâneo
      if (isProcessingAuthRef.current) {
        return;
      }

      isProcessingAuthRef.current = true;

      try {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          // Limpar cache de profiles processados
          fetchProfileRef.current.clear();
        }

        setLoading(false);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error processing auth change:', error);
        }
        setLoading(false);
      } finally {
        isProcessingAuthRef.current = false;
      }
    }, 100);
  }, [fetchProfile]);

  useEffect(() => {
    // Carregar sessão inicial
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          if (import.meta.env.DEV) {
            console.error('Error getting initial session:', error);
          }
        }

        await processAuthChange(session);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error initializing auth:', error);
        }
        setLoading(false);
      }
    };

    initializeAuth();

    // Listener para mudanças de auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (import.meta.env.DEV) {
        console.log('Auth state changed:', event, session?.user?.id);
      }
      
      await processAuthChange(session);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [processAuthChange]);

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
    try {
      const result = await authWithRetry(
        () => supabase.auth.signInWithPassword({
          email,
          password,
        }),
        { feature: 'auth', retries: 2 }
      );

      if (!result.success) {
        const errorDetails = handleError(
          result.error || new Error('Authentication failed'),
          { action: 'sign_in' },
          'auth'
        );
        return { error: errorDetails.userFriendlyMessage };
      }

      return { error: null };
    } catch (err) {
      const errorDetails = handleError(
        err as Error,
        { action: 'sign_in' },
        'auth'
      );
      return { error: errorDetails.userFriendlyMessage };
    }
  };

  const signInDemo = async () => {
    setIsDemoMode(true);
    setLoading(false);

    // Criar um usuário demo mock
    const demoUser = {
      id: 'demo-user-123',
      email: 'demo@clubnath.com',
      user_metadata: {
        full_name: 'Nathália Valente',
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      }
    } as User;

    const demoSession = {
      user: demoUser,
      access_token: 'demo-token',
      refresh_token: 'demo-refresh-token',
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: 'bearer'
    } as Session;

    setUser(demoUser);
    setSession(demoSession);
    setProfile({
      id: 'demo-user-123',
      full_name: 'Nathália Valente',
      username: 'nathalia_arcuri',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Empreendedora, investidora e mãe. CEO da NAVA e criadora do Me Poupe!',
      followers_count: 29000000,
      following_count: 500,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  };

  const signOut = useCallback(async () => {
    try {
      if (isDemoMode) {
        setIsDemoMode(false);
        setUser(null);
        setSession(null);
        setProfile(null);
      } else {
        await supabase.auth.signOut();
        setProfile(null);
      }
      
      // Limpar refs e cache
      fetchProfileRef.current.clear();
      isProcessingAuthRef.current = false;
      
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error during sign out:', error);
      }
    }
  }, [isDemoMode]);

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
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
