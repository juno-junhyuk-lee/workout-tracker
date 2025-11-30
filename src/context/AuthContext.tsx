import React, { createContext, useContext, useState } from "react";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
<<<<<<< Updated upstream
=======
  age?: number | null;
  gender?: string | null;
>>>>>>> Stashed changes
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
<<<<<<< Updated upstream
=======
  updateUser: (updates: Partial<User>) => void; // ✅ ADD
>>>>>>> Stashed changes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

<<<<<<< Updated upstream
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
=======
  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
>>>>>>> Stashed changes
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
