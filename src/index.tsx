import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import ListScreen from "./screens/ListScreen";
import LoginPage from "./screens/auth/login";
import Register from "./screens/auth/register";
import DefaultScreen from "./screens/DefaultScreen";
import New_Password from "./screens/auth/reset_password/new_password";
import Request_New_Password from "./screens/auth/reset_password/request_new_password";
import "./styles/global.css";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Casa">
        <Stack.Screen name="Casa" component={HomeScreen} />
        {/* <Stack.Screen name="List" component={ListScreen} /> */}
        {/* <Stack.Screen name="Testando" component={Register} /> */}
        <Stack.Screen name="Login" component={Register} />
        <Stack.Screen name="Listagem" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
