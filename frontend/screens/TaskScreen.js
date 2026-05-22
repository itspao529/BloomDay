import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, Alert,
} from "react-native";
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

  const cargarTareas = async () => {
    try {
      const res = await API.get("/tareas");
      setTareas(res.data);
    } catch (e) { console.log(e); }
  };

  const abrirModal = (item = null) => {
    setEditingTarea(item);
    setTitulo(item ? item.titulo : "");
    setModalVisible(true);
  };

  const guardar = async () => {
    if (!titulo.trim()) { Alert.alert("Error", "Escribe un título"); return; }
    try {
      if (editingTarea) {
        await API.put(`/tareas/${editingTarea.id}`, { ...editingTarea, titulo });
      } else {
        await API.post("/tareas", { titulo, estado: "pendiente", prioridad: "media" });
      }
      setModalVisible(false);
      cargarTareas();
    } catch (e) { Alert.alert("Error", "No se pudo guardar"); }
  };

  const toggleTarea = async (item) => {
    try {
      const nuevoEstado = item.estado === "completada" ? "pendiente" : "completada";
      await API.put(`/tareas/${item.id}`, { ...item, estado: nuevoEstado });
      cargarTareas();
    } catch (e) { console.log(e); }
  };

  const eliminar = async (id) => {
    try { await API.delete(`/tareas/${id}`); cargarTareas(); }
    catch (e) { Alert.alert("Error", "No se pudo eliminar"); }
  };

  const filtradas = tareas.filter(t => t.estado === filtro);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Tareas</Text>
          <Text style={styles.fecha}>{fechaTexto}</Text>
          <Text style={styles.semana}>Semana Actual</Text>
        </View>
        <TouchableOpacity onPress={() => abrirModal()}>
          <Text style={styles.addIcon}>＋</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtros}>
        <TouchableOpacity
          style={[styles.filtroBtn, filtro === "pendiente" && styles.filtroActivo]}
          onPress={() => setFiltro("pendiente")}
        >
          <Text style={[styles.filtroText, filtro === "pendiente" && styles.filtroTextActivo]}>Pendientes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filtroBtn, filtro === "completada" && styles.filtroActivo]}
          onPress={() => setFiltro("completada")}
        >
          <Text style={[styles.filtroText, filtro === "completada" && styles.filtroTextActivo]}>Entregadas</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.seccion}>{filtro === "pendiente" ? "Pendientes" : "Completadas"}</Text>

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tareaCard}
            onPress={() => toggleTarea(item)}
            onLongPress={() => abrirModal(item)}
          >
            <View style={[styles.dot, { backgroundColor: item.estado === "completada" ? "#7DBE7A" : "#E74C3C" }]} />
            <Text style={[styles.tareaTitulo, item.estado === "completada" && styles.tachado]}>
              {item.titulo}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.vacio}>No hay tareas {filtro === "pendiente" ? "pendientes" : "completadas"}</Text>}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>{editingTarea ? "Editar Tarea" : "Nueva Tarea"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Título de la tarea"
              value={titulo}
              onChangeText={setTitulo}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.btnGuardar} onPress={guardar}>
              <Text style={styles.btnGuardarText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}>
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6EFD6", padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 40, marginBottom: 20 },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#222" },
  fecha: { fontSize: 14, color: "#555" },
  semana: { fontSize: 13, color: "#777", marginTop: 2 },
  addIcon: { fontSize: 30, color: "#222" },
  filtros: { flexDirection: "row", gap: 10, marginBottom: 20 },
  filtroBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: "#D4C9A8", alignItems: "center" },
  filtroActivo: { backgroundColor: "#6B8F4E" },
  filtroText: { color: "#444", fontWeight: "bold" },
  filtroTextActivo: { color: "#fff" },
  seccion: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 12 },
  tareaCard: { backgroundColor: "#fff", borderRadius: 12, padding: 18, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: "#ddd" },
  dot: { width: 14, height: 14, borderRadius: 7 },
  tareaTitulo: { fontSize: 16, color: "#222", flex: 1 },
  tachado: { textDecorationLine: "line-through", color: "#888" },
  vacio: { textAlign: "center", color: "#888", marginTop: 30 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "90%", backgroundColor: "#F6EFD6", padding: 25, borderRadius: 16 },
  modalTitulo: { fontSize: 20, fontWeight: "bold", color: "#222", marginBottom: 15 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#ddd", fontSize: 15 },
  btnGuardar: { backgroundColor: "#7DBE7A", borderRadius: 8, padding: 14, alignItems: "center", marginTop: 5 },
  btnGuardarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  btnCancelar: { backgroundColor: "#ccc", borderRadius: 8, padding: 14, alignItems: "center", marginTop: 8 },
  btnCancelarText: { color: "#333", fontWeight: "bold", fontSize: 16 },
});
