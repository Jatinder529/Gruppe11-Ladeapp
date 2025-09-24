import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./http";
import { ENDPOINTS } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Token aus Storage laden
  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem("token");
      if (t) {
        setToken(t);
        try {
          const res = await api.get(ENDPOINTS.ME);
          setMe(res.data);
        } catch (_) {
          // Token ungültig -> sauber abmelden
          await AsyncStorage.removeItem("token");
          setToken(null);
          setMe(null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
    const res = await api.post(ENDPOINTS.LOGIN, { email, password });
    const { token: jwt } = res.data;
    await AsyncStorage.setItem("token", jwt);
    setToken(jwt);
    const meRes = await api.get(ENDPOINTS.ME);
    setMe(meRes.data);
  };

  const register = async (name, email, password) => {
    const res = await api.post(ENDPOINTS.REGISTER, { name, email, password });
    const { token: jwt } = res.data; // falls dein /register direkt token liefert
    if (jwt) {
      await AsyncStorage.setItem("token", jwt);
      setToken(jwt);
      const meRes = await api.get(ENDPOINTS.ME);
      setMe(meRes.data);
    } else {
      // sonst nach Registrierung einloggen:
      await login(email, password);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setMe(null);
  };

  return (
    <AuthContext.Provider value={{ token, me, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
