import { createContext, ReactNode, useContext } from 'react';

import { signIn, signOut, useSession } from '../lib/authClient';
import { User } from '../types';

type AuthContextType = {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, isPending } = useSession();

  const login = async (identifier: string, password: string) => {
    // Detect if input is email (contains @) or username
    const isEmail = identifier.includes('@');

    const result = isEmail
      ? await signIn.email({
          email: identifier,
          password,
        })
      : await signIn.username({
          username: identifier,
          password,
        });

    if (result.error) {
      throw new Error(result.error.message || 'Login failed');
    }
  };

  const logout = async () => {
    await signOut();
  };

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      }
    : null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading: isPending }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
