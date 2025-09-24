import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import THMHeader from "../components/THMHeader";
import { colors } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../http";
import { useAuth } from "../../App";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const { setAuthed } = useAuth();

  const onLogin = async () => {
    setErr("");
    try {
      const r = await api.post("/api/auth/login", { email, password: pw });
      await AsyncStorage.setItem("token", r.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(r.data.user));
      setAuthed(true);
    } catch (e) { setErr("Login fehlgeschlagen"); }
  };

  return (
    <View style={{flex:1, backgroundColor: colors.bg}}>
      <THMHeader title="THM • Login" />
      <View style={s.box}>
        <Text style={s.h}>Willkommen</Text>
        <TextInput style={s.in} placeholder="THM-E-Mail" autoCapitalize="none" value={email} onChangeText={setEmail}/>
        <TextInput style={s.in} placeholder="Passwort" secureTextEntry value={pw} onChangeText={setPw}/>
        {!!err && <Text style={{color:"crimson", marginBottom:8}}>{err}</Text>}
        <Button title="Einloggen" color={colors.primary} onPress={onLogin}/>
        <View style={{height:8}}/>
        <Button title="Registrieren" onPress={()=>navigation.navigate("Register")}/>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  box:{ padding:16 }, h:{ fontSize:22, fontWeight:"700", marginBottom:12, color: colors.text },
  in:{ borderWidth:1, borderColor: colors.border, borderRadius:8, padding:10, marginBottom:10 }
});
