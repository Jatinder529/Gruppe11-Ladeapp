import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../http";

export default function Session() {
  const [rid, setRid] = useState(null);
  const [start, setStart] = useState(null);
  const [elapsed, setElapsed] = useState("00:00:00");

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem("lastReservationId"),
      AsyncStorage.getItem("lastReservationStart"),
    ]).then(([id, st]) => {
      setRid(id);
      setStart(st);
    });
  }, []);

  useEffect(() => {
    if (!start) return;
    const iv = setInterval(() => {
      const ms = Date.now() - new Date(start).getTime();
      const s = Math.max(0, Math.floor(ms / 1000));
      const hh = String(Math.floor(s / 3600)).padStart(2, "0");
      const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      setElapsed(`${hh}:${mm}:${ss}`);
    }, 1000);
    return () => clearInterval(iv);
  }, [start]);

  const enden = async () => {
    try {
      if (!rid) return;
      await api.post(`/api/reservierungen/${rid}/end`);
      await AsyncStorage.multiRemove(["lastReservationId", "lastReservationStart"]);
      setRid(null); setStart(null);
      Alert.alert("Beendet", "Ladevorgang beendet");
    } catch (e) {
      Alert.alert("Fehler", "Beenden fehlgeschlagen");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Aktuelle Reservierung: {rid ?? "-"}</Text>
      <Text style={{ fontSize: 24, marginVertical: 8 }}>{elapsed}</Text>
      <Button title="Beenden" onPress={enden} disabled={!rid} />
    </View>
  );
}


