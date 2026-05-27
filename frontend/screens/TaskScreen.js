import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, Alert } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function TaskScreen() {
  const [tareas, setTareas] = useState([]);
  const [filtro, setFiltro] = useState("pendiente");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTarea, setEditingTarea] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [usuario, setUsuario] = useState(null);

  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const fechaTexto = `${new Date().getDate()} de ${meses[new Date().getMonth()]}`;

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      const u = await AsyncStorage.getItem("user");
      if (u) setUsuario(JSON.parse(u));
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
    if (!titulo.trim()) { Alert.alert("¡Ups!", "Escribe el nombre 📝"); return; }
    try {
      if (editingTarea) {
        await API.put(`/tareas/${editingTarea.id}`, { ...editingTarea, titulo });
      } else {
        await API.post("/tareas", { titulo, estado: "pendiente", prioridad: "media" });
      }
      setModalVisible(false);
      cargarDatos();
    } catch (e) { Alert.alert("¡Ups!", "No se pudo guardar"); }
  };

  const toggleTarea = async (item) => {
    if (esAdmin) {
      try {
        await API.put(`/tareas/${item.id}`, { ...item, estado: item.estado === "completada" ? "pendiente" : "completada" });
        cargarDatos();
      } catch (e) { console.log(e); }
    }
  };

  const eliminar = async (id) => {
    Alert.alert("¿Eliminar?", "¿Seguro?", [
      { text: "No", style: "cancel" },
      { text: "Sí", style: "destructive", onPress: async () => {
        try { await API.delete(`/tareas/${id}`); cargarDatos(); }
        catch (e) { Alert.alert("Error", "No se pudo eliminar"); }
      }}
    ]);
  };

  const esAdmin = usuario?.rol === "admin";
  const filtradas = tareas.filter(t => t.estado === filtro);
  const emojisCard = ["🎨","✏️","📚","🔢","🎵","🌍","🧩","⭐"];
  const colores = ["#FF6B9D15","#4D96FF15","#6BCB7715","#FFD93D15","#9B59B615"];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: esAdmin ? "#FF6B9D" : "#6BCB77" }]}>
        <View style={[styles.circle, styles.c1]} />
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.titulo}>📋 {esAdmin ? "Actividades" : "Actividades de Mi Hijo"}</Text>
            <Text style={styles.fecha}>{fechaTexto}</Text>
          </View>
          {esAdmin && (
            <TouchableOpacity style={styles.addBtn} onPress={() => abrirModal()}>
              <Text style={styles.addBtnText}>＋</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filtros}>
        <TouchableOpacity style={[styles.filtroBtn, filtro === "pendiente" && { backgroundColor: esAdmin ? "#FF6B9D" : "#6BCB77" }]} onPress={() => setFiltro("pendiente")}>
          <Text style={[styles.filtroText, filtro === "pendiente" && styles.filtroTextActivo]}>⏳ Pendientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filtroBtn, filtro === "en_progreso" && { backgroundColor: esAdmin ? "#FF6B9D" : "#6BCB77" }]} onPress={() => setFiltro("en_progreso")}>
          <Text style={[styles.filtroText, filtro === "en_progreso" && styles.filtroTextActivo]}>🔄 En progreso</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filtroBtn, filtro === "completada" && { backgroundColor: esAdmin ? "#FF6B9D" : "#6BCB77" }]} onPress={() => setFiltro("completada")}>
          <Text style={[styles.filtroText, filtro === "completada" && styles.filtroTextActivo]}>✅ Entregadas</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.tareaCard, { backgroundColor: colores[index % colores.length] }]}
            onPress={() => esAdmin && toggleTarea(item)}
            onLongPress={() => esAdmin && abrirModal(item)}
          >
            <View style={[styles.emojiBox, {
              backgroundColor: item.estado === "completada" ? "#6BCB7730"
                : item.estado === "en_progreso" ? "#FFD93D30" : "#FF6B9D20"
            }]}>
              <Text style={styles.tareaEmoji}>
                {item.estado === "completada" ? "✅" : item.estado === "en_progreso" ? "🔄" : emojisCard[index % emojisCard.length]}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tareaTitulo, item.estado === "completada" && styles.tachado]}>
                {item.titulo}
              </Text>
              {item.creado_por_nombre && (
                <Text style={styles.creadoPor}>👩‍🏫 {item.creado_por_nombre}</Text>
              )}
            </View>
            {esAdmin && (
              <TouchableOpacity onPress={() => eliminar(item.id)}>
                <Text style={styles.trashIcon}>🗑️</Text>
              </TouchableOpacity>
            )}
            {!esAdmin && (
              <View style={[styles.estadoBadge, {
                backgroundColor: item.estado === "completada" ? "#6BCB7720"
                  : item.estado === "en_progreso" ? "#FFD93D20" : "#FF6B9D20"
              }]}>
                <Text style={[styles.estadoText, {
                  color: item.estado === "completada" ? "#6BCB77"
                    : item.estado === "en_progreso" ? "#E6A817" : "#FF6B9D"
                }]}>
                  {item.estado === "completada" ? "Entregada" : item.estado === "en_progreso" ? "En progreso" : "Pendiente"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.vacioBox}>
            <Text style={styles.vacioEmoji}>{filtro === "completada" ? "📭" : "🎉"}</Text>
            <Text style={styles.vacioText}>
              {filtro === "completada" ? "Sin actividades entregadas" : filtro === "en_progreso" ? "Sin actividades en progreso" : "¡No hay actividades pendientes!"}
            </Text>
          </View>
        }
      />

      {/* Modal solo para maestra */}
      {esAdmin && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalEmoji}>{editingTarea ? "✏️" : "🆕"}</Text>
              <Text style={styles.modalTitulo}>{editingTarea ? "Editar Actividad" : "Nueva Actividad"}</Text>
              <View style={styles.inputBox}>
                <Text style={styles.inputIcon}>📝</Text>
                <TextInput style={styles.input} placeholder="Nombre de la actividad..." value={titulo} onChangeText={setTitulo} placeholderTextColor="#BBB" />
              </View>
              <TouchableOpacity style={styles.btnGuardar} onPress={guardar}>
                <Text style={styles.btnGuardarText}>💾 Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBFF" },
  header: { borderBottomLeftRadius: 32, borderBottomRightRadius: 32, padding: 24, paddingTop: 56, paddingBottom: 28, overflow: "hidden" },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 150, height: 150, backgroundColor: "#ffffff20", top: -50, right: -30 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titulo: { fontSize: 26, fontWeight: "900", color: "#fff" },
  fecha: { fontSize: 13, color: "#ffffff99", marginTop: 2 },
  addBtn: { backgroundColor: "#ffffff30", width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  addBtnText: { color: "#fff", fontSize: 26, fontWeight: "900" },
  filtros: { flexDirection: "row", gap: 8, padding: 16, paddingBottom: 8 },
  filtroBtn: { flex: 1, paddingVertical: 8, borderRadius: 12, backgroundColor: "#fff", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  filtroText: { color: "#AAA", fontWeight: "700", fontSize: 11 },
  filtroTextActivo: { color: "#fff" },
  tareaCard: { borderRadius: 18, padding: 14, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  emojiBox: { width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  tareaEmoji: { fontSize: 22 },
  tareaTitulo: { fontSize: 15, color: "#2D2D2D", fontWeight: "600" },
  tachado: { textDecorationLine: "line-through", color: "#CCC" },
  creadoPor: { fontSize: 11, color: "#AAA", marginTop: 3 },
  trashIcon: { fontSize: 18 },
  estadoBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  estadoText: { fontSize: 11, fontWeight: "700" },
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
