import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import API from "../services/api";

export default function NotificationScreen() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => { cargarNotificaciones(); }, []);
  const cargarNotificaciones = async () => { try { const res = await API.get("/notificaciones"); setNotificaciones(res.data); } catch (e) { console.log(e); } };
  const marcarLeida = async (id) => { try { await API.put(`/notificaciones/${id}/leer`, {}); cargarNotificaciones(); } catch (e) { console.log(e); } };

  const hoy = new Date().toDateString();
  const notifHoy = notificaciones.filter(n => new Date(n.creado_en).toDateString() === hoy);
  const notifAnteriores = notificaciones.filter(n => new Date(n.creado_en).toDateString() !== hoy);
  const sinLeer = notificaciones.filter(n => !n.leida);
  const mostrar = filtro === "todas" ? { hoy: notifHoy, anteriores: notifAnteriores } : { hoy: sinLeer, anteriores: [] };
  const emojisNotif = ["📢","🌟","📌","🎈","💬","📚"];
  const colores = ["#FF6B9D20","#4D96FF20","#6BCB7720","#FFD93D20"];

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={[styles.notifCard, { backgroundColor: colores[index % colores.length] }, item.leida && styles.leida]} onPress={() => marcarLeida(item.id)}>
      <View style={styles.notifIconBox}><Text style={styles.notifEmoji}>{emojisNotif[index % emojisNotif.length]}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.notifText}>{item.mensaje}</Text>
        {!item.leida && <Text style={styles.notifHint}>Toca para marcar como leído</Text>}
      </View>
      {!item.leida && <View style={styles.puntito} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.circle, styles.c1]} />
        <Text style={styles.titulo}>🔔 Mensajes</Text>
        <Text style={styles.subtitulo}>de la Maestra</Text>
        {sinLeer.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{sinLeer.length} sin leer</Text></View>}
      </View>
      <View style={styles.filtros}>
        {[{ label: "📬 Todos", value: "todas" }, { label: `🔴 Sin Leer ${sinLeer.length > 0 ? `(${sinLeer.length})` : ""}`, value: "sinleer" }].map(f => (
          <TouchableOpacity key={f.value} style={[styles.filtroBtn, filtro === f.value && styles.filtroActivo]} onPress={() => setFiltro(f.value)}>
            <Text style={[styles.filtroText, filtro === f.value && styles.filtroTextActivo]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ padding: 20, paddingTop: 0 }}>
        {mostrar.hoy.length > 0 && <><Text style={styles.seccion}>📅 Hoy</Text><FlatList data={mostrar.hoy} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} scrollEnabled={false} /></>}
        {mostrar.anteriores.length > 0 && <><Text style={styles.seccion}>📁 Anteriores</Text><FlatList data={mostrar.anteriores} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} scrollEnabled={false} /></>}
        {notificaciones.length === 0 && <View style={styles.vacio}><Text style={styles.vacioEmoji}>📭</Text><Text style={styles.vacioText}>No hay mensajes todavía</Text><Text style={styles.vacioSub}>La maestra aún no ha enviado nada</Text></View>}
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBFF" },
  header: { backgroundColor: "#4D96FF", borderBottomLeftRadius: 32, borderBottomRightRadius: 32, padding: 24, paddingTop: 56, paddingBottom: 28, overflow: "hidden" },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 150, height: 150, backgroundColor: "#ffffff20", top: -50, right: -30 },
  titulo: { fontSize: 28, fontWeight: "900", color: "#fff" },
  subtitulo: { fontSize: 14, color: "#ffffff99", marginTop: 2 },
  badge: { marginTop: 10, backgroundColor: "#ffffff30", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, alignSelf: "flex-start" },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  filtros: { flexDirection: "row", gap: 12, padding: 20, paddingBottom: 12 },
  filtroBtn: { flex: 1, paddingVertical: 10, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  filtroActivo: { backgroundColor: "#4D96FF" },
  filtroText: { color: "#AAA", fontWeight: "700", fontSize: 13 },
  filtroTextActivo: { color: "#fff" },
  seccion: { fontSize: 15, fontWeight: "900", color: "#2D2D2D", marginBottom: 10, marginTop: 8 },
  notifCard: { borderRadius: 18, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 12 },
  leida: { opacity: 0.5 },
  notifIconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  notifEmoji: { fontSize: 22 },
  notifText: { fontSize: 14, color: "#2D2D2D", fontWeight: "600" },
  notifHint: { fontSize: 11, color: "#AAA", marginTop: 3 },
  puntito: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#FF6B9D" },
  vacio: { alignItems: "center", marginTop: 60 },
  vacioEmoji: { fontSize: 56, marginBottom: 12 },
  vacioText: { fontSize: 16, fontWeight: "900", color: "#2D2D2D" },
  vacioSub: { fontSize: 13, color: "#AAA", marginTop: 4 },
});
