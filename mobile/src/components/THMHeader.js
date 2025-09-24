import React from "react";
import { View, Image, Text } from "react-native";
import { colors } from "../theme";

export default function THMHeader({ title="EV Charger" }) {
    return (
        <View style={{backgroundColor: colors.primary, paddingVertical:12, paddingHorizontal:16, flexDirection:"row", alignItems:"center"}}>
            <Image source={require("../../assets/thm-logo.png")} style={{height:28, width:110, resizeMode:"contain", marginRight:12}}/>
            <Text style={{color:"#fff", fontSize:18, fontWeight:"700"}}>{title}</Text>
        </View>
    );
}
