import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import CalendarScreen from "../screens/CalendarScreen";
import EventScreen from "../screens/EventScreen";
import TaskScreen from "../screens/TaskScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#F6EFD6",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          paddingBottom: 5,
          height: 60,
        },
        tabBarActiveTintColor: "#C0392B",
        tabBarInactiveTintColor: "#888",
        tabBarIcon: ({ focused }) => {
          const icons = {
            Inicio: "🏠",
            Agenda: "📅",
            Tareas: "✅",
            Alertas: "🔔",
            Perfil: "👤",
          };
          return <Text style={{ fontSize: focused ? 26 : 22 }}>{icons[route.name]}</Text>;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Agenda" component={CalendarScreen} />
      <Tab.Screen name="Tareas" component={TaskScreen} />
      <Tab.Screen name="Alertas" component={NotificationScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Events" component={EventScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
