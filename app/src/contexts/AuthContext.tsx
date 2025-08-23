import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../services/api';

export interface User {
  id: string;
  email: string;
  role: 'employer' | 'jobseeker';
  firstName?: string;
  lastName?: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    role: 'employer' | 'jobseeker';
    firstName?: string;
    lastName?: string;
    company?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: {
    firstName?: string;
    lastName?: string;
    company?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  // Check if user is already logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await apiClient.verifyToken();
      setUser(response.user);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(credentials);
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    role: 'employer' | 'jobseeker';
    firstName?: string;
    lastName?: string;
    company?: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await apiClient.register(userData);
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const updateProfile = async (profileData: {
    firstName?: string;
    lastName?: string;
    company?: string;
  }) => {
    try {
      const updatedUser = await apiClient.updateProfile(profileData);
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
