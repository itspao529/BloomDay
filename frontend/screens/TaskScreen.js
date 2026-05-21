import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, TextInput, Modal
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function TaskScreen() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    cargarTareas();
  }, []);

  const getToken = async () => await AsyncStorage.getItem("token");

  const cargarTareas = async () => {
    try {
      const token = await getToken();
      const res = await API.get("/tareas", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  const addTask = async () => {
    if (!task.trim()) return;
    try {
      const token = await getToken();
      await API.post("/tareas",
        { titulo: task, estado: "pendiente", prioridad: "media" },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setTask("");
      cargarTareas();
    } catch (error) {
      console.error("Error agregando tarea:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = await getToken();
      await API.delete(`/tareas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarTareas();
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  };

  const toggleTask = async (item) => {
    try {
      const token = await getToken();
      const nuevoEstado = item.estado === "completada" ? "pendiente" : "completada";
      await API.put(`/tareas/${item.id}`,
        { ...item, estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      cargarTareas();
    } catch (error) {
      console.error("Error actualizando tarea:", error);
    }
  };

  const openEditModal = (item) => {
    setEditingTask(item);
    setEditedTitle(item.titulo);
    setModalVisible(true);
  };

  const saveEdit = async () => {
    try {
      const token = await getToken();
      await API.put(`/tareas/${editingTask.id}`,
        { ...editingTask, titulo: editedTitle },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setModalVisible(false);
      cargarTareas();
    } catch (error) {
      console.error("Error editando tarea:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity style={styles.taskLeft} onPress={() => toggleTask(item)}>
        <Ionicons
          name={item.estado === "completada" ? "checkmark-circle" : "ellipse-outline"}
          size={28}
          color={item.estado === "completada" ? "#22C55E" : "#CBD5E1"}
        />
        <Text style={[styles.taskText, item.estado === "completada" && { textDecorationLine: "line-through", opacity: 0.5 }]}>
          {item.titulo}
        </Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => openEditModal(item)}>
          <Ionicons name="create-outline" size={24} color="#FACC15" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tareas</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nueva tarea..."
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Tarea</Text>
            <TextInput
              style={styles.modalInput}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Editar tarea"
              placeholderTextColor="#CBD5E1"
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
  taskCard: { backgroundColor: "#1E293B", borderRadius: 16, padding: 18, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  taskLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  taskText: { color: "white", marginLeft: 15, fontSize: 16 },
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