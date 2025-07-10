import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListScreen from "./screens/ListScreen";
import LoginScreen from "./screens/auth/login";
import RegisterScreen from "./screens/auth/register";
import New_Password from "./screens/auth/reset_password/new_password";
import Request_New_Password from "./screens/auth/reset_password/request_new_password";
import "./styles/global.css";
import ListInstitutionScreen from "./screens/institution/List";
import ListBusScreen from "./screens/bus/List";
import ListUserScreen from "./screens/user/List";
import UserProfileScreen from "./screens/UserProfileScreen";
import CompanhiasScreen from "./screens/CompanhiasScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="List">
        <Stack.Screen name="List" component={ListScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ListBus" component={ListBusScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ListInstitution" component={ListInstitutionScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SolicitarNovaSenha" component={Request_New_Password} />
        <Stack.Screen name="NovaSenha" component={New_Password} />
        <Stack.Screen name="ListUsers" component={ListUserScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="CompanhiasList" component={CompanhiasScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
