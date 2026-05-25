import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
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

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 10,
          paddingBottom: 8,
          paddingTop: 6,
          height: 68,
        },
        tabBarActiveTintColor: "#FF6B9D",
        tabBarInactiveTintColor: "#CCC",
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
      }}
    >
      <Tab.Screen name="Inicio" component={HomeScreen}
        options={{ tabBarLabel: "Inicio", tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text> }} />
      <Tab.Screen name="Alumnos" component={AlumnosScreen}
        options={{ tabBarLabel: "Alumnos", tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👧</Text> }} />
      <Tab.Screen name="Tareas" component={TaskScreen}
        options={{ tabBarLabel: "Tareas", tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📋</Text> }} />
      <Tab.Screen name="Asistencia" component={AsistenciaScreen}
        options={{ tabBarLabel: "Asistencia", tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>✅</Text> }} />
      <Tab.Screen name="Perfil" component={ProfileScreen}
        options={{ tabBarLabel: "Más", tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>☰</Text> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen name="Tasks" component={TaskScreen} />
        <Stack.Screen name="Events" component={EventScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        <Stack.Screen name="Alumnos" component={AlumnosScreen} />
        <Stack.Screen name="Materias" component={MateriasScreen} />
        <Stack.Screen name="Calificaciones" component={CalificacionesScreen} />
        <Stack.Screen name="Asistencia" component={AsistenciaScreen} />
        <Stack.Screen name="Galeria" component={GaleriaScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
