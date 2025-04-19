"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: (redirect?: boolean) => void;
  error: string | null;
  initialized: boolean;
}


const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null,
  initialized: false,
});


interface AuthProviderProps {
  children: ReactNode;
}


export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const router = useRouter();
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        setIsLoading(true);
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (err) {
        console.error('Error loading auth state from storage:', err);
        logout(false); // Don't redirect on initial load error
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };

    // Only run on the client-side
    if (typeof window !== 'undefined') {
      loadUserFromStorage();
    } else {
      setIsLoading(false);
      setInitialized(true);
    }
  }, []);

  // Removed the separate useEffect for axios headers - now handled in loadUserFromStorage and login

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      
      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Store in localStorage for persistence
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      router.push('/'); // Redirect to home or dashboard
    } catch (err) {
      console.error('Login error:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed');
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, { username, email, password });
      router.push('/auth/login');
    } catch (err) {
      console.error('Registration error:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Registration failed');
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function with optional redirect parameter
  const logout = (redirect = true) => {
    setToken(null);
    setUser(null);
    setError(null);
    
    // Remove from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
    
    if (redirect) {
      router.push('/auth/login');
    }
  };

  // Determine if the user is authenticated
  const isAuthenticated = !!user && !!token;

  // Context value
  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    initialized,
    login,
    register,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;