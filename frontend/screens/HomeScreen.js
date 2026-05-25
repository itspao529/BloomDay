import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function HomeScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [tareasPendientes, setTareasPendientes] = useState(0);
  const [totalEventos, setTotalEventos] = useState(0);
  const [proximosEventos, setProximosEventos] = useState([]);
  const fecha = new Date();
  const dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const fechaTexto = `${dias[fecha.getDay()]} ${fecha.getDate()} de ${meses[fecha.getMonth()]}`;
  const saludo = () => { const h = new Date().getHours(); if (h < 12) return "¡Buenos días"; if (h < 18) return "¡Buenas tardes"; return "¡Buenas noches"; };

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      const u = await AsyncStorage.getItem("user");
      if (u) setUsuario(JSON.parse(u));
      const resTareas = await API.get("/tareas");
      setTareasPendientes(resTareas.data.filter(t => t.estado === "pendiente").length);
      const resEventos = await API.get("/eventos");
      setTotalEventos(resEventos.data.length);
      setProximosEventos(resEventos.data.slice(0, 3));
    } catch (e) { console.log(e); }
  };

  const esAdmin = usuario?.rol === "admin" || usuario?.rol === "admin";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.circle, styles.c1]} />
        <View style={[styles.circle, styles.c2]} />
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.saludo}>{saludo()},</Text>
            <Text style={styles.nombre}>{usuario?.nombre?.split(" ")[0] || "Amig@"} 👋</Text>
            <Text style={styles.fecha}>{fechaTexto}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate("Notifications")}>
            <Text style={styles.notifEmoji}>🔔</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rolPill}>
          <Text style={styles.rolPillText}>{esAdmin ? "👩‍🏫 Maestra" : "👨‍👩‍👧 Familia"}</Text>
        </View>
      </View>

      <View style={styles.cardsRow}>
        {[
          { emoji: "📋", num: tareasPendientes, label: "Actividades", color: "#FF6B9D", screen: "Tasks" },
          { emoji: "🎉", num: totalEventos, label: "Eventos", color: "#4D96FF", screen: "Events" },
          { emoji: "👧", num: 0, label: "Alumnos", color: "#6BCB77", screen: "Alumnos" },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={[styles.statCard, { backgroundColor: item.color }]} onPress={() => navigation.navigate(item.screen)}>
            <Text style={styles.statEmoji}>{item.emoji}</Text>
            <Text style={styles.statNum}>{item.num}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bannerCard}>
        <Text style={styles.bannerEmoji}>🏫</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Salón Kinder</Text>
          <Text style={styles.bannerSub}>¡Hoy es un gran día para aprender!</Text>
        </View>
      </View>

      <View style={styles.seccionHeader}>
        <Text style={styles.seccionTitulo}>📅 Próximos Eventos</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Events")}>
          <Text style={styles.verTodos}>Ver todos →</Text>
        </TouchableOpacity>
      </View>

      {proximosEventos.length === 0 ? (
        <View style={styles.vacioCard}>
          <Text style={styles.vacioEmoji}>🌟</Text>
          <Text style={styles.vacioText}>No hay eventos próximos</Text>
        </View>
      ) : (
        proximosEventos.map((evento, i) => (
          <View key={i} style={styles.eventoCard}>
            <View style={[styles.eventoIconBox, { backgroundColor: ["#FF6B9D20","#4D96FF20","#6BCB7720"][i % 3] }]}>
              <Text style={styles.eventoIcon}>{["🎈","📌","🎉"][i % 3]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
              <Text style={styles.eventoFecha}>{evento.fecha ? new Date(evento.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "long" }) : "Sin fecha"}</Text>
            </View>
          </View>
        ))
      )}

      {esAdmin && (
        <View style={styles.quickBox}>
          <Text style={styles.quickTitle}>⚡ Acceso Rápido</Text>
          <View style={styles.quickGrid}>
            {[
              { emoji: "➕", label: "Nueva\nActividad", screen: "Tasks", color: "#FF6B9D" },
              { emoji: "📌", label: "Nuevo\nEvento", screen: "Events", color: "#4D96FF" },
              { emoji: "👧", label: "Ver\nAlumnos", screen: "Alumnos", color: "#6BCB77" },
              { emoji: "✅", label: "Asistencia", screen: "Asistencia", color: "#FFD93D" },
            ].map((item, i) => (
              <TouchableOpacity key={i} style={styles.quickBtn} onPress={() => navigation.navigate(item.screen)}>
                <View style={[styles.quickIconBox, { backgroundColor: item.color + "20" }]}>
                  <Text style={styles.quickEmoji}>{item.emoji}</Text>
                </View>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBFF" },
  header: { backgroundColor: "#FF6B9D", borderBottomLeftRadius: 32, borderBottomRightRadius: 32, padding: 24, paddingTop: 56, paddingBottom: 32, overflow: "hidden" },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 180, height: 180, backgroundColor: "#ffffff20", top: -60, right: -40 },
  c2: { width: 120, height: 120, backgroundColor: "#ffffff15", bottom: -30, left: 20 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  saludo: { fontSize: 16, color: "#ffffff99", fontWeight: "600" },
  nombre: { fontSize: 26, fontWeight: "900", color: "#fff" },
  fecha: { fontSize: 13, color: "#ffffff99", marginTop: 2 },
  notifBtn: { backgroundColor: "#ffffff30", width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  notifEmoji: { fontSize: 22 },
  rolPill: { marginTop: 12, backgroundColor: "#ffffff30", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, alignSelf: "flex-start" },
  rolPillText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  cardsRow: { flexDirection: "row", gap: 12, padding: 20, paddingBottom: 0 },
  statCard: { flex: 1, borderRadius: 20, padding: 16, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  statEmoji: { fontSize: 26, marginBottom: 6 },
  statNum: { fontSize: 32, fontWeight: "900", color: "#fff" },
  statLabel: { fontSize: 11, fontWeight: "700", color: "#ffffff99", textAlign: "center", marginTop: 2 },
  bannerCard: { margin: 20, backgroundColor: "#fff", borderRadius: 20, padding: 18, flexDirection: "row", alignItems: "center", gap: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  bannerEmoji: { fontSize: 40 },
  bannerTitle: { fontSize: 17, fontWeight: "900", color: "#2D2D2D" },
  bannerSub: { fontSize: 13, color: "#AAA", marginTop: 2 },
  seccionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 12 },
  seccionTitulo: { fontSize: 17, fontWeight: "900", color: "#2D2D2D" },
  verTodos: { fontSize: 13, color: "#FF6B9D", fontWeight: "700" },
  vacioCard: { marginHorizontal: 20, backgroundColor: "#fff", borderRadius: 16, padding: 24, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  vacioEmoji: { fontSize: 36, marginBottom: 8 },
  vacioText: { color: "#AAA", fontSize: 14, fontWeight: "600" },
  eventoCard: { marginHorizontal: 20, backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  eventoIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  eventoIcon: { fontSize: 22 },
  eventoTitulo: { fontSize: 15, fontWeight: "800", color: "#2D2D2D" },
  eventoFecha: { fontSize: 12, color: "#AAA", marginTop: 2 },
  quickBox: { margin: 20, backgroundColor: "#fff", borderRadius: 24, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  quickTitle: { fontSize: 15, fontWeight: "900", color: "#2D2D2D", marginBottom: 16 },
  quickGrid: { flexDirection: "row", justifyContent: "space-between" },
  quickBtn: { alignItems: "center", width: "22%" },
  quickIconBox: { width: 52, height: 52, borderRadius: 16, justifyContent: "center", alignItems: "center", marginBottom: 6 },
  quickEmoji: { fontSize: 26 },
  quickLabel: { fontSize: 11, fontWeight: "700", color: "#888", textAlign: "center" },
});
