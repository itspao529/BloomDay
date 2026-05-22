import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import API from "../services/api";

export default function NotificationScreen() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => { cargarNotificaciones(); }, []);

  const cargarNotificaciones = async () => {
    try {
      const res = await API.get("/notificaciones");
      setNotificaciones(res.data);
    } catch (e) { console.log(e); }
  };

  const marcarLeida = async (id) => {
    try {
      await API.put(`/notificaciones/${id}/leer`, {});
      cargarNotificaciones();
    } catch (e) { console.log(e); }
  };

  const hoy = new Date().toDateString();
  const notifHoy = notificaciones.filter(n => new Date(n.creado_en).toDateString() === hoy);
  const notifAnteriores = notificaciones.filter(n => new Date(n.creado_en).toDateString() !== hoy);
  const sinLeer = notificaciones.filter(n => !n.leida);

  const mostrar = filtro === "todas" ? { hoy: notifHoy, anteriores: notifAnteriores } : { hoy: sinLeer, anteriores: [] };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notifCard, item.leida && styles.leida]}
      onPress={() => marcarLeida(item.id)}
    >
      <View style={[styles.dot, { backgroundColor: item.leida ? "#7DBE7A" : "#E74C3C" }]} />
      <Text style={styles.notifText}>{item.mensaje}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Notificaciones</Text>

      <View style={styles.filtros}>
        <TouchableOpacity
          style={[styles.filtroBtn, filtro === "todas" && styles.filtroActivo]}
          onPress={() => setFiltro("todas")}
        >
          <Text style={[styles.filtroText, filtro === "todas" && styles.filtroTextActivo]}>Todo... &gt;</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filtroBtn, filtro === "sinleer" && styles.filtroActivo]}
          onPress={() => setFiltro("sinleer")}
        >
          <Text style={[styles.filtroText, filtro === "sinleer" && styles.filtroTextActivo]}>Sin Leer... &gt;</Text>
        </TouchableOpacity>
      </View>

      {mostrar.hoy.length > 0 && (
        <>
          <Text style={styles.seccion}>Hoy</Text>
          <FlatList
            data={mostrar.hoy}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </>
      )}

      {mostrar.anteriores.length > 0 && (
        <>
          <Text style={styles.seccion}>Anteriores</Text>
          <FlatList
            data={mostrar.anteriores}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </>
      )}

      {notificaciones.length === 0 && (
        <View style={styles.vacio}>
          <Text style={styles.vaciIcon}>🔔</Text>
          <Text style={styles.vacioText}>No hay notificaciones</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6EFD6", padding: 20 },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#222", marginTop: 40, marginBottom: 20 },
  filtros: { flexDirection: "row", gap: 10, marginBottom: 20 },
  filtroBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd" },
  filtroActivo: { backgroundColor: "#6B8F4E" },
  filtroText: { color: "#444", fontWeight: "bold" },
  filtroTextActivo: { color: "#fff" },
  seccion: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 10, marginTop: 5 },
  notifCard: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: "#ddd" },
  leida: { opacity: 0.6 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  notifText: { flex: 1, fontSize: 15, color: "#222" },
  vacio: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 80 },
  vaciIcon: { fontSize: 60, marginBottom: 15 },
  vacioText: { fontSize: 16, color: "#888" },
});
