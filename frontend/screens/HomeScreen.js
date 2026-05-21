import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {

  const cards = [
    {
      title: "Calendario",
      icon: "calendar-outline",
      screen: "Calendar",
    },
    {
      title: "Eventos",
      icon: "sparkles-outline",
      screen: "Events",
    },
    {
      title: "Tareas",
      icon: "checkmark-done-outline",
      screen: "Tasks",
    },
    {
      title: "Notificaciones",
      icon: "notifications-outline",
      screen: "Notifications",
    },
    {
      title: "Perfil",
      icon: "person-outline",
      screen: "Profile",
    },
  ];

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Dashboard
      </Text>

      <Text style={styles.subtitle}>
        Bienvenido a BloomDay
      </Text>

      <View style={styles.grid}>

        {cards.map((item, index) => (

          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)}
          >

            <Ionicons
              name={item.icon}
              size={40}
              color="#2563EB"
            />

            <Text style={styles.cardText}>
              {item.title}
            </Text>

          </TouchableOpacity>

        ))}

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
  },

  subtitle: {
    color: "#CBD5E1",
    marginBottom: 30,
    marginTop: 5,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "47%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    marginBottom: 15,
  },

  cardText: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16,
    color: "#0F172A",
  },

});
