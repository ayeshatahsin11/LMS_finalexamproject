"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check localStorage for a saved session and verify
  // the token is still valid by asking the backend who we are.
  useEffect(() => {
    const token = localStorage.getItem("lms_token");
    const storedUser = localStorage.getItem("lms_user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // ignore corrupted storage
      }
    }

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/users/me")
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("lms_user", JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem("lms_token");
        localStorage.removeItem("lms_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user: loggedInUser } = res.data;
    localStorage.setItem("lms_token", token);
    localStorage.setItem("lms_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (name, email, password, role) => {
    // Register does not log the user in automatically (backend doesn't
    // return a token on register) - so we log in right after.
    await api.post("/auth/register", { name, email, password, role });
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("lms_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);