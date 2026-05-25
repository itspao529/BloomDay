import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import API from "../services/api";

export default function AlumnosScreen() {
  const [alumnos, setAlumnos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [tutor, setTutor] = useState("");
  const [editingAlumno, setEditingAlumno] = useState(null);

  useEffect(() => { cargarAlumnos(); }, []);
  const cargarAlumnos = async () => { try { const res = await API.get("/usuarios"); setAlumnos(res.data.filter(u => u.rol !== "admin" && u.rol !== "admin")); } catch (e) { console.log(e); } };
  const abrirModal = (item = null) => { setEditingAlumno(item); setNombre(item ? item.nombre : ""); setEdad(item ? String(item.edad || "") : ""); setTutor(item ? item.tutor || "" : ""); setModalVisible(true); };
  const guardar = async () => {
    if (!nombre.trim()) { Alert.alert("¡Ups!", "Escribe el nombre del alumno"); return; }
    try {
      if (editingAlumno) { await API.put(`/usuarios/${editingAlumno.id}`, { nombre, edad, tutor }); }
      else { await API.post("/usuarios", { nombre, edad, tutor, rol: "alumno" }); }
      setModalVisible(false); cargarAlumnos();
    } catch (e) { Alert.alert("Error", "No se pudo guardar"); }
  };
  const eliminar = (id) => {
    Alert.alert("¿Eliminar?", "¿Seguro?", [
      { text: "No", style: "cancel" },
      { text: "Sí", style: "destructive", onPress: async () => { try { await API.delete(`/usuarios/${id}`); cargarAlumnos(); } catch (e) {} } }
    ]);
  };

  const emojis = ["👧","👦","🧒","👶","🌟","🎨","🦋","⭐"];
  const colores = ["#FF6B9D","#4D96FF","#6BCB77","#FFD93D","#9B59B6"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.circle, styles.c1]} />
        <Text style={styles.titulo}>👧 Alumnos</Text>
        <Text style={styles.subtitulo}>Salón Kinder</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => abrirModal()}><Text style={styles.addBtnText}>＋</Text></TouchableOpacity>
      </View>
      <FlatList
        data={alumnos}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingTop: 16 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.alumnoCard} onPress={() => abrirModal(item)} onLongPress={() => eliminar(item.id)}>
            <View style={[styles.avatarBox, { backgroundColor: colores[index % colores.length] }]}><Text style={styles.avatarEmoji}>{emojis[index % emojis.length]}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.alumnoNombre}>{item.nombre}</Text>
              <Text style={styles.alumnoInfo}>{item.edad ? `${item.edad} años` : "Sin edad"}{item.tutor ? ` · ${item.tutor}` : ""}</Text>
            </View>
            <Text style={styles.idText}>#{String(item.id).padStart(3,"0")}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<View style={styles.vacioBox}><Text style={styles.vacioEmoji}>🏫</Text><Text style={styles.vacioText}>No hay alumnos registrados</Text></View>}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>{editingAlumno ? "✏️" : "🆕"}</Text>
            <Text style={styles.modalTitulo}>{editingAlumno ? "Editar Alumno" : "Nuevo Alumno"}</Text>
            {[{ icon: "👤", ph: "Nombre completo", val: nombre, set: setNombre }, { icon: "🎂", ph: "Edad", val: edad, set: setEdad, num: true }, { icon: "👨‍👩‍👧", ph: "Nombre del tutor", val: tutor, set: setTutor }].map((f, i) => (
              <View key={i} style={styles.inputBox}><Text style={styles.inputIcon}>{f.icon}</Text><TextInput style={styles.input} placeholder={f.ph} value={f.val} onChangeText={f.set} keyboardType={f.num ? "numeric" : "default"} placeholderTextColor="#BBB" /></View>
            ))}
            <TouchableOpacity style={styles.btnGuardar} onPress={guardar}><Text style={styles.btnGuardarText}>💾 Guardar</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}><Text style={styles.btnCancelarText}>Cancelar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBFF" },
  header: { backgroundColor: "#FF6B9D", borderBottomLeftRadius: 32, borderBottomRightRadius: 32, padding: 24, paddingTop: 56, paddingBottom: 28, overflow: "hidden" },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 150, height: 150, backgroundColor: "#ffffff20", top: -50, right: -30 },
  titulo: { fontSize: 28, fontWeight: "900", color: "#fff" },
  subtitulo: { fontSize: 13, color: "#ffffff99", marginTop: 2 },
  addBtn: { position: "absolute", top: 52, right: 24, backgroundColor: "#ffffff30", width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  addBtnText: { color: "#fff", fontSize: 26, fontWeight: "900" },
  alumnoCard: { backgroundColor: "#fff", borderRadius: 18, padding: 14, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  avatarBox: { width: 50, height: 50, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  avatarEmoji: { fontSize: 26 },
  alumnoNombre: { fontSize: 15, fontWeight: "800", color: "#2D2D2D" },
  alumnoInfo: { fontSize: 12, color: "#AAA", marginTop: 2 },
  idText: { fontSize: 12, color: "#CCC", fontWeight: "700" },
  vacioBox: { alignItems: "center", marginTop: 60 },
  vacioEmoji: { fontSize: 56, marginBottom: 12 },
  vacioText: { fontSize: 15, fontWeight: "600", color: "#AAA" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: { width: "90%", backgroundColor: "#FFFBFF", padding: 28, borderRadius: 28, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 },
  modalEmoji: { fontSize: 44, marginBottom: 8 },
  modalTitulo: { fontSize: 20, fontWeight: "900", color: "#2D2D2D", marginBottom: 16 },
  inputBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 12, borderWidth: 1.5, borderColor: "#F0F0F0", width: "100%" },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#2D2D2D", paddingVertical: 12 },
  btnGuardar: { width: "100%", backgroundColor: "#FF6B9D", borderRadius: 16, padding: 15, alignItems: "center", marginBottom: 10, shadowColor: "#FF6B9D", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  btnGuardarText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  btnCancelar: { width: "100%", backgroundColor: "#F8F8F8", borderRadius: 16, padding: 15, alignItems: "center" },
  btnCancelarText: { color: "#AAA", fontWeight: "700", fontSize: 15 },
});
