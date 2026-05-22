import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => { cargarUsuario(); }, []);

  const cargarUsuario = async () => {
    try {
      const u = await AsyncStorage.getItem("usuario");
      if (u) setUsuario(JSON.parse(u));
    } catch (e) { console.log(e); }
  };

  const cerrarSesion = async () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir", style: "destructive", onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("usuario");
          navigation.replace("Login");
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Mi Perfil</Text>

      <View style={styles.perfilCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>
        <View style={styles.perfilInfo}>
          <Text style={styles.nombre}>{usuario?.nombre || "Usuario"}</Text>
          <Text style={styles.rol}>{usuario?.rol === "admin" ? "Docente" : "Estudiante"}</Text>
          <Text style={styles.carnet}>{usuario?.id ? `Mp${usuario.id}` : ""}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>✉️</Text>
          <Text style={styles.infoText}>Correo : {usuario?.email || "---"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📞</Text>
          <Text style={styles.infoText}>Telefono: ---</Text>
        </View>
      </View>

      <View style={styles.opcionesCard}>
        <TouchableOpacity style={styles.opcionRow}>
          <Text style={styles.opcionIcon}>🔔</Text>
          <Text style={styles.opcionText}>Notificaciones</Text>
          <Text style={styles.opcionBadge}>Activadas &gt;</Text>
        </TouchableOpacity>
        <View style={styles.separador} />
        <TouchableOpacity style={styles.opcionRow}>
          <Text style={styles.opcionIcon}>🔑</Text>
          <Text style={styles.opcionText}>Cambiar Contraseña</Text>
          <Text style={styles.opcionArrow}>&gt;</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.cerrarBtn} onPress={cerrarSesion}>
        <Text style={styles.cerrarIcon}>🚪</Text>
        <Text style={styles.cerrarText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6EFD6", padding: 20 },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#222", marginTop: 40, marginBottom: 20, textAlign: "center" },
  perfilCard: { backgroundColor: "#fff", borderRadius: 12, padding: 20, flexDirection: "row", alignItems: "center", gap: 15, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#D4C9A8", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#bbb" },
  avatarIcon: { fontSize: 36 },
  perfilInfo: { flex: 1 },
  nombre: { fontSize: 18, fontWeight: "bold", color: "#222" },
  rol: { fontSize: 14, color: "#555", marginTop: 2 },
  carnet: { fontSize: 13, color: "#777", marginTop: 2 },
  infoCard: { backgroundColor: "#fff", borderRadius: 12, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  infoIcon: { fontSize: 18 },
  infoText: { fontSize: 15, color: "#333" },
  opcionesCard: { backgroundColor: "#fff", borderRadius: 12, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  opcionRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 5 },
  opcionIcon: { fontSize: 18 },
  opcionText: { flex: 1, fontSize: 15, color: "#333" },
  opcionBadge: { fontSize: 13, color: "#E74C3C", fontWeight: "bold" },
  opcionArrow: { fontSize: 16, color: "#888" },
  separador: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  cerrarBtn: { flexDirection: "row", alignItems: "center", gap: 10, padding: 18, backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#ddd", marginBottom: 30 },
  cerrarIcon: { fontSize: 20 },
  cerrarText: { fontSize: 16, color: "#333" },
});
