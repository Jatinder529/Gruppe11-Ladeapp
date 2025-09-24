import { Platform } from "react-native";

// Emulator (Android): PC unter 10.0.2.2 erreichbar.
// Echtes Handy im WLAN: ersetze durch PC-IP, z.B. "http://192.168.1.42:4000"
export const BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://localhost:4000";

// Endpunkte (nur zur Dokumentation, wir nutzen BASE_URL in http.js)
export const ENDPOINTS = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  ME: "/api/auth/me",
  LADEPUNKTE: "/api/ladepunkte",
  RESERVIERUNGEN: "/api/reservierungen",
  RESERVIERUNG_END: (id) => `/api/reservierungen/${id}/end`,
  // falls du ein "start" im Backend hast:
  RESERVIERUNG_START: "/api/reservierungen/start",
};
