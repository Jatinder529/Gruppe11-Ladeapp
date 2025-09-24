import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from "react-native";
import THMHeader from "../components/THMHeader";
import { colors } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../http";

const BUILDINGS = ["Alle","A2","B1"];

export default function Home({ navigation }) {
  const [data, setData] = useState([]);
  const [free, setFree] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [building, setBuilding] = useState("Alle");

  const load = async () => {
    const q = building==="Alle" ? "" : `?standort=${encodeURIComponent(building)}`;
    const r = await api.get(`/api/ladepunkte${q}`);
    setData(r.data);
    setFree(r.data.filter(x=>x.status==="frei").length);
  };
  useEffect(()=>{ load(); }, [building]);

  const logout = async () => {
    await AsyncStorage.multiRemove(["token","user","lastReservationId","lastReservationStart","lastReservationEnd"]);
    navigation.reset({ index:0, routes:[{ name:"Login" }] });
  };

  const render = ({ item }) => {
    const restSek = item.endzeit ? Math.max(0, Math.floor((new Date(item.endzeit).getTime() - Date.now())/1000)) : 0;
    const restStr = item.status!=="frei" && item.endzeit
      ? `${Math.floor(restSek/60)} min`
      : "frei";
    return (
      <View style={s.card}>
        <Text style={s.title}>{item.standort} • Nr.{item.nummer}</Text>
        <View style={{flexDirection:"row", gap:8, marginTop:6}}>
          <Badge text={item.status} />
          <Badge text={restStr} kind={item.status==="frei" ? "ok" : "warn"} />
        </View>
        <View style={{ marginTop: 10, alignSelf: "flex-start" }}>
          <Button title="Reservieren" color={colors.primary} onPress={()=>navigation.navigate("Reserve",{ ladepunkt:item })}/>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex:1, backgroundColor: colors.bg}}>
      <THMHeader title="THM • Ladepunkte" />
      <View style={{padding:16}}>
        <Text style={{fontSize:18, fontWeight:"700", marginBottom:8}}>Freie Ladepunkte: {free}</Text>

        {/* Gebäude-Filter */}
        <View style={{flexDirection:"row", gap:8, marginBottom:12}}>
          {BUILDINGS.map(b=>(
            <TouchableOpacity key={b} onPress={()=>setBuilding(b)} style={[s.seg, building===b && s.segA]}>
              <Text style={{color: building===b ? "#fff" : colors.text}}>{b}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={data}
          keyExtractor={(it,i)=>it.id ?? String(i)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true); load().finally(()=>setRefreshing(false));}}/>}
          renderItem={render}
        />

        <View style={{height:8}}/>
        <Button title="Ladevorgang ansehen" onPress={()=>navigation.navigate("Session")} />
        <View style={{height:8}}/>
        <Button title="Logout" color="#888" onPress={logout}/>
      </View>
    </View>
  );
}
function Badge({ text, kind }) {
  const bg = kind==="ok" ? "#e8f6ee" : (kind==="warn" ? "#fff4e5" : "#eee");
  const fg = kind==="ok" ? "#0b8f3f" : (kind==="warn" ? "#a15c00" : "#444");
  return <Text style={{backgroundColor:bg, color:fg, paddingHorizontal:8, paddingVertical:4, borderRadius:14, overflow:"hidden"}}>{text}</Text>;
}
const s = StyleSheet.create({
  card:{ padding:12, borderWidth:1, borderColor: colors.border, borderRadius:10, backgroundColor: colors.card, marginBottom:10 },
  title:{ fontWeight:"700" },
  seg:{ paddingHorizontal:12, paddingVertical:8, borderRadius:10, borderWidth:1, borderColor: colors.border },
  segA:{ backgroundColor: colors.primary, borderColor: colors.primary },
});
