import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListScreen from "./screens/ListScreen";
import LoginScreen from "./screens/auth/login";
import RegisterScreen from "./screens/auth/register";
import New_Password from "./screens/auth/reset_password/new_password";
import Request_New_Password from "./screens/auth/reset_password/request_new_password";
import "./styles/global.css";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="List">
        <Stack.Screen name="List" component={ListScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
