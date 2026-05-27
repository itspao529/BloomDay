import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function HomeScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [tareasPendientes, setTareasPendientes] = useState(0);
  const [totalEventos, setTotalEventos] = useState(0);
  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [proximosEventos, setProximosEventos] = useState([]);
  const [miHijo, setMiHijo] = useState(null);

  const fecha = new Date();
  const dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const fechaTexto = `${dias[fecha.getDay()]} ${fecha.getDate()} de ${meses[fecha.getMonth()]}`;
  const saludo = () => {
    const h = new Date().getHours();
    if (h < 12) return "¡Buenos días";
    if (h < 18) return "¡Buenas tardes";
    return "¡Buenas noches";
  };

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      const u = await AsyncStorage.getItem("user");
      if (!u) return;
      const parsed = JSON.parse(u);
      setUsuario(parsed);

      const [resTareas, resEventos] = await Promise.all([
        API.get("/tareas"),
        API.get("/eventos"),
      ]);

      setTareasPendientes(resTareas.data.filter(t => t.estado === "pendiente").length);
      setTotalEventos(resEventos.data.length);
      setProximosEventos(resEventos.data.slice(0, 3));

      if (parsed.rol === "admin") {
        const resAlumnos = await API.get("/estudiantes");
        setTotalAlumnos(resAlumnos.data.length);
      } else {
        const resHijo = await API.get("/estudiantes/mi-hijo");
        if (resHijo.data.length > 0) setMiHijo(resHijo.data[0]);
      }
    } catch (e) { console.log(e); }
  };

  const esAdmin = usuario?.rol === "admin";

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: esAdmin ? "#FF6B9D" : "#6BCB77" }]}>
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

      {/* ===== TARJETAS MAESTRA ===== */}
      {esAdmin && (
        <View style={styles.cardsRow}>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: "#FF6B9D" }]} onPress={() => navigation.navigate("Tareas")}>
            <Text style={styles.statEmoji}>📋</Text>
            <Text style={styles.statNum}>{tareasPendientes}</Text>
            <Text style={styles.statLabel}>Actividades</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: "#4D96FF" }]} onPress={() => navigation.navigate("Events")}>
            <Text style={styles.statEmoji}>🎉</Text>
            <Text style={styles.statNum}>{totalEventos}</Text>
            <Text style={styles.statLabel}>Eventos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: "#6BCB77" }]} onPress={() => navigation.navigate("Alumnos")}>
            <Text style={styles.statEmoji}>👧</Text>
            <Text style={styles.statNum}>{totalAlumnos}</Text>
            <Text style={styles.statLabel}>Alumnos</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ===== TARJETAS PAPÁ/MAMÁ ===== */}
      {!esAdmin && (
        <>
          {miHijo ? (
            <View style={styles.hijoCard}>
              <View style={styles.hijoHeader}>
                <View style={styles.hijoAvatarBox}>
                  <Text style={styles.hijoAvatarEmoji}>👶</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hijoLabel}>MI HIJO/A</Text>
                  <Text style={styles.hijoNombre}>{miHijo.nombre}</Text>
                  <Text style={styles.hijoInfo}>{miHijo.edad} años · {miHijo.matricula} · Kinder A</Text>
                </View>
              </View>
              <View style={styles.cardsRowPadre}>
                <View style={[styles.statCardPadre, { backgroundColor: "#FF6B9D15" }]}>
                  <Text style={[styles.statNumPadre, { color: "#FF6B9D" }]}>{tareasPendientes}</Text>
                  <Text style={styles.statLabelPadre}>⏳ Pendientes</Text>
                </View>
                <View style={[styles.statCardPadre, { backgroundColor: "#6BCB7715" }]}>
                  <Text style={[styles.statNumPadre, { color: "#6BCB77" }]}>{totalEventos}</Text>
                  <Text style={styles.statLabelPadre}>🎉 Eventos</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.sinHijoCard}>
              <Text style={styles.sinHijoEmoji}>🏫</Text>
              <Text style={styles.sinHijoText}>Tu hijo aún no está vinculado</Text>
              <Text style={styles.sinHijoSub}>Contacta a la maestra para vincularlo</Text>
            </View>
          )}
        </>
      )}

      <View style={styles.bannerCard}>
        <Text style={styles.bannerEmoji}>🏫</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Salón Kinder A</Text>
          <Text style={styles.bannerSub}>¡Hoy es un gran día para aprender!</Text>
        </View>
      </View>

      <View style={styles.seccionHeader}>
        <Text style={styles.seccionTitulo}>📅 Próximos Eventos</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Events")}>
          <Text style={[styles.verTodos, { color: esAdmin ? "#FF6B9D" : "#6BCB77" }]}>Ver todos →</Text>
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
              <Text style={styles.eventoFecha}>
                {evento.fecha ? new Date(evento.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "long" }) : "Sin fecha"}
              </Text>
            </View>
          </View>
        ))
      )}

      {/* Acceso rápido solo para maestra */}
      {esAdmin && (
        <View style={styles.quickBox}>
          <Text style={styles.quickTitle}>⚡ Acceso Rápido</Text>
          <View style={styles.quickGrid}>
            {[
              { emoji: "➕", label: "Nueva\nActividad", screen: "Tareas", color: "#FF6B9D" },
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
  header: { borderBottomLeftRadius: 32, borderBottomRightRadius: 32, padding: 24, paddingTop: 56, paddingBottom: 32, overflow: "hidden" },
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
  hijoCard: { margin: 20, marginBottom: 12, backgroundColor: "#fff", borderRadius: 22, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  hijoHeader: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 },
  hijoAvatarBox: { width: 56, height: 56, borderRadius: 18, backgroundColor: "#6BCB7720", justifyContent: "center", alignItems: "center" },
  hijoAvatarEmoji: { fontSize: 30 },
  hijoLabel: { fontSize: 10, color: "#AAA", fontWeight: "800", letterSpacing: 1 },
  hijoNombre: { fontSize: 18, fontWeight: "900", color: "#2D2D2D", marginTop: 2 },
  hijoInfo: { fontSize: 12, color: "#AAA", marginTop: 3 },
  cardsRowPadre: { flexDirection: "row", gap: 10 },
  statCardPadre: { flex: 1, borderRadius: 14, padding: 14, alignItems: "center" },
  statNumPadre: { fontSize: 26, fontWeight: "900" },
  statLabelPadre: { fontSize: 11, fontWeight: "700", color: "#888", marginTop: 2 },
  sinHijoCard: { margin: 20, backgroundColor: "#fff", borderRadius: 22, padding: 24, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  sinHijoEmoji: { fontSize: 48, marginBottom: 12 },
  sinHijoText: { fontSize: 16, fontWeight: "800", color: "#2D2D2D" },
  sinHijoSub: { fontSize: 13, color: "#AAA", marginTop: 4, textAlign: "center" },
  bannerCard: { margin: 20, marginTop: 16, backgroundColor: "#fff", borderRadius: 20, padding: 18, flexDirection: "row", alignItems: "center", gap: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  bannerEmoji: { fontSize: 40 },
  bannerTitle: { fontSize: 17, fontWeight: "900", color: "#2D2D2D" },
  bannerSub: { fontSize: 13, color: "#AAA", marginTop: 2 },
  seccionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 12 },
  seccionTitulo: { fontSize: 17, fontWeight: "900", color: "#2D2D2D" },
  verTodos: { fontSize: 13, fontWeight: "700" },
  vacioCard: { marginHorizontal: 20, backgroundColor: "#fff", borderRadius: 16, padding: 24, alignItems: "center" },
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
