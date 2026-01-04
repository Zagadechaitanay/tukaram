import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  mobile: string;
  email?: string;
  district: string;
  taluka: string;
  language: 'en' | 'mr';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (mobile: string, password: string) => Promise<boolean>;
  register: (userData: User & { password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (userData: User & { password: string }) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u: any) => u.mobile === userData.mobile);
      
      if (existingUser) {
        return false;
      }

      users.push(userData);
      localStorage.setItem('users', JSON.stringify(users));
      
      const { password, ...userWithoutPassword } = userData;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const login = async (mobile: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.mobile === mobile && u.password === password);
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
