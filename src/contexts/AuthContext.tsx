import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  demoLogin: () => void;
  logout: () => void;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem("userEmail");
  });

  const login = (email: string, password: string): boolean => {
    if (!email || !password) return false;
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    setIsAuthenticated(true);
    setUserEmail(email);
    return true;
  };

  const demoLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", "demo@deepspace-analyst.app");
    setIsAuthenticated(true);
    setUserEmail("demo@deepspace-analyst.app");
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, demoLogin, logout, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
