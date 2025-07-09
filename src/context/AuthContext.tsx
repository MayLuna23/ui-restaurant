import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { loginRequest, verifyAuthReq } from "@/api/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  // Token helpers
  const setToken = (token: string) => localStorage.setItem("jwt", token);
  const getToken = () => localStorage.getItem("jwt");
  const removeToken = () => localStorage.removeItem("jwt");

  // ✅ Se ejecuta una sola vez al montar la app
  const verifyAuth = async () => {
    const jwt = getToken();
    if (!jwt) {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setLoading(false);
      setUserName("");
      return;
    }

    try {
      const res = await verifyAuthReq(jwt);

      const { name, role } = res.data;
      setIsAuthenticated(true);
      setIsAdmin(role === "admin");
      setUserName(name);
    } catch (error) {
      console.error("Auth verification failed", error);
      removeToken();
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Se usa en el login, directamente cambia el estado
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await loginRequest({ email, password });
      console.log(res.data.data)
      const { name, role, token } = res.data.data;

      if (token) {
        setToken(token);
        setIsAuthenticated(true);
        setIsAdmin(role === "admin");
        setUserName(name);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserName("");

  };

  useEffect(() => {
    verifyAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAdmin, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
