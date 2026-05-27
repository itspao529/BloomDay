import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function ProfileScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [miHijo, setMiHijo] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [totalEventos, setTotalEventos] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      const u = await AsyncStorage.getItem("user");
      if (!u) { setCargando(false); return; }
      const parsed = JSON.parse(u);
      setUsuario(parsed);
      const resTareas = await API.get("/tareas");
      setTareas(resTareas.data);
      if (parsed.rol === "usuario") {
        const resHijo = await API.get("/estudiantes/mi-hijo");
        if (resHijo.data.length > 0) setMiHijo(resHijo.data[0]);
      } else {
        const resAlumnos = await API.get("/estudiantes");
        setTotalAlumnos(resAlumnos.data.length);
        const resEventos = await API.get("/eventos");
        setTotalEventos(resEventos.data.length);
      }
    } catch (e) { console.log(e); }
    finally { setCargando(false); }
  };

  const cerrarSesion = async () => {
    Alert.alert("¿Salir?", "¿Seguro que quieres cerrar sesión?", [
      { text: "Quedarme", style: "cancel" },
      { text: "Salir 👋", style: "destructive", onPress: async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        navigation.replace("Login");
      }}
    ]);
  };

  if (cargando) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFBFF", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF6B9D" />
        <Text style={{ marginTop: 12, color: "#AAA", fontWeight: "600" }}>Cargando perfil...</Text>
      </View>
    );
  }

  const esAdmin = usuario?.rol === "admin";
  const iniciales = usuario?.nombre
    ? usuario.nombre.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "??";
  const tareasPendientes = tareas.filter(t => t.estado === "pendiente").length;
  const tareasCompletadas = tareas.filter(t => t.estado === "completada").length;
  const tareasEnProgreso = tareas.filter(t => t.estado === "en_progreso").length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: esAdmin ? "#FF6B9D" : "#6BCB77" }]}>
        <View style={[styles.circle, styles.c1]} />
        <View style={[styles.circle, styles.c2]} />
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>{iniciales}</Text>
        </View>
        <Text style={styles.nombre}>{usuario?.nombre || "Usuario"}</Text>
        <View style={styles.rolPill}>
          <Text style={styles.rolPillText}>{esAdmin ? "👩‍🏫 Maestra" : "👨‍👩‍👧 Papá / Mamá"}</Text>
        </View>
        <Text style={styles.emailText}>{usuario?.email}</Text>
      </View>

      {/* ===== VISTA PAPÁ/MAMÁ ===== */}
      {!esAdmin && (
        <>
          {miHijo ? (
            <>
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
                <View style={styles.statsRow}>
                  <View style={[styles.statBox, { backgroundColor: "#6BCB7715" }]}>
                    <Text style={[styles.statNum, { color: "#6BCB77" }]}>{tareasCompletadas}</Text>
                    <Text style={styles.statLabel}>✅ Entregadas</Text>
                  </View>
                  <View style={[styles.statBox, { backgroundColor: "#FF6B9D15" }]}>
                    <Text style={[styles.statNum, { color: "#FF6B9D" }]}>{tareasPendientes}</Text>
                    <Text style={styles.statLabel}>⏳ Pendientes</Text>
                  </View>
                  <View style={[styles.statBox, { backgroundColor: "#FFD93D15" }]}>
                    <Text style={[styles.statNum, { color: "#E6A817" }]}>{tareasEnProgreso}</Text>
                    <Text style={styles.statLabel}>🔄 En curso</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.seccionTitulo}>📋 Actividades de {miHijo.nombre}</Text>
              {tareas.length === 0 ? (
                <View style={styles.vacioCard}>
                  <Text style={styles.vacioEmoji}>📭</Text>
                  <Text style={styles.vacioText}>No hay actividades todavía</Text>
                </View>
              ) : (
                tareas.slice(0, 6).map((tarea, i) => (
                  <View key={i} style={styles.tareaRow}>
                    <View style={[styles.tareaIconBox, {
                      backgroundColor: tarea.estado === "completada" ? "#6BCB7720"
                        : tarea.estado === "en_progreso" ? "#FFD93D20" : "#FF6B9D20"
                    }]}>
                      <Text style={styles.tareaEmoji}>
                        {tarea.estado === "completada" ? "✅" : tarea.estado === "en_progreso" ? "🔄" : "⏳"}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.tareaTitulo}>{tarea.titulo}</Text>
                      <Text style={[styles.tareaEstado, {
                        color: tarea.estado === "completada" ? "#6BCB77"
                          : tarea.estado === "en_progreso" ? "#E6A817" : "#FF6B9D"
                      }]}>
                        {tarea.estado === "completada" ? "Entregada" : tarea.estado === "en_progreso" ? "En progreso" : "Pendiente"}
                      </Text>
                    </View>
                  </View>
                ))
              )}
              {tareas.length > 6 && (
                <TouchableOpacity onPress={() => navigation.navigate("Tareas")} style={styles.verMasBtn}>
                  <Text style={styles.verMasText}>Ver todas las actividades →</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.sinHijoCard}>
              <Text style={styles.sinHijoEmoji}>🏫</Text>
              <Text style={styles.sinHijoText}>Tu hijo aún no está vinculado</Text>
              <Text style={styles.sinHijoSub}>Contacta a la maestra para que lo registre en el sistema</Text>
            </View>
          )}

          <View style={styles.opcionesCard}>
            <Text style={styles.opcionesTitle}>Acceso rápido</Text>
            {[
              { emoji: "🎉", label: "Eventos del Salón", screen: "Events" },
              { emoji: "🔔", label: "Notificaciones", screen: "Notifications" },
              { emoji: "📅", label: "Calendario", screen: "Calendar" },
            ].map((item, i, arr) => (
              <View key={i}>
                <TouchableOpacity style={styles.opcionRow} onPress={() => navigation.navigate(item.screen)}>
                  <View style={styles.opcionIconBox}><Text style={styles.opcionEmoji}>{item.emoji}</Text></View>
                  <Text style={styles.opcionText}>{item.label}</Text>
                  <Text style={styles.opcionArrow}>›</Text>
                </TouchableOpacity>
                {i < arr.length - 1 && <View style={styles.sep} />}
              </View>
            ))}
          </View>
        </>
      )}

      {/* ===== VISTA MAESTRA ===== */}
      {esAdmin && (
        <>
          <View style={styles.maestraStatsCard}>
            <Text style={styles.maestraTitle}>📊 Resumen del Salón</Text>
            <View style={styles.statsRow}>
              <TouchableOpacity style={[styles.statBox, { backgroundColor: "#FF6B9D15" }]} onPress={() => navigation.navigate("Alumnos")}>
                <Text style={[styles.statNum, { color: "#FF6B9D" }]}>{totalAlumnos}</Text>
                <Text style={styles.statLabel}>👧 Alumnos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.statBox, { backgroundColor: "#4D96FF15" }]} onPress={() => navigation.navigate("Events")}>
                <Text style={[styles.statNum, { color: "#4D96FF" }]}>{totalEventos}</Text>
                <Text style={styles.statLabel}>🎉 Eventos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.statBox, { backgroundColor: "#6BCB7715" }]} onPress={() => navigation.navigate("Tareas")}>
                <Text style={[styles.statNum, { color: "#6BCB77" }]}>{tareas.length}</Text>
                <Text style={styles.statLabel}>📋 Tareas</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actividadesResumenCard}>
            <Text style={styles.maestraTitle}>📋 Estado de Actividades</Text>
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: "#6BCB7720" }]}>
                <Text style={[styles.statNum, { color: "#6BCB77" }]}>{tareasCompletadas}</Text>
                <Text style={styles.statLabel}>✅ Entregadas</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: "#FF6B9D20" }]}>
                <Text style={[styles.statNum, { color: "#FF6B9D" }]}>{tareasPendientes}</Text>
                <Text style={styles.statLabel}>⏳ Pendientes</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: "#FFD93D20" }]}>
                <Text style={[styles.statNum, { color: "#E6A817" }]}>{tareasEnProgreso}</Text>
                <Text style={styles.statLabel}>🔄 En curso</Text>
              </View>
            </View>
          </View>

          <View style={styles.opcionesCard}>
            <Text style={styles.opcionesTitle}>Gestión del Salón</Text>
            {[
              { emoji: "👧", label: "Ver Alumnos", screen: "Alumnos" },
              { emoji: "✅", label: "Tomar Asistencia", screen: "Asistencia" },
              { emoji: "📖", label: "Materias", screen: "Materias" },
              { emoji: "⭐", label: "Calificaciones", screen: "Calificaciones" },
              { emoji: "🖼️", label: "Galería del Salón", screen: "Galeria" },
              { emoji: "📅", label: "Calendario", screen: "Calendar" },
              { emoji: "🔔", label: "Notificaciones", screen: "Notifications" },
            ].map((item, i, arr) => (
              <View key={i}>
                <TouchableOpacity style={styles.opcionRow} onPress={() => navigation.navigate(item.screen)}>
                  <View style={styles.opcionIconBox}><Text style={styles.opcionEmoji}>{item.emoji}</Text></View>
                  <Text style={styles.opcionText}>{item.label}</Text>
                  <Text style={styles.opcionArrow}>›</Text>
                </TouchableOpacity>
                {i < arr.length - 1 && <View style={styles.sep} />}
              </View>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity style={[styles.cerrarBtn, { borderColor: esAdmin ? "#FF6B9D" : "#6BCB77" }]} onPress={cerrarSesion}>
        <Text style={styles.cerrarEmoji}>🚪</Text>
        <Text style={[styles.cerrarText, { color: esAdmin ? "#FF6B9D" : "#6BCB77" }]}>Cerrar Sesión</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBFF" },
  header: { borderBottomLeftRadius: 32, borderBottomRightRadius: 32, padding: 24, paddingTop: 56, paddingBottom: 32, alignItems: "center", overflow: "hidden" },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 180, height: 180, backgroundColor: "#ffffff20", top: -60, right: -40 },
  c2: { width: 120, height: 120, backgroundColor: "#ffffff15", bottom: -30, left: 20 },
  avatarBox: { width: 90, height: 90, borderRadius: 30, backgroundColor: "#ffffff30", justifyContent: "center", alignItems: "center", marginBottom: 12, borderWidth: 3, borderColor: "#ffffff50" },
  avatarText: { fontSize: 36, fontWeight: "900", color: "#fff" },
  nombre: { fontSize: 22, fontWeight: "900", color: "#fff", marginBottom: 8 },
  rolPill: { backgroundColor: "#ffffff30", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 6 },
  rolPillText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  emailText: { color: "#ffffff80", fontSize: 12, fontWeight: "600" },
  hijoCard: { margin: 20, marginBottom: 16, backgroundColor: "#fff", borderRadius: 22, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  hijoHeader: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 },
  hijoAvatarBox: { width: 60, height: 60, borderRadius: 20, backgroundColor: "#6BCB7720", justifyContent: "center", alignItems: "center" },
  hijoAvatarEmoji: { fontSize: 32 },
  hijoLabel: { fontSize: 10, color: "#AAA", fontWeight: "800", letterSpacing: 1 },
  hijoNombre: { fontSize: 20, fontWeight: "900", color: "#2D2D2D", marginTop: 2 },
  hijoInfo: { fontSize: 12, color: "#AAA", marginTop: 3 },
  statsRow: { flexDirection: "row", gap: 10 },
  statBox: { flex: 1, borderRadius: 14, padding: 12, alignItems: "center" },
  statNum: { fontSize: 24, fontWeight: "900" },
  statLabel: { fontSize: 10, fontWeight: "700", color: "#888", marginTop: 2, textAlign: "center" },
  seccionTitulo: { fontSize: 16, fontWeight: "900", color: "#2D2D2D", paddingHorizontal: 20, marginBottom: 12 },
  vacioCard: { marginHorizontal: 20, backgroundColor: "#fff", borderRadius: 18, padding: 24, alignItems: "center", marginBottom: 16 },
  vacioEmoji: { fontSize: 40, marginBottom: 8 },
  vacioText: { color: "#AAA", fontSize: 14, fontWeight: "600" },
  tareaRow: { marginHorizontal: 20, backgroundColor: "#fff", borderRadius: 14, padding: 14, marginBottom: 8, flexDirection: "row", alignItems: "center", gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  tareaIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  tareaEmoji: { fontSize: 20 },
  tareaTitulo: { fontSize: 14, fontWeight: "700", color: "#2D2D2D" },
  tareaEstado: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  verMasBtn: { alignItems: "center", marginVertical: 8 },
  verMasText: { color: "#6BCB77", fontWeight: "700", fontSize: 14 },
  sinHijoCard: { margin: 20, backgroundColor: "#fff", borderRadius: 22, padding: 28, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  sinHijoEmoji: { fontSize: 52, marginBottom: 12 },
  sinHijoText: { fontSize: 17, fontWeight: "800", color: "#2D2D2D", marginBottom: 6 },
  sinHijoSub: { fontSize: 13, color: "#AAA", textAlign: "center", lineHeight: 20 },
  maestraStatsCard: { margin: 20, marginBottom: 12, backgroundColor: "#fff", borderRadius: 22, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  actividadesResumenCard: { marginHorizontal: 20, marginBottom: 12, backgroundColor: "#fff", borderRadius: 22, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  maestraTitle: { fontSize: 15, fontWeight: "900", color: "#2D2D2D", marginBottom: 14 },
  opcionesCard: { marginHorizontal: 20, marginBottom: 14, backgroundColor: "#fff", borderRadius: 22, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  opcionesTitle: { fontSize: 13, fontWeight: "800", color: "#AAA", marginBottom: 14, letterSpacing: 0.5 },
  opcionRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 6 },
  opcionIconBox: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#F8F8F8", justifyContent: "center", alignItems: "center" },
  opcionEmoji: { fontSize: 20 },
  opcionText: { flex: 1, fontSize: 14, color: "#2D2D2D", fontWeight: "600" },
  opcionArrow: { fontSize: 22, color: "#CCC" },
  sep: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 6 },
  cerrarBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginHorizontal: 20, padding: 16, backgroundColor: "#fff", borderRadius: 18, borderWidth: 2 },
  cerrarEmoji: { fontSize: 20 },
  cerrarText: { fontSize: 15, fontWeight: "900" },
});
