'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check localStorage on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(storedAuth === 'true');
      setIsInitialized(true);
    }
  }, []);

  const login = () => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn');
    }
  };

  // Don't render children until we've checked localStorage
  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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