import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import API from "../services/api";

const materias = ["Matemáticas 🔢","Lenguaje 📚","Arte 🎨","Música 🎵","Ciencias 🔬","Ed. Física ⚽"];
const colores = ["#FF6B9D","#4D96FF","#6BCB77","#FFD93D","#9B59B6","#E67E22"];
const emojis = ["👧","👦","🧒","👶","🌟","🎨","🦋","⭐"];

export default function CalificacionesScreen() {
  const [alumnos, setAlumnos] = useState([]);
  const [calificaciones, setCalificaciones] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [alumnoSel, setAlumnoSel] = useState(null);
  const [materiaSel, setMateriaSel] = useState("");
  const [nota, setNota] = useState("");

  useEffect(() => { cargarAlumnos(); }, []);
  const cargarAlumnos = async () => { try { const res = await API.get("/usuarios"); setAlumnos(res.data.filter(u => u.rol !== "admin" && u.rol !== "maestro")); } catch (e) { console.log(e); } };
  const abrirModal = (alumno, materia) => { setAlumnoSel(alumno); setMateriaSel(materia); setNota(calificaciones[`${alumno.id}-${materia}`] || ""); setModalVisible(true); };
  const guardarNota = () => {
    const n = parseFloat(nota);
    if (isNaN(n) || n < 0 || n > 10) { Alert.alert("¡Ups!", "Ingresa una nota entre 0 y 10"); return; }
    setCalificaciones(prev => ({ ...prev, [`${alumnoSel.id}-${materiaSel}`]: nota }));
    setModalVisible(false);
  };
  const getColor = (nota) => { if (!nota) return "#F8F8F8"; const n = parseFloat(nota); if (n >= 8) return "#6BCB7720"; if (n >= 6) return "#FFD93D20"; return "#FF6B9D20"; };
  const getTextColor = (nota) => { if (!nota) return "#CCC"; const n = parseFloat(nota); if (n >= 8) return "#6BCB77"; if (n >= 6) return "#E6A817"; return "#FF6B9D"; };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.circle, styles.c1]} />
        <Text style={styles.titulo}>⭐ Calificaciones</Text>
        <Text style={styles.subtitulo}>Salón Kinder</Text>
      </View>
      <FlatList
        data={alumnos}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingTop: 16 }}
        renderItem={({ item, index }) => (
          <View style={styles.alumnoSection}>
            <View style={styles.alumnoHeader}>
              <View style={[styles.alumnoAvatar, { backgroundColor: colores[index % colores.length] }]}><Text style={styles.alumnoEmoji}>{emojis[index % emojis.length]}</Text></View>
              <Text style={styles.alumnoNombre}>{item.nombre}</Text>
            </View>
            <View style={styles.materiasGrid}>
              {materias.map(materia => {
                const notaVal = calificaciones[`${item.id}-${materia}`];
                return (
                  <TouchableOpacity key={materia} style={[styles.materiaBtn, { backgroundColor: getColor(notaVal) }]} onPress={() => abrirModal(item, materia)}>
                    <Text style={styles.materiaBtnLabel}>{materia}</Text>
                    <Text style={[styles.materiaBtnNota, { color: getTextColor(notaVal) }]}>{notaVal || "—"}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
        ListEmptyComponent={<View style={styles.vacioBox}><Text style={styles.vacioEmoji}>📋</Text><Text style={styles.vacioText}>No hay alumnos registrados</Text></View>}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>⭐</Text>
            <Text style={styles.modalTitulo}>Calificación</Text>
            <Text style={styles.modalSub}>{alumnoSel?.nombre}</Text>
            <Text style={styles.modalMateria}>{materiaSel}</Text>
            <View style={styles.inputBox}><Text style={styles.inputIcon}>📝</Text><TextInput style={styles.input} placeholder="Nota (0 - 10)" value={nota} onChangeText={setNota} keyboardType="decimal-pad" placeholderTextColor="#BBB" /></View>
            <TouchableOpacity style={styles.btnGuardar} onPress={guardarNota}><Text style={styles.btnGuardarText}>💾 Guardar Nota</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}><Text style={styles.btnCancelarText}>Cancelar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBFF" },
  header: { backgroundColor: "#FFD93D", borderBottomLeftRadius: 32, borderBottomRightRadius: 32, padding: 24, paddingTop: 56, paddingBottom: 28, overflow: "hidden" },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 150, height: 150, backgroundColor: "#ffffff30", top: -50, right: -30 },
  titulo: { fontSize: 28, fontWeight: "900", color: "#2D2D2D" },
  subtitulo: { fontSize: 13, color: "#2D2D2D99", marginTop: 2 },
  alumnoSection: { backgroundColor: "#fff", borderRadius: 22, padding: 16, marginBottom: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  alumnoHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  alumnoAvatar: { width: 40, height: 40, borderRadius: 13, justifyContent: "center", alignItems: "center" },
  alumnoEmoji: { fontSize: 22 },
  alumnoNombre: { fontSize: 16, fontWeight: "900", color: "#2D2D2D" },
  materiasGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  materiaBtn: { borderRadius: 12, padding: 10, minWidth: "30%", alignItems: "center", flex: 1 },
  materiaBtnLabel: { fontSize: 11, fontWeight: "700", color: "#888", textAlign: "center" },
  materiaBtnNota: { fontSize: 20, fontWeight: "900", marginTop: 4 },
  vacioBox: { alignItems: "center", marginTop: 60 },
  vacioEmoji: { fontSize: 56, marginBottom: 12 },
  vacioText: { fontSize: 15, fontWeight: "600", color: "#AAA" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: { width: "90%", backgroundColor: "#FFFBFF", padding: 28, borderRadius: 28, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 },
  modalEmoji: { fontSize: 44, marginBottom: 6 },
  modalTitulo: { fontSize: 20, fontWeight: "900", color: "#2D2D2D" },
  modalSub: { fontSize: 14, color: "#AAA", fontWeight: "700", marginTop: 4 },
  modalMateria: { fontSize: 13, color: "#FF6B9D", fontWeight: "700", marginBottom: 16, marginTop: 2 },
  inputBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 16, borderWidth: 1.5, borderColor: "#F0F0F0", width: "100%" },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 22, color: "#2D2D2D", paddingVertical: 12, fontWeight: "900", textAlign: "center" },
  btnGuardar: { width: "100%", backgroundColor: "#FFD93D", borderRadius: 16, padding: 15, alignItems: "center", marginBottom: 10, shadowColor: "#FFD93D", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  btnGuardarText: { color: "#2D2D2D", fontWeight: "900", fontSize: 16 },
  btnCancelar: { width: "100%", backgroundColor: "#F8F8F8", borderRadius: 16, padding: 15, alignItems: "center" },
  btnCancelarText: { color: "#AAA", fontWeight: "700", fontSize: 15 },
});
