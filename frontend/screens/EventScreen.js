import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [esAdmin, setEsAdmin] = useState(false);

  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  useEffect(() => {
    const cargar = async () => {
      const u = await AsyncStorage.getItem("user");
      if (u) setEsAdmin(JSON.parse(u).rol === "admin");
    };
    cargar();
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try { const data = await getEvents(); setEventos(data); }
    catch (e) { console.log(e); }
  };

  const abrirModal = (item = null) => {
    if (item) {
      setEditingEvento(item); setTitulo(item.titulo);
      setDescripcion(item.descripcion || ""); setLugar(item.lugar || "");
      setFecha(item.fecha ? item.fecha.split("T")[0] : "");
    } else {
      setEditingEvento(null); setTitulo(""); setDescripcion(""); setLugar(""); setFecha("");
    }
    setModalVisible(true);
  };

  const guardar = async () => {
    if (!titulo || !fecha) { Alert.alert("¡Ups!", "Título y fecha son requeridos"); return; }
    try {
      if (editingEvento) {
        await updateEvent(editingEvento.id, titulo, descripcion, fecha + "T08:00:00", lugar);
      } else {
        await createEvent(titulo, descripcion, fecha + "T08:00:00", lugar);
      }
      setModalVisible(false); cargarEventos();
    } catch (e) { Alert.alert("Error", "No se pudo guardar"); }
  };

  const eliminar = (id) => {
    Alert.alert("¿Eliminar?", "¿Seguro?", [
      { text: "No", style: "cancel" },
      { text: "Sí", style: "destructive", onPress: async () => {
        try { await deleteEvent(id); cargarEventos(); } catch (e) {}
      }}
    ]);
  };

  const colores = ["#FF6B9D","#4D96FF","#6BCB77","#FFD93D","#9B59B6"];
  const emojisEvento = ["🎈","📌","🎉","🏫","⭐","🎨","🎵"];
  const filtrados = filtro === "Todos" ? eventos : eventos.filter(e => e.tipo === filtro);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: esAdmin ? "#6BCB77" : "#4D96FF" }]}>
        <View style={[styles.circle, styles.c1]} />
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.titulo}>🎉 Eventos del Salón</Text>
            <Text style={styles.subtitulo}>{filtrados.length} eventos</Text>
          </View>
          {esAdmin && (
            <TouchableOpacity style={styles.addBtn} onPress={() => abrirModal()}>
              <Text style={styles.addBtnText}>＋</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filtros}>
        {[{ label: "🎉 Todos", value: "Todos" }, { label: "👩‍👩‍👧 Reuniones", value: "Reuniones" }, { label: "🎊 Festivos", value: "Festivos" }].map(f => (
          <TouchableOpacity key={f.value}
            style={[styles.filtroBtn, filtro === f.value && { backgroundColor: esAdmin ? "#6BCB77" : "#4D96FF" }]}
            onPress={() => setFiltro(f.value)}>
            <Text style={[styles.filtroText, filtro === f.value && styles.filtroTextActivo]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.eventoCard}
            onPress={() => esAdmin && abrirModal(item)}
            onLongPress={() => esAdmin && eliminar(item.id)}
            activeOpacity={esAdmin ? 0.7 : 1}
          >
            <View style={[styles.fechaBox, { backgroundColor: colores[index % colores.length] }]}>
              <Text style={styles.fechaNum}>{item.fecha ? new Date(item.fecha).getDate() : "?"}</Text>
              <Text style={styles.fechaMes}>{item.fecha ? meses[new Date(item.fecha).getMonth()]?.substring(0, 3) : ""}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.eventoTitulo}>{item.titulo}</Text>
              {item.lugar ? <Text style={styles.eventoLugar}>📍 {item.lugar}</Text> : null}
              {item.descripcion ? <Text style={styles.eventoDesc} numberOfLines={1}>{item.descripcion}</Text> : null}
            </View>
            <Text style={styles.eventoEmoji}>{emojisEvento[index % emojisEvento.length]}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.vacioBox}>
            <Text style={styles.vacioEmoji}>📅</Text>
            <Text style={styles.vacioText}>No hay eventos todavía</Text>
          </View>
        }
      />

      {/* Modal solo para maestra */}
      {esAdmin && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalEmoji}>{editingEvento ? "✏️" : "🆕"}</Text>
              <Text style={styles.modalTitulo}>{editingEvento ? "Editar Evento" : "Nuevo Evento"}</Text>
              {[
                { icon: "📌", placeholder: "Título del evento", value: titulo, onChange: setTitulo },
                { icon: "📝", placeholder: "Descripción (opcional)", value: descripcion, onChange: setDescripcion },
                { icon: "📍", placeholder: "Lugar (opcional)", value: lugar, onChange: setLugar },
                { icon: "📅", placeholder: "Fecha: YYYY-MM-DD", value: fecha, onChange: setFecha },
              ].map((field, i) => (
                <View key={i} style={styles.inputBox}>
                  <Text style={styles.inputIcon}>{field.icon}</Text>
                  <TextInput style={styles.input} placeholder={field.placeholder} value={field.value} onChangeText={field.onChange} placeholderTextColor="#BBB" />
                </View>
              ))}
              <TouchableOpacity style={styles.btnGuardar} onPress={guardar}>
                <Text style={styles.btnGuardarText}>💾 Guardar Evento</Text>
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
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titulo: { fontSize: 24, fontWeight: "900", color: "#fff" },
  subtitulo: { fontSize: 13, color: "#ffffff99", marginTop: 2 },
  addBtn: { backgroundColor: "#ffffff30", width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  addBtnText: { color: "#fff", fontSize: 26, fontWeight: "900" },
  filtros: { flexDirection: "row", gap: 8, padding: 16, paddingBottom: 8 },
  filtroBtn: { flex: 1, paddingVertical: 9, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  filtroText: { color: "#AAA", fontWeight: "700", fontSize: 11 },
  filtroTextActivo: { color: "#fff" },
  eventoCard: { backgroundColor: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  fechaBox: { borderRadius: 14, paddingVertical: 10, paddingHorizontal: 12, alignItems: "center", minWidth: 52 },
  fechaNum: { color: "#fff", fontWeight: "900", fontSize: 20 },
  fechaMes: { color: "#ffffff99", fontSize: 11, fontWeight: "700" },
  eventoTitulo: { fontSize: 15, fontWeight: "800", color: "#2D2D2D" },
  eventoLugar: { fontSize: 12, color: "#AAA", marginTop: 3 },
  eventoDesc: { fontSize: 11, color: "#BBB", marginTop: 2 },
  eventoEmoji: { fontSize: 24 },
  vacioBox: { alignItems: "center", marginTop: 60 },
  vacioEmoji: { fontSize: 56, marginBottom: 12 },
  vacioText: { color: "#AAA", fontSize: 15, fontWeight: "600" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: { width: "90%", backgroundColor: "#FFFBFF", padding: 28, borderRadius: 28, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 },
  modalEmoji: { fontSize: 44, marginBottom: 8 },
  modalTitulo: { fontSize: 20, fontWeight: "900", color: "#2D2D2D", marginBottom: 16 },
  inputBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 12, borderWidth: 1.5, borderColor: "#F0F0F0", width: "100%" },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: "#2D2D2D", paddingVertical: 12 },
  btnGuardar: { width: "100%", backgroundColor: "#6BCB77", borderRadius: 16, padding: 15, alignItems: "center", marginBottom: 10, shadowColor: "#6BCB77", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  btnGuardarText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  btnCancelar: { width: "100%", backgroundColor: "#F8F8F8", borderRadius: 16, padding: 15, alignItems: "center" },
  btnCancelarText: { color: "#AAA", fontWeight: "700", fontSize: 15 },
});
