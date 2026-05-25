import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { useState } from "react";

const materiasIniciales = [
  { id: 1, nombre: "Matemáticas", emoji: "🔢", color: "#FF6B9D" },
  { id: 2, nombre: "Lenguaje", emoji: "📚", color: "#4D96FF" },
  { id: 3, nombre: "Arte", emoji: "🎨", color: "#6BCB77" },
  { id: 4, nombre: "Música", emoji: "🎵", color: "#FFD93D" },
  { id: 5, nombre: "Ciencias", emoji: "🔬", color: "#9B59B6" },
  { id: 6, nombre: "Ed. Física", emoji: "⚽", color: "#E67E22" },
];

export default function MateriasScreen() {
  const [materias, setMaterias] = useState(materiasIniciales);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [emoji, setEmoji] = useState("📖");
  const [editando, setEditando] = useState(null);

  const abrirModal = (item = null) => { setEditando(item); setNombre(item ? item.nombre : ""); setEmoji(item ? item.emoji : "📖"); setModalVisible(true); };
  const guardar = () => {
    if (!nombre.trim()) { Alert.alert("¡Ups!", "Escribe el nombre"); return; }
    const colores = ["#FF6B9D","#4D96FF","#6BCB77","#FFD93D","#9B59B6","#E67E22"];
    if (editando) { setMaterias(prev => prev.map(m => m.id === editando.id ? { ...m, nombre, emoji } : m)); }
    else { setMaterias(prev => [...prev, { id: Date.now(), nombre, emoji, color: colores[prev.length % colores.length] }]); }
    setModalVisible(false);
  };
  const eliminar = (id) => { Alert.alert("¿Eliminar?", "¿Seguro?", [{ text: "No", style: "cancel" }, { text: "Sí", style: "destructive", onPress: () => setMaterias(prev => prev.filter(m => m.id !== id)) }]); };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.circle, styles.c1]} />
        <Text style={styles.titulo}>📖 Materias</Text>
        <Text style={styles.subtitulo}>Salón Kinder</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => abrirModal()}><Text style={styles.addBtnText}>＋</Text></TouchableOpacity>
      </View>
      <FlatList
        data={materias}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 20, gap: 14 }}
        columnWrapperStyle={{ gap: 14 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.materiaCard, { backgroundColor: item.color + "20", borderColor: item.color }]} onPress={() => abrirModal(item)} onLongPress={() => eliminar(item.id)}>
            <View style={[styles.materiaIconBox, { backgroundColor: item.color }]}><Text style={styles.materiaEmoji}>{item.emoji}</Text></View>
            <Text style={[styles.materiaNombre, { color: item.color }]}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>{editando ? "✏️" : "🆕"}</Text>
            <Text style={styles.modalTitulo}>{editando ? "Editar Materia" : "Nueva Materia"}</Text>
            {[{ icon: "📖", ph: "Nombre de la materia", val: nombre, set: setNombre }, { icon: "🎨", ph: "Emoji (ej: 🎨)", val: emoji, set: setEmoji }].map((f, i) => (
              <View key={i} style={styles.inputBox}><Text style={styles.inputIcon}>{f.icon}</Text><TextInput style={styles.input} placeholder={f.ph} value={f.val} onChangeText={f.set} placeholderTextColor="#BBB" /></View>
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
  header: { backgroundColor: "#9B59B6", borderBottomLeftRadius: 32, borderBottomRightRadius: 32, padding: 24, paddingTop: 56, paddingBottom: 28, overflow: "hidden" },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 150, height: 150, backgroundColor: "#ffffff20", top: -50, right: -30 },
  titulo: { fontSize: 28, fontWeight: "900", color: "#fff" },
  subtitulo: { fontSize: 13, color: "#ffffff99", marginTop: 2 },
  addBtn: { position: "absolute", top: 52, right: 24, backgroundColor: "#ffffff30", width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  addBtnText: { color: "#fff", fontSize: 26, fontWeight: "900" },
  materiaCard: { flex: 1, borderRadius: 22, padding: 20, alignItems: "center", borderWidth: 2 },
  materiaIconBox: { width: 60, height: 60, borderRadius: 20, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  materiaEmoji: { fontSize: 32 },
  materiaNombre: { fontSize: 14, fontWeight: "900", textAlign: "center" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: { width: "90%", backgroundColor: "#FFFBFF", padding: 28, borderRadius: 28, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 },
  modalEmoji: { fontSize: 44, marginBottom: 8 },
  modalTitulo: { fontSize: 20, fontWeight: "900", color: "#2D2D2D", marginBottom: 16 },
  inputBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 12, borderWidth: 1.5, borderColor: "#F0F0F0", width: "100%" },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#2D2D2D", paddingVertical: 12 },
  btnGuardar: { width: "100%", backgroundColor: "#9B59B6", borderRadius: 16, padding: 15, alignItems: "center", marginBottom: 10, shadowColor: "#9B59B6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  btnGuardarText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  btnCancelar: { width: "100%", backgroundColor: "#F8F8F8", borderRadius: 16, padding: 15, alignItems: "center" },
  btnCancelarText: { color: "#AAA", fontWeight: "700", fontSize: 15 },
});
