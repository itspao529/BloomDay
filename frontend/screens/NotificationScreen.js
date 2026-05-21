import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NotificationScreen() {
  const hasNotifications = false; // simulación

  if (!hasNotifications) {
    return (
      <View style={styles.container}>
        
        <View style={styles.iconWrapper}>
          <Ionicons name="notifications-off-outline" size={70} color="#2563EB" />
        </View>

        <Text style={styles.title}>Sin notificaciones</Text>

        <Text style={styles.description}>
          Aquí aparecerán tus alertas, mensajes y actualizaciones importantes.
        </Text>

      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>

      {/* Aquí luego iría un FlatList */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  description: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 300,
  },
});
