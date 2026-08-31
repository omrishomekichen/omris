import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  Session,
} from '@supabase/supabase-js';

import { supabase } from '../lib/supabase';


interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'staff';
  branch: string | null;
  status: 'active' | 'inactive';
}


interface AuthContextType {
  session: Session | null;
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


const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );


export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [session, setSession] =
    useState<Session | null>(null);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    loadSession();

    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        async (_event, session) => {

          setSession(session);

          if (session?.user) {
            await loadProfile(
              session.user.id
            );
          } else {
            setProfile(null);
          }
        }
      );


    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);


  async function loadSession() {

    const {
      data,
    } = await supabase.auth.getSession();

    setSession(data.session);

    if (data.session?.user) {
      await loadProfile(
        data.session.user.id
      );
    }

    setLoading(false);
  }


  async function loadProfile(
    userId: string
  ) {

    const {
      data,
      error,
    } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();


    if (!error) {
      setProfile(data);
    }
  }


  async function login(
    email: string,
    password: string
  ) {

    const {
      data,
      error,
    } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });


    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }


    if (data.user) {
      await loadProfile(
        data.user.id
      );
    }


    return {
      success: true,
    };
  }


  async function logout() {

    await supabase.auth.signOut();

    setSession(null);
    setProfile(null);
  }


  return (
    <AuthContext.Provider
      value={{
        session,
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

  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}