import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/axiosInstance";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ── LOAD FROM LOCALSTORAGE ON START ── */
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    const token = localStorage.getItem("token");

    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    } else if (token) {
      setAuth({ token });
    }
  }, []);

  /* ── SYNC TO LOCALSTORAGE ── */
  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
      if (auth.token) {
        localStorage.setItem("token", auth.token);
      }
    } else {
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
    }
  }, [auth]);

  /* ── LOGIN ── */
  const login = async (username, password) => {
    try {
      setLoading(true);

      const res = await api.post("/api/auth/login", {
        username,
        password,
      });

      const data = res.data;
      //console.log(data)

      const authData = {
        token: data.token,
        userId: data.user?.id,
        username: data.user?.username,
        email: data.user?.email,
        role: data.user?.role,
      };
      //console.log(authData)

      setAuth(authData);

      localStorage.setItem("auth", JSON.stringify(authData));
      localStorage.setItem("token", data.token);

      return authData;
    } catch (error) {
      throw error.response?.data || "Login failed";
    } finally {
      setLoading(false);
    }
  };

  /* ── REGISTER ── */
  const register = async (userData) => {
    try {
      setLoading(true);

      const res = await api.post("/api/auth/register", userData);

      const data = res.data;

      const authData = {
        token: data.token,
        userId: data.user?.id,
        username: data.user?.username,
        email: data.user?.email,
        role: data.user?.role,
      };

      setAuth(authData);
      return authData;

    } finally {
      setLoading(false);
    }
  };

  /* ── LOGOUT ── */
  const logout = () => {
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{
      user: auth,
      setAuth,
      token: auth?.token,
      role: auth?.role,
      userId: auth?.userId,
      username: auth?.username,
      email: auth?.email,
      loading,

      login,
      register,
      logout,

      isAdmin: auth?.role === "ADMIN",
      isTechnician: auth?.role === "TECHNICIAN",
      isUser: auth?.role === "USER",
    }}>
      {children}
    </AuthContext.Provider>
  );
};