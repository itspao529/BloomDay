import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, TextInput, Modal, useEffect
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function EventScreen() {
  const [event, setEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    cargarEventos();
  }, []);

  const getToken = async () => {
    return await AsyncStorage.getItem("token");
  };

  const cargarEventos = async () => {
    try {
      const token = await getToken();
      const res = await API.get("/eventos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data);
    } catch (error) {
      console.error("Error cargando eventos:", error);
    }
  };

  const addEvent = async () => {
    if (!event.trim()) return;
    try {
      const token = await getToken();
      await API.post("/eventos",
        {
          titulo: event,
          fecha: new Date().toISOString().split("T")[0],
          descripcion: "",
          lugar: ""
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setEvent("");
      cargarEventos();
    } catch (error) {
      console.error("Error agregando evento:", error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      const token = await getToken();
      await API.delete(`/eventos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarEventos();
    } catch (error) {
      console.error("Error eliminando evento:", error);
    }
  };

  const openEditModal = (item) => {
    setEditingEvent(item);
    setEditedTitle(item.titulo);
    setModalVisible(true);
  };

  const saveEdit = async () => {
    try {
      const token = await getToken();
      await API.put(`/eventos/${editingEvent.id}`,
        {
          titulo: editedTitle,
          fecha: editingEvent.fecha,
          descripcion: editingEvent.descripcion,
          lugar: editingEvent.lugar
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setModalVisible(false);
      cargarEventos();
    } catch (error) {
      console.error("Error editando evento:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventInfo}>
        <Ionicons name="calendar-outline" size={28} color="#2563EB" />
        <View style={styles.textContainer}>
          <Text style={styles.eventTitle}>{item.titulo}</Text>
          <Text style={styles.eventDate}>{item.fecha}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => openEditModal(item)}>
          <Ionicons name="create-outline" size={24} color="#FACC15" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteEvent(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nuevo evento..."
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={event}
          onChangeText={setEvent}
        />
        <TouchableOpacity style={styles.addButton} onPress={addEvent}>
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Evento</Text>
            <TextInput
              style={styles.modalInput}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Editar evento"
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", padding: 20 },
  title: { color: "white", fontSize: 32, fontWeight: "bold", marginBottom: 20, marginTop: 20 },
  inputContainer: { flexDirection: "row", marginBottom: 20 },
  input: { flex: 1, backgroundColor: "#1E293B", color: "white", borderRadius: 14, paddingHorizontal: 15, marginRight: 10, height: 55 },
  addButton: { width: 55, height: 55, backgroundColor: "#2563EB", borderRadius: 14, justifyContent: "center", alignItems: "center" },
  eventCard: { backgroundColor: "#1E293B", borderRadius: 16, padding: 18, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  eventInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  textContainer: { marginLeft: 15 },
  eventTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  eventDate: { color: "#CBD5E1", marginTop: 4 },
  actions: { flexDirection: "row", gap: 15 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)" },
  modalContent: { width: "90%", backgroundColor: "#1E293B", padding: 25, borderRadius: 20 },
  modalTitle: { color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  modalInput: { backgroundColor: "#334155", color: "white", borderRadius: 12, paddingHorizontal: 15, height: 55, marginBottom: 20 },
  saveButton: { backgroundColor: "#2563EB", padding: 15, borderRadius: 12, alignItems: "center" },
  saveButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  cancelButton: { marginTop: 10, padding: 15, borderRadius: 12, backgroundColor: "#475569", alignItems: "center" },
  cancelButtonText: { color: "white", fontWeight: "bold" },
});