"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in localStorage on page reload
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
