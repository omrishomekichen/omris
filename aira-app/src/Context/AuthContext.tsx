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
  role: 'admin';
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

function profileFromUser(user: User): Profile {
  return {
    id: user.id || user._id || 'admin',
    name: user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Aira Admin'),
    email: user.email || 'admin@airapickles.com',
    role: 'admin',
    status: 'active',
  };
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
  sendLoginOtp: (
    email: string
  ) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
  loginWithOtp: (
    email: string,
    otp: string
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
          setProfile(profileFromUser(parsedUser));
        } catch {}
      }

      // Verify token with backend
      if (savedToken) {
        const meRes = await apiMe(savedToken);
        if (meRes && meRes.status === 'success' && meRes.user) {
          setUser(meRes.user);
          setSession({ user: meRes.user, token: savedToken });
          setProfile(profileFromUser(meRes.user));
        }
      }
    } catch (e) {
      // Ignore session restoration errors and fall back to signed-out state
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
      setProfile(profileFromUser(currentUser));

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

  async function sendLoginOtp(email: string) {
    try {
      const { apiSendLoginOtp } = await import('../lib/api');
      const res = await apiSendLoginOtp(email);
      if (res.status === 'success') {
        return { success: true, message: res.message || 'OTP sent successfully' };
      }
      return { success: false, error: res.message || 'Failed to send OTP' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error sending OTP' };
    }
  }

  async function loginWithOtp(email: string, otp: string) {
    try {
      const { apiVerifyLoginOtp } = await import('../lib/api');
      const res = await apiVerifyLoginOtp(email, otp);

      if (res.status !== 'success' || !res.user) {
        return {
          success: false,
          error: res.message || 'OTP verification failed',
        };
      }

      const token = res.token || 'app_session_token';
      const currentUser: User = res.user;

      await storage.setItem(TOKEN_KEY, token);
      await storage.setItem(USER_KEY, JSON.stringify(currentUser));

      setUser(currentUser);
      setSession({ user: currentUser, token });
      setProfile(profileFromUser(currentUser));

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Network error verifying OTP',
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
        sendLoginOtp,
        loginWithOtp,
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
