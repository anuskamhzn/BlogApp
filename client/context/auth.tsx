"use client";

import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: any) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // ✅ Load from localStorage ONLY on client
  useEffect(() => {
    const storedData = localStorage.getItem("auth");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setAuth(parsedData);
    }
  }, []);

  // ✅ Set axios header
  useEffect(() => {
    if (auth?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth?.token]);

  // Save to localStorage
  useEffect(() => {
    if (auth?.token) {
      localStorage.setItem("auth", JSON.stringify(auth));
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };