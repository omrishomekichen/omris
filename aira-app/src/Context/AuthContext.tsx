import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { apiLogin, apiLogout, apiMe } from '../lib/api';

const TOKEN_KEY = 'aira_auth_token';
const USER_KEY = 'aira_auth_user';

const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
      }
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch {}
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch {}
  },
};

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'staff';
  branch: string | null;
  status: 'active' | 'inactive';
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  verified?: boolean;
}

interface AuthContextType {
  session: { user: User; token: string } | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<{ user: User; token: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const savedToken = await storage.getItem(TOKEN_KEY);
      const savedUserStr = await storage.getItem(USER_KEY);

      if (savedToken && savedUserStr) {
        try {
          const parsedUser = JSON.parse(savedUserStr);
          setUser(parsedUser);
          setSession({ user: parsedUser, token: savedToken });
          setProfile({
            id: parsedUser.id || parsedUser._id || 'admin',
            name: parsedUser.name || 'Aira Admin',
            email: parsedUser.email || 'admin@airapickles.com',
            role: 'owner',
            branch: null,
            status: 'active',
          });
        } catch {}
      }

      // Verify token with backend
      if (savedToken) {
        const meRes = await apiMe(savedToken);
        if (meRes && meRes.status === 'success' && meRes.user) {
          setUser(meRes.user);
          setSession({ user: meRes.user, token: savedToken });
          setProfile({
            id: meRes.user.id || meRes.user._id,
            name: meRes.user.name || 'Aira Admin',
            email: meRes.user.email,
            role: 'owner',
            branch: null,
            status: 'active',
          });
        }
      }
    } catch (e) {
      console.error('Session load error:', e);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const res = await apiLogin(email, password);

      if (res.status !== 'success' || !res.user) {
        return {
          success: false,
          error: res.message || 'Authentication failed',
        };
      }

      const token = res.token || 'app_session_token';
      const currentUser: User = res.user;

      await storage.setItem(TOKEN_KEY, token);
      await storage.setItem(USER_KEY, JSON.stringify(currentUser));

      setUser(currentUser);
      setSession({ user: currentUser, token });
      setProfile({
        id: currentUser.id || currentUser._id || 'admin',
        name: currentUser.name || 'Aira Admin',
        email: currentUser.email,
        role: 'owner',
        branch: null,
        status: 'active',
      });

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Network error connecting to auth server',
      };
    }
  }

  async function logout() {
    try {
      const token = session?.token;
      await apiLogout(token);
    } catch {}

    await storage.removeItem(TOKEN_KEY);
    await storage.removeItem(USER_KEY);

    setSession(null);
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}