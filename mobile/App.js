import React, { useEffect, useState, createContext, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import Home from "./src/screens/Home";
import Reserve from "./src/screens/Reserve";
import Session from "./src/screens/Session";

const AuthCtx = createContext({ authed: false, setAuthed: () => {} });
export const useAuth = () => useContext(AuthCtx);

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("token").then((t) => {
      setAuthed(!!t);
      setChecked(true);
    });
  }, []);

  if (!checked) return null; // kurzes Gate

  return (
    <AuthCtx.Provider value={{ authed, setAuthed }}>
      <NavigationContainer>
        {authed ? (
          <AppStack.Navigator>
            <AppStack.Screen name="Home" component={Home} />
            <AppStack.Screen name="Reserve" component={Reserve} />
            <AppStack.Screen name="Session" component={Session} />
          </AppStack.Navigator>
        ) : (
          <AuthStack.Navigator>
            <AuthStack.Screen name="Login" component={Login} />
            <AuthStack.Screen name="Register" component={Register} />
          </AuthStack.Navigator>
        )}
      </NavigationContainer>
    </AuthCtx.Provider>
  );
}
