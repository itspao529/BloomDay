import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, Alert } from "react-native";
import { useState, useEffect } from "react";
import API from "../services/api";

export default function TaskScreen() {
  const [tareas, setTareas] = useState([]);
  const [filtro, setFiltro] = useState("pendiente");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTarea, setEditingTarea] = useState(null);
  const [titulo, setTitulo] = useState("");
  const fecha_hoy = new Date();
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const fechaTexto = `${fecha_hoy.getDate()} de ${meses[fecha_hoy.getMonth()]}`;

  useEffect(() => { cargarTareas(); }, []);
  const cargarTareas = async () => { try { const res = await API.get("/tareas"); setTareas(res.data); } catch (e) { console.log(e); } };
  const abrirModal = (item = null) => { setEditingTarea(item); setTitulo(item ? item.titulo : ""); setModalVisible(true); };
  const guardar = async () => {
    if (!titulo.trim()) { Alert.alert("¡Ups!", "Escribe el nombre de la actividad 📝"); return; }
    try {
      if (editingTarea) { await API.put(`/tareas/${editingTarea.id}`, { ...editingTarea, titulo }); }
      else { await API.post("/tareas", { titulo, estado: "pendiente", prioridad: "media" }); }
      setModalVisible(false); cargarTareas();
    } catch (e) { Alert.alert("¡Ups!", "No se pudo guardar"); }
  };
  const toggleTarea = async (item) => {
    try { await API.put(`/tareas/${item.id}`, { ...item, estado: item.estado === "completada" ? "pendiente" : "completada" }); cargarTareas(); }
    catch (e) { console.log(e); }
  };
  const eliminar = (id) => {
    Alert.alert("¿Eliminar?", "¿Borrar esta actividad?", [
      { text: "No", style: "cancel" },
      { text: "Sí", style: "destructive", onPress: async () => { try { await API.delete(`/tareas/${id}`); cargarTareas(); } catch (e) {} } }
    ]);
  };

  const filtradas = tareas.filter(t => t.estado === filtro);
  const emojisCard = ["🎨","✏️","📚","🔢","🎵","🌍","🧩","⭐"];
  const colores = ["#FF6B9D15","#4D96FF15","#6BCB7715","#FFD93D15","#9B59B615"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.circle, styles.c1]} />
        <Text style={styles.titulo}>📋 Actividades</Text>
        <Text style={styles.fecha}>{fechaTexto}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => abrirModal()}>
          <Text style={styles.addBtnText}>＋</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filtros}>
        {[{ label: "🕐 Pendientes", value: "pendiente" }, { label: "⭐ Entregadas", value: "completada" }].map(f => (
          <TouchableOpacity key={f.value} style={[styles.filtroBtn, filtro === f.value && styles.filtroActivo]} onPress={() => setFiltro(f.value)}>
            <Text style={[styles.filtroText, filtro === f.value && styles.filtroTextActivo]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={[styles.tareaCard, { backgroundColor: colores[index % colores.length] }]} onPress={() => toggleTarea(item)} onLongPress={() => abrirModal(item)}>
            <View style={[styles.emojiBox, { backgroundColor: item.estado === "completada" ? "#6BCB7730" : "#FF6B9D20" }]}>
              <Text style={styles.tareaEmoji}>{item.estado === "completada" ? "✅" : emojisCard[index % emojisCard.length]}</Text>
            </View>
            <Text style={[styles.tareaTitulo, item.estado === "completada" && styles.tachado]}>{item.titulo}</Text>
            <TouchableOpacity onPress={() => eliminar(item.id)}><Text style={styles.trashIcon}>🗑️</Text></TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<View style={styles.vacioBox}><Text style={styles.vacioEmoji}>{filtro === "pendiente" ? "🎉" : "📭"}</Text><Text style={styles.vacioText}>{filtro === "pendiente" ? "¡No hay actividades pendientes!" : "Aún no hay entregadas"}</Text></View>}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>{editingTarea ? "✏️" : "🆕"}</Text>
            <Text style={styles.modalTitulo}>{editingTarea ? "Editar Actividad" : "Nueva Actividad"}</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputIcon}>📝</Text>
              <TextInput style={styles.input} placeholder="Nombre de la actividad..." value={titulo} onChangeText={setTitulo} placeholderTextColor="#BBB" />
            </View>
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
  fecha: { fontSize: 13, color: "#ffffff99", marginTop: 2 },
  addBtn: { position: "absolute", top: 52, right: 24, backgroundColor: "#ffffff30", width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  addBtnText: { color: "#fff", fontSize: 26, fontWeight: "900" },
  filtros: { flexDirection: "row", gap: 12, padding: 20, paddingBottom: 12 },
  filtroBtn: { flex: 1, paddingVertical: 10, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  filtroActivo: { backgroundColor: "#FF6B9D" },
  filtroText: { color: "#AAA", fontWeight: "700", fontSize: 13 },
  filtroTextActivo: { color: "#fff" },
  tareaCard: { borderRadius: 18, padding: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  emojiBox: { width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  tareaEmoji: { fontSize: 22 },
  tareaTitulo: { fontSize: 15, color: "#2D2D2D", flex: 1, fontWeight: "600" },
  tachado: { textDecorationLine: "line-through", color: "#CCC" },
  trashIcon: { fontSize: 18 },
  vacioBox: { alignItems: "center", marginTop: 60 },
  vacioEmoji: { fontSize: 56, marginBottom: 12 },
  vacioText: { color: "#AAA", fontSize: 15, fontWeight: "600", textAlign: "center" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: { width: "90%", backgroundColor: "#FFFBFF", padding: 28, borderRadius: 28, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 },
  modalEmoji: { fontSize: 44, marginBottom: 8 },
  modalTitulo: { fontSize: 20, fontWeight: "900", color: "#2D2D2D", marginBottom: 20 },
  inputBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 16, borderWidth: 1.5, borderColor: "#F0F0F0", width: "100%" },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#2D2D2D", paddingVertical: 12 },
  btnGuardar: { width: "100%", backgroundColor: "#FF6B9D", borderRadius: 16, padding: 15, alignItems: "center", marginBottom: 10, shadowColor: "#FF6B9D", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  btnGuardarText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  btnCancelar: { width: "100%", backgroundColor: "#F8F8F8", borderRadius: 16, padding: 15, alignItems: "center" },
  btnCancelarText: { color: "#AAA", fontWeight: "700", fontSize: 15 },
});
