import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./api";

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (cfg) => {
  const t = await AsyncStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
