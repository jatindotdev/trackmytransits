import type { Session } from '@supabase/supabase-js';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { supabase } from './supabase';
import type { Tables } from '@/types/supabase';

interface AuthContext {
  session: Session | null;
  user: Tables<'users'> | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContext>({
  session: null,
  user: null,
  isLoading: true,
});

export const useSession = () => {
  const ctx = useContext(AuthContext);

  if (process.env.NODE_ENV !== 'production') {
    if (!ctx) {
      throw new Error('useSession must be used within a SessionProvider');
    }
  }

  return ctx;
};

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<Tables<'users'> | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        setSession(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        setSession(null);
        setUser(null);
        setIsLoading(false);
        console.error('Error fetching user:', error.message);
        return;
      }

      setUser(user);
      setSession(session);
      setIsLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {

        if (!session) {
          setSession(null);
          setUser(null);
          return;
        }

        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          setSession(null);
          setUser(null);
          console.error('Error fetching user:', error.message);
          return;
        }

        setUser(user);
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};