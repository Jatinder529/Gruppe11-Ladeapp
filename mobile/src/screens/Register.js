import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../http";
import { useAuth } from "../../App";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const { setAuthed } = useAuth();

  const onReg = async () => {
    setErr("");
    try {
      const r = await api.post("/api/auth/register", { name, email, password: pw });
      await AsyncStorage.setItem("token", r.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(r.data.user));
      setAuthed(true);
    } catch (e) {
      setErr("Registrierung fehlgeschlagen");
    }
  };

  return (
    <View style={s.box}>
      <Text style={s.h}>Registrieren</Text>
      <TextInput style={s.in} placeholder="Name" value={name} onChangeText={setName}/>
      <TextInput style={s.in} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail}/>
      <TextInput style={s.in} placeholder="Passwort" secureTextEntry value={pw} onChangeText={setPw}/>
      {!!err && <Text style={{ color: "crimson", marginBottom: 8 }}>{err}</Text>}
      <Button title="Konto anlegen" onPress={onReg}/>
    </View>
  );
}
const s = StyleSheet.create({
  box: { padding: 16 },
  h: { fontSize: 22, fontWeight: "600", marginBottom: 12 },
  in: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 10 },
});
