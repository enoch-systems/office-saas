"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  user: { id: string; email: string } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const response = await fetch('/api/admin-auth/session', {
          method: 'GET',
          cache: 'no-store',
          credentials: 'include',
        });
        const result = await response.json().catch(() => null);
        if (result?.authenticated && result?.user) {
          setUser(result.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting auth session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/admin-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        return { error: { message: result?.error || 'Login failed' } };
      }

      if (result?.user) {
        setUser(result.user);
      }
      return { error: null };
    } catch (error) {
      return { error: { message: 'Login failed' } };
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/admin-auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
