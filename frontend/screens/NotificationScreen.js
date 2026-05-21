import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function NotificationScreen() {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const getToken = async () => await AsyncStorage.getItem("token");

  const cargarNotificaciones = async () => {
    try {
      const token = await getToken();
      const res = await API.get("/notificaciones", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotificaciones(res.data);
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
    }
  };

  const marcarLeida = async (id) => {
    try {
      const token = await getToken();
      await API.put(`/notificaciones/${id}/leer`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarNotificaciones();
    } catch (error) {
      console.error("Error marcando notificación:", error);
    }
  };

  if (notificaciones.length === 0) {
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
    <View style={styles.containerList}>
      <Text style={styles.title}>Notificaciones</Text>
      <FlatList
        data={notificaciones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notifCard, item.leida && styles.leida]}
            onPress={() => marcarLeida(item.id)}
          >
            <Ionicons
              name={item.leida ? "checkmark-circle" : "notifications-outline"}
              size={24}
              color={item.leida ? "#22C55E" : "#2563EB"}
            />
            <View style={styles.notifText}>
              <Text style={styles.notifTitulo}>{item.titulo}</Text>
              <Text style={styles.notifMensaje}>{item.mensaje}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", justifyContent: "center", alignItems: "center", padding: 24 },
  containerList: { flex: 1, backgroundColor: "#0F172A", padding: 20 },
  iconWrapper: { width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(37, 99, 235, 0.1)", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  title: { color: "white", fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 20, marginTop: 20 },
  description: { color: "#94A3B8", textAlign: "center", marginTop: 10, fontSize: 15, lineHeight: 22, maxWidth: 300 },
  notifCard: { backgroundColor: "#1E293B", borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  leida: { opacity: 0.5 },
  notifText: { flex: 1 },
  notifTitulo: { color: "white", fontWeight: "bold", fontSize: 15 },
  notifMensaje: { color: "#94A3B8", marginTop: 4 },
});