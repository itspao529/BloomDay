import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import TaskScreen from "./screens/TaskScreen";
import EventScreen from "./screens/EventScreen";
import CalendarScreen from "./screens/CalendarScreen";
import NotificationScreen from "./screens/NotificationScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AlumnosScreen from "./screens/AlumnosScreen";
import MateriasScreen from "./screens/MateriasScreen";
import CalificacionesScreen from "./screens/CalificacionesScreen";
import AsistenciaScreen from "./screens/AsistenciaScreen";
import GaleriaScreen from "./screens/GaleriaScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabMaestra() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: "#fff", borderTopWidth: 0, shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 10, paddingBottom: 8, paddingTop: 6, height: 68 }, tabBarActiveTintColor: "#FF6B9D", tabBarInactiveTintColor: "#CCC", tabBarLabelStyle: { fontSize: 10, fontWeight: "700" } }}>
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ tabBarLabel: "Inicio", tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text> }} />
      <Tab.Screen name="Alumnos" component={AlumnosScreen} options={{ tabBarLabel: "Alumnos", tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👧</Text> }} />
      <Tab.Screen name="Tareas" component={TaskScreen} options={{ tabBarLabel: "Tareas", tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📋</Text> }} />
      <Tab.Screen name="Asistencia" component={AsistenciaScreen} options={{ tabBarLabel: "Asistencia", tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>✅</Text> }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ tabBarLabel: "Más", tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>☰</Text> }} />
    </Tab.Navigator>
  );
}

function TabPadre() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: "#fff", borderTopWidth: 0, shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 10, paddingBottom: 8, paddingTop: 6, height: 68 }, tabBarActiveTintColor: "#6BCB77", tabBarInactiveTintColor: "#CCC", tabBarLabelStyle: { fontSize: 10, fontWeight: "700" } }}>
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ tabBarLabel: "Inicio", tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text> }} />
      <Tab.Screen name="Tareas" component={TaskScreen} options={{ tabBarLabel: "Actividades", tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📋</Text> }} />
      <Tab.Screen name="Events" component={EventScreen} options={{ tabBarLabel: "Eventos", tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🎉</Text> }} />
      <Tab.Screen name="Notifications" component={NotificationScreen} options={{ tabBarLabel: "Avisos", tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🔔</Text> }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ tabBarLabel: "Mi Perfil", tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text> }} />
    </Tab.Navigator>
  );
}

function StackMaestra() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabMaestra" component={TabMaestra} />
      <Stack.Screen name="Events" component={EventScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="Asistencia" component={AsistenciaScreen} />
      <Stack.Screen name="Materias" component={MateriasScreen} />
      <Stack.Screen name="Calificaciones" component={CalificacionesScreen} />
      <Stack.Screen name="Galeria" component={GaleriaScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function StackPadre() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabPadre" component={TabPadre} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const u = await AsyncStorage.getItem("user");
        if (u) setRol(JSON.parse(u).rol);
      } catch (e) {}
      setCargando(false);
    };
    cargar();
  }, []);

  if (cargando) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={rol === "admin" ? StackMaestra : StackPadre} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
