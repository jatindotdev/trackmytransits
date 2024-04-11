import type { Session } from '@supabase/supabase-js';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { supabase } from './supabase';

interface AuthContext {
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContext>({
  session: null,
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};