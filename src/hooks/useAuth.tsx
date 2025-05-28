
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'tenant' | 'landlord' | 'admin';
  isVerified: boolean;
  phone?: string;
  avatar?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'tenant' | 'landlord';
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing user session on app load
    const savedUser = localStorage.getItem('rentkenya_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('rentkenya_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get users from localStorage (simulating database)
      const users = JSON.parse(localStorage.getItem('rentkenya_users') || '[]');
      const existingUser = users.find((u: any) => u.email === email);

      if (!existingUser) {
        return { success: false, error: 'User not found' };
      }

      // In a real app, you would hash and compare passwords
      if (existingUser.password !== password) {
        return { success: false, error: 'Invalid password' };
      }

      const userData: User = {
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        role: existingUser.role,
        isVerified: existingUser.isVerified || false,
        phone: existingUser.phone,
        createdAt: new Date(existingUser.createdAt)
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('rentkenya_user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('rentkenya_users') || '[]');
      
      // Check if user already exists
      const existingUser = users.find((u: any) => u.email === userData.email);
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        phone: userData.phone,
        isVerified: false,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage (simulating database)
      users.push(newUser);
      localStorage.setItem('rentkenya_users', JSON.stringify(users));

      // Create user session
      const userSession: User = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        isVerified: newUser.isVerified,
        phone: newUser.phone,
        createdAt: new Date(newUser.createdAt)
      };

      setUser(userSession);
      setIsAuthenticated(true);
      localStorage.setItem('rentkenya_user', JSON.stringify(userSession));

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('rentkenya_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('rentkenya_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
