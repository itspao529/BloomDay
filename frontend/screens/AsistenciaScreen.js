import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import API from "../services/api";

export default function AsistenciaScreen() {
  const [alumnos, setAlumnos] = useState([]);
  const [asistencia, setAsistencia] = useState({});
  const fecha = new Date();
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const fechaTexto = `${fecha.getDate()} de ${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;

  useEffect(() => { cargarAlumnos(); }, []);
  const cargarAlumnos = async () => {
    try {
      const res = await API.get("/usuarios");
      const soloAlumnos = res.data.filter(u => u.rol !== "admin" && u.rol !== "admin");
      setAlumnos(soloAlumnos);
      const inicial = {};
      soloAlumnos.forEach(a => { inicial[a.id] = "presente"; });
      setAsistencia(inicial);
    } catch (e) { console.log(e); }
  };
  const toggleAsistencia = (id) => { setAsistencia(prev => ({ ...prev, [id]: prev[id] === "presente" ? "ausente" : prev[id] === "ausente" ? "tardanza" : "presente" })); };
  const guardarAsistencia = () => { Alert.alert("✅ Guardado", `Asistencia del ${fechaTexto} guardada.`); };

  const estadoConfig = {
    presente: { emoji: "✅", label: "Presente", color: "#6BCB77", bg: "#6BCB7720" },
    ausente:  { emoji: "❌", label: "Ausente",  color: "#FF6B9D", bg: "#FF6B9D20" },
    tardanza: { emoji: "⏰", label: "Tardanza", color: "#FFD93D", bg: "#FFD93D20" },
  };
  const presentes = Object.values(asistencia).filter(v => v === "presente").length;
  const ausentes  = Object.values(asistencia).filter(v => v === "ausente").length;
  const tardanzas = Object.values(asistencia).filter(v => v === "tardanza").length;
  const emojis = ["👧","👦","🧒","👶","🌟","🎨","🦋","⭐"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.circle, styles.c1]} />
        <Text style={styles.titulo}>✅ Asistencia</Text>
        <Text style={styles.subtitulo}>{fechaTexto}</Text>
      </View>
      <View style={styles.resumen}>
        {[{ num: presentes, label: "Presentes", color: "#6BCB77", emoji: "✅" }, { num: ausentes, label: "Ausentes", color: "#FF6B9D", emoji: "❌" }, { num: tardanzas, label: "Tardanzas", color: "#FFD93D", emoji: "⏰" }].map((item, i) => (
          <View key={i} style={[styles.resumenCard, { backgroundColor: item.color + "20", borderColor: item.color }]}>
            <Text style={styles.resumenEmoji}>{item.emoji}</Text>
            <Text style={[styles.resumenNum, { color: item.color }]}>{item.num}</Text>
            <Text style={styles.resumenLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.hint}>Toca para cambiar el estado</Text>
      <FlatList
        data={alumnos}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        renderItem={({ item, index }) => {
          const estado = asistencia[item.id] || "presente";
          const config = estadoConfig[estado];
          return (
            <TouchableOpacity style={[styles.alumnoCard, { backgroundColor: config.bg, borderColor: config.color }]} onPress={() => toggleAsistencia(item.id)}>
              <Text style={styles.alumnoEmoji}>{emojis[index % emojis.length]}</Text>
              <Text style={styles.alumnoNombre}>{item.nombre}</Text>
              <View style={[styles.estadoBadge, { backgroundColor: config.color }]}>
                <Text style={styles.estadoEmoji}>{config.emoji}</Text>
                <Text style={styles.estadoLabel}>{config.label}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<View style={styles.vacioBox}><Text style={styles.vacioEmoji}>🏫</Text><Text style={styles.vacioText}>No hay alumnos registrados</Text></View>}
      />
      <TouchableOpacity style={styles.guardarBtn} onPress={guardarAsistencia}>
        <Text style={styles.guardarBtnText}>💾 Guardar Asistencia</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBFF" },
  header: { backgroundColor: "#6BCB77", borderBottomLeftRadius: 32, borderBottomRightRadius: 32, padding: 24, paddingTop: 56, paddingBottom: 28, overflow: "hidden" },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 150, height: 150, backgroundColor: "#ffffff20", top: -50, right: -30 },
  titulo: { fontSize: 28, fontWeight: "900", color: "#fff" },
  subtitulo: { fontSize: 13, color: "#ffffff99", marginTop: 2 },
  resumen: { flexDirection: "row", gap: 12, padding: 20, paddingBottom: 8 },
  resumenCard: { flex: 1, borderRadius: 18, padding: 12, alignItems: "center", borderWidth: 2 },
  resumenEmoji: { fontSize: 22, marginBottom: 4 },
  resumenNum: { fontSize: 28, fontWeight: "900" },
  resumenLabel: { fontSize: 11, fontWeight: "700", color: "#888", marginTop: 2 },
  hint: { fontSize: 12, color: "#AAA", fontWeight: "600", textAlign: "center", marginBottom: 12 },
  alumnoCard: { borderRadius: 18, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 2 },
  alumnoEmoji: { fontSize: 26 },
  alumnoNombre: { flex: 1, fontSize: 15, fontWeight: "800", color: "#2D2D2D" },
  estadoBadge: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  estadoEmoji: { fontSize: 13 },
  estadoLabel: { fontSize: 12, fontWeight: "700", color: "#fff" },
  vacioBox: { alignItems: "center", marginTop: 60 },
  vacioEmoji: { fontSize: 56, marginBottom: 12 },
  vacioText: { fontSize: 15, fontWeight: "600", color: "#AAA" },
  guardarBtn: { position: "absolute", bottom: 24, left: 20, right: 20, backgroundColor: "#6BCB77", borderRadius: 18, padding: 16, alignItems: "center", shadowColor: "#6BCB77", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  guardarBtnText: { color: "#fff", fontWeight: "900", fontSize: 16 },
});
