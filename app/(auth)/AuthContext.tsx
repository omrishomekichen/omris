'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Api from './../__apis/api';

interface User {
  id: string;
  email: string;
  name?: string;
}



interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ status: string; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ status: string; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Verify the token and set the user
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await Api.login(email, password);
      if (response.status === 'success') {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        router.push('/dashboard');
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return { status: 'error', message: 'An error occurred while logging in.' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await Api.register(name, email, password);
      if (response.status === 'success') {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        router.push('/dashboard');
      }
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return { status: 'error', message: 'An error occurred while registering.' };
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  return context;
}
