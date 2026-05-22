import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal, TextInput, Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../services/eventService";

export default function EventScreen() {
  const [eventos, setEventos] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvento, setEditingEvento] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");
  const fecha_hoy = new Date();
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const fechaTexto = `${fecha_hoy.getDate()} de ${meses[fecha_hoy.getMonth()]}`;

  useEffect(() => { cargarEventos(); }, []);

  const cargarEventos = async () => {
    try {
      const data = await getEvents();
      setEventos(data);
    } catch (e) { console.log(e); }
  };

  const abrirModal = (item = null) => {
    if (item) {
      setEditingEvento(item);
      setTitulo(item.titulo);
      setDescripcion(item.descripcion || "");
      setLugar(item.lugar || "");
      setFecha(item.fecha ? item.fecha.split("T")[0] : "");
    } else {
      setEditingEvento(null);
      setTitulo(""); setDescripcion(""); setLugar(""); setFecha("");
    }
    setModalVisible(true);
  };

  const guardar = async () => {
    if (!titulo || !fecha) { Alert.alert("Error", "Título y fecha son requeridos"); return; }
    try {
      if (editingEvento) {
        await updateEvent(editingEvento.id, titulo, descripcion, fecha + "T08:00:00", lugar);
      } else {
        await createEvent(titulo, descripcion, fecha + "T08:00:00", lugar);
      }
      setModalVisible(false);
      cargarEventos();
    } catch (e) { Alert.alert("Error", "No se pudo guardar el evento"); }
  };

  const eliminar = async (id) => {
    try { await deleteEvent(id); cargarEventos(); }
    catch (e) { Alert.alert("Error", "No se pudo eliminar"); }
  };

  const filtrados = filtro === "Todos" ? eventos : eventos.filter(e => e.tipo === filtro);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Eventos</Text>
          <Text style={styles.fecha}>{fechaTexto}</Text>
        </View>
        <TouchableOpacity onPress={() => abrirModal()}>
          <Text style={styles.filtroIcon}>＋</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtros}>
        {["Todos", "Reuniones", "Festivos"].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filtroBtn, filtro === f && styles.filtroActivo]}
            onPress={() => setFiltro(f)}
          >
            <Text style={[styles.filtroText, filtro === f && styles.filtroTextActivo]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.eventoCard} onLongPress={() => eliminar(item.id)} onPress={() => abrirModal(item)}>
            <View style={styles.eventoFechaBox}>
              <Text style={styles.eventoFechaNum}>
                {item.fecha ? new Date(item.fecha).getDate() : "?"} de
              </Text>
              <Text style={styles.eventoFechaMes}>
                {item.fecha ? meses[new Date(item.fecha).getMonth()] : ""}
              </Text>
            </View>
            <Text style={styles.eventoTitulo}>{item.titulo} 👤</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.vacio}>No hay eventos</Text>}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>{editingEvento ? "Editar Evento" : "Nuevo Evento"}</Text>
            <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} placeholderTextColor="#aaa" />
            <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} placeholderTextColor="#aaa" />
            <TextInput style={styles.input} placeholder="Lugar" value={lugar} onChangeText={setLugar} placeholderTextColor="#aaa" />
            <TextInput style={styles.input} placeholder="Fecha (YYYY-MM-DD)" value={fecha} onChangeText={setFecha} placeholderTextColor="#aaa" />
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
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 40, marginBottom: 20 },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#222" },
  fecha: { fontSize: 14, color: "#555" },
  filtroIcon: { fontSize: 30, color: "#222" },
  filtros: { flexDirection: "row", gap: 10, marginBottom: 20 },
  filtroBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 8, backgroundColor: "#D4C9A8", borderWidth: 1, borderColor: "#bbb" },
  filtroActivo: { backgroundColor: "#6B8F4E" },
  filtroText: { color: "#444", fontWeight: "bold" },
  filtroTextActivo: { color: "#fff" },
  eventoCard: { backgroundColor: "#ADD8E6", borderRadius: 12, padding: 18, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 15 },
  eventoFechaBox: { backgroundColor: "#4A90D9", borderRadius: 8, padding: 10, alignItems: "center", minWidth: 60 },
  eventoFechaNum: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  eventoFechaMes: { color: "#fff", fontSize: 12 },
  eventoTitulo: { fontSize: 16, fontWeight: "bold", color: "#222", flex: 1 },
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
