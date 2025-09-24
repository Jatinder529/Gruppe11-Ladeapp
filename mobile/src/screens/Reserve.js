import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../http";

export default function Reserve({ route, navigation }) {
  const { ladepunkt } = route.params;
  const [userId, setUserId] = useState("");
  const [startISO, setStartISO] = useState(new Date(Date.now()+10*60*1000).toISOString());
  const [endISO, setEndISO] = useState(new Date(Date.now()+70*60*1000).toISOString());

  useEffect(() => {
    AsyncStorage.getItem("user").then((uStr) => {
      if (uStr) {
        const u = JSON.parse(uStr);
        setUserId(u?.id || u?.benutzerId || "");
      }
    });
  }, []);

  const starten = async () => {
    try {
      const r = await api.post("/api/reservierungen/start", {
        benutzerId: userId,
        ladepunktId: ladepunkt.id || ladepunkt.ladepunktId,
      });
      await AsyncStorage.setItem("lastReservationId", r.data.id || r.data.reservierungId);
      await AsyncStorage.setItem("lastReservationStart", r.data.startzeit);
      Alert.alert("OK", "Reservierung/Ladevorgang gestartet");
      navigation.navigate("Session");
    } catch (e) {
      Alert.alert("Fehler", "Konnte nicht starten");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: "700" }}>{ladepunkt.standort} • Nr.{ladepunkt.nummer}</Text>

      <Text style={{ marginTop: 12 }}>Benutzer-ID</Text>
      <TextInput style={inp} value={userId} onChangeText={setUserId} autoCapitalize="none" />

      <Text>Start (ISO)</Text>
      <TextInput style={inp} value={startISO} onChangeText={setStartISO} autoCapitalize="none" />

      <Text>Ende (ISO)</Text>
      <TextInput style={inp} value={endISO} onChangeText={setEndISO} autoCapitalize="none" />

      <View style={{ marginTop: 12 }}>
        <Button title="Starten" onPress={starten} />
      </View>
    </View>
  );
}

const inp = { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 10 };
