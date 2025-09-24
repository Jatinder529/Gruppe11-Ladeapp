// mobile/src/context/AuthContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Axios-Instanz, die automatisch das JWT mitschickt
  const api = useMemo(() => {
    const instance = axios.create({ baseURL: BASE_URL });
    instance.interceptors.request.use(async (config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return instance;
  }, [token]);

  // Token beim Start laden
  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem("token");
        if (t) {
          setToken(t);
          // Versuche Benutzer zu laden (optional)
          try {
            const me = await axios.get(`${BASE_URL}/api/auth/me`, {
              headers: { Authorization: `Bearer ${t}` },
            });
            setUser(me.data);
          } catch {}
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, {
      email,
      password,
    });
    const t = res?.data?.token;
    if (!t) throw new Error("Kein Token vom Server erhalten.");
    await AsyncStorage.setItem("token", t);
    setToken(t);

    // Benutzer ziehen (optional)
    try {
      const me = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      setUser(me.data);
    } catch {}

    return t;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${BASE_URL}/api/auth/register`, {
      name,
      email,
      password,
    });
    const t = res?.data?.token;
    if (t) {
      await AsyncStorage.setItem("token", t);
      setToken(t);
    }
    return t;
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, setUser, login, register, logout, api, loading }),
    [token, user, api, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth muss innerhalb von <AuthProvider> verwendet werden.");
  return ctx;
}
