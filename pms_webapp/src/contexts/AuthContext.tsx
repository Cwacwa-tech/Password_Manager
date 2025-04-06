// File: src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if the user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      validateSession();
    }
  }, []);

  const validateSession = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      const response = await api.get('/auth/validate-session', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.valid) {
        setIsAuthenticated(true);
        setUser({ email: response.data.email });
      } else {
        // Session is invalid
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      // Error validating session
      localStorage.removeItem('accessToken');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email); // FastAPI OAuth2 uses 'username' for the email
      formData.append('password', password);
  
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      // Save the token to localStorage
      localStorage.setItem('accessToken', response.data.access_token);
      
      // Set authentication state
      setIsAuthenticated(true);
      setUser({ email });
      setError(null);
    } catch (error) {
      setError('Invalid email or password');
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await api.post('/auth/register', {
        username,  // Include username
        email,
        master_password: password,
        //generate_password: false
      });
      setError(null);
    } catch (error) {
      setError('Registration failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      await axios.delete('/auth/delete-account', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Clear authentication state
      localStorage.removeItem('accessToken');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      setError('Failed to delete account. Please try again.');
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    deleteAccount,
    error,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};