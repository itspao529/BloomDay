import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  useEffect(() => { cargarUsuario(); }, []);
  const cargarUsuario = async () => { try { const u = await AsyncStorage.getItem("user"); if (u) setUsuario(JSON.parse(u)); } catch (e) { console.log(e); } };
  const cerrarSesion = async () => {
    Alert.alert("¿Salir?", "¿Seguro que quieres cerrar sesión?", [
      { text: "Quedarme", style: "cancel" },
      { text: "Salir 👋", style: "destructive", onPress: async () => { await AsyncStorage.removeItem("token"); await AsyncStorage.removeItem("user"); navigation.replace("Login"); } }
    ]);
  };
  const esAdmin = usuario?.rol === "admin" || usuario?.rol === "admin";
  const iniciales = usuario?.nombre ? usuario.nombre.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "??";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.circle, styles.c1]} />
        <View style={[styles.circle, styles.c2]} />
        <View style={styles.avatarBox}><Text style={styles.avatarText}>{iniciales}</Text></View>
        <Text style={styles.nombre}>{usuario?.nombre || "Usuario"}</Text>
        <View style={styles.rolPill}><Text style={styles.rolPillText}>{esAdmin ? "👩‍🏫 Maestra" : "👨‍👩‍👧 Familia"}</Text></View>
        <Text style={styles.idText}>ID: KG-{String(usuario?.id || 0).padStart(4,"0")}</Text>
      </View>
      <View style={styles.infoCard}>
        {[{ emoji: "✉️", label: "Correo", valor: usuario?.email || "---" }, { emoji: "🏫", label: "Salón", valor: "Kinder A - Blooming Kids" }].map((item, i) => (
          <View key={i}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}><Text style={styles.infoEmoji}>{item.emoji}</Text></View>
              <View><Text style={styles.infoLabel}>{item.label}</Text><Text style={styles.infoValor}>{item.valor}</Text></View>
            </View>
            {i === 0 && <View style={styles.sep} />}
          </View>
        ))}
      </View>
      <View style={styles.opcionesCard}>
        {[
          { emoji: "🔔", label: "Notificaciones", badge: "Activadas ✓", color: "#6BCB77" },
          { emoji: "🔑", label: "Cambiar Contraseña", arrow: true },
          { emoji: "🖼️", label: "Galería del Salón", arrow: true, screen: "Galeria" },
          { emoji: "📖", label: "Materias", arrow: true, screen: "Materias" },
          { emoji: "⭐", label: "Calificaciones", arrow: true, screen: "Calificaciones" },
          ...(esAdmin ? [{ emoji: "✅", label: "Asistencia", arrow: true, screen: "Asistencia" }, { emoji: "👧", label: "Alumnos", arrow: true, screen: "Alumnos" }] : []),
        ].map((item, i, arr) => (
          <View key={i}>
            <TouchableOpacity style={styles.opcionRow} onPress={() => item.screen && navigation.navigate(item.screen)}>
              <View style={styles.opcionIconBox}><Text style={styles.opcionEmoji}>{item.emoji}</Text></View>
              <Text style={styles.opcionText}>{item.label}</Text>
              {item.badge && <Text style={[styles.opcionBadge, { color: item.color }]}>{item.badge}</Text>}
              {item.arrow && <Text style={styles.opcionArrow}>›</Text>}
            </TouchableOpacity>
            {i < arr.length - 1 && <View style={styles.sep} />}
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.cerrarBtn} onPress={cerrarSesion}>
        <Text style={styles.cerrarEmoji}>🚪</Text>
        <Text style={styles.cerrarText}>Cerrar Sesión</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBFF" },
  header: { backgroundColor: "#FF6B9D", borderBottomLeftRadius: 32, borderBottomRightRadius: 32, padding: 24, paddingTop: 56, paddingBottom: 32, alignItems: "center", overflow: "hidden" },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 180, height: 180, backgroundColor: "#ffffff20", top: -60, right: -40 },
  c2: { width: 120, height: 120, backgroundColor: "#ffffff15", bottom: -30, left: 20 },
  avatarBox: { width: 90, height: 90, borderRadius: 30, backgroundColor: "#ffffff30", justifyContent: "center", alignItems: "center", marginBottom: 12, borderWidth: 3, borderColor: "#ffffff50" },
  avatarText: { fontSize: 36, fontWeight: "900", color: "#fff" },
  nombre: { fontSize: 22, fontWeight: "900", color: "#fff", marginBottom: 8 },
  rolPill: { backgroundColor: "#ffffff30", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 6 },
  rolPillText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  idText: { color: "#ffffff80", fontSize: 12, fontWeight: "600" },
  infoCard: { margin: 20, marginBottom: 14, backgroundColor: "#fff", borderRadius: 22, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 4 },
  infoIconBox: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#FF6B9D20", justifyContent: "center", alignItems: "center" },
  infoEmoji: { fontSize: 20 },
  infoLabel: { fontSize: 11, color: "#AAA", fontWeight: "700" },
  infoValor: { fontSize: 14, color: "#2D2D2D", fontWeight: "600" },
  sep: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 10 },
  opcionesCard: { marginHorizontal: 20, marginBottom: 14, backgroundColor: "#fff", borderRadius: 22, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  opcionRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  opcionIconBox: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#F8F8F8", justifyContent: "center", alignItems: "center" },
  opcionEmoji: { fontSize: 20 },
  opcionText: { flex: 1, fontSize: 14, color: "#2D2D2D", fontWeight: "600" },
  opcionBadge: { fontSize: 12, fontWeight: "700" },
  opcionArrow: { fontSize: 22, color: "#CCC" },
  cerrarBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginHorizontal: 20, padding: 16, backgroundColor: "#FF6B9D20", borderRadius: 18, borderWidth: 2, borderColor: "#FF6B9D" },
  cerrarEmoji: { fontSize: 20 },
  cerrarText: { fontSize: 15, color: "#FF6B9D", fontWeight: "900" },
});
