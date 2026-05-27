import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import API from "../services/api";

export default function AlumnosScreen() {
  const [alumnos, setAlumnos] = useState([]);
  const [padres, setPadres] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [tutorId, setTutorId] = useState("");
  const [editando, setEditando] = useState(null);
  const [tabDetalle, setTabDetalle] = useState("info");

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      const [resAlumnos, resPadres, resTareas] = await Promise.all([
        API.get("/estudiantes"),
        API.get("/usuarios"),
        API.get("/tareas"),
      ]);
      setAlumnos(resAlumnos.data);
      setPadres(resPadres.data.filter(p => p.rol === "usuario"));
      setTareas(resTareas.data);
    } catch (e) { console.log(e); }
  };

  const abrirDetalle = (item) => {
    setAlumnoSeleccionado(item);
    setTabDetalle("info");
    setDetalleVisible(true);
  };

  const abrirModal = (item = null) => {
    setEditando(item);
    setNombre(item ? item.nombre : "");
    setEdad(item ? String(item.edad || "") : "");
    setTutorId(item ? String(item.tutor_id || "") : "");
    setModalVisible(true);
  };

  const guardar = async () => {
    if (!nombre.trim()) { Alert.alert("¡Ups!", "Escribe el nombre 📝"); return; }
    try {
      if (editando) {
        await API.put(`/estudiantes/${editando.id}`, { nombre, edad: parseInt(edad), tutor_id: parseInt(tutorId), matricula: editando.matricula });
      } else {
        const matricula = `KG-${String(alumnos.length + 1).padStart(3, "0")}`;
        await API.post("/estudiantes", { nombre, edad: parseInt(edad), tutor_id: parseInt(tutorId), matricula });
      }
      setModalVisible(false);
      cargarDatos();
    } catch (e) { Alert.alert("Error", "No se pudo guardar"); }
  };

  const eliminar = (id) => {
    Alert.alert("¿Eliminar alumno?", "Esta acción no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await API.delete(`/estudiantes/${id}`); cargarDatos(); setDetalleVisible(false); }
        catch (e) { Alert.alert("Error", "No se pudo eliminar"); }
      }}
    ]);
  };

  const alumnosFiltrados = alumnos.filter(a =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (a.tutor_nombre && a.tutor_nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
    (a.matricula && a.matricula.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const emojis = ["👧","👦","🧒","👶","🌟","🎨","🦋","⭐","🌈","🎵"];
  const colores = ["#FF6B9D","#4D96FF","#6BCB77","#FFD93D","#9B59B6"];

  const tareasEntregadas = tareas.filter(t => t.estado === "completada");
  const tareasPendientes = tareas.filter(t => t.estado === "pendiente");
  const tareasEnProgreso = tareas.filter(t => t.estado === "en_progreso");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.circle, styles.c1]} />
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.titulo}>👧 Alumnos</Text>
            <Text style={styles.subtitulo}>{alumnos.length} estudiantes · Kinder A</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => abrirModal()}>
            <Text style={styles.addBtnText}>＋</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, matrícula o tutor..."
            placeholderTextColor="#ffffff80"
            value={busqueda}
            onChangeText={setBusqueda}
          />
          {busqueda.length > 0 && (
            <TouchableOpacity onPress={() => setBusqueda("")}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.resumenRow}>
        <View style={[styles.resumenCard, { backgroundColor: "#6BCB7720", borderColor: "#6BCB77" }]}>
          <Text style={[styles.resumenNum, { color: "#6BCB77" }]}>{tareasEntregadas.length}</Text>
          <Text style={styles.resumenLabel}>✅ Entregadas</Text>
        </View>
        <View style={[styles.resumenCard, { backgroundColor: "#FF6B9D20", borderColor: "#FF6B9D" }]}>
          <Text style={[styles.resumenNum, { color: "#FF6B9D" }]}>{tareasPendientes.length}</Text>
          <Text style={styles.resumenLabel}>⏳ Pendientes</Text>
        </View>
        <View style={[styles.resumenCard, { backgroundColor: "#FFD93D20", borderColor: "#FFD93D" }]}>
          <Text style={[styles.resumenNum, { color: "#E6A817" }]}>{tareasEnProgreso.length}</Text>
          <Text style={styles.resumenLabel}>🔄 En progreso</Text>
        </View>
      </View>

      <FlatList
        data={alumnosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20, paddingTop: 8 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.alumnoCard} onPress={() => abrirDetalle(item)}>
            <View style={[styles.avatarBox, { backgroundColor: colores[index % colores.length] }]}>
              <Text style={styles.avatarEmoji}>{emojis[index % emojis.length]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.alumnoNombre}>{item.nombre}</Text>
              <Text style={styles.alumnoInfo}>{item.edad ? `${item.edad} años` : "Sin edad"} · {item.matricula}</Text>
              {item.tutor_nombre && (
                <View style={styles.tutorBadge}>
                  <Text style={styles.tutorText}>👨‍👩‍👧 {item.tutor_nombre}</Text>
                </View>
              )}
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.vacioBox}>
            <Text style={styles.vacioEmoji}>{busqueda ? "🔍" : "🏫"}</Text>
            <Text style={styles.vacioText}>{busqueda ? `Sin resultados para "${busqueda}"` : "No hay alumnos registrados"}</Text>
          </View>
        }
      />

      {/* Modal detalle alumno */}
      <Modal visible={detalleVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: "88%" }]}>
            {alumnoSeleccionado && (
              <>
                <Text style={styles.modalEmoji}>👧</Text>
                <Text style={styles.modalTitulo}>{alumnoSeleccionado.nombre}</Text>
                <Text style={styles.modalMatricula}>{alumnoSeleccionado.matricula} · Kinder A</Text>

                <View style={styles.tabs}>
                  {["info", "actividades"].map(tab => (
                    <TouchableOpacity
                      key={tab}
                      style={[styles.tab, tabDetalle === tab && styles.tabActivo]}
                      onPress={() => setTabDetalle(tab)}
                    >
                      <Text style={[styles.tabText, tabDetalle === tab && styles.tabTextActivo]}>
                        {tab === "info" ? "📋 Info" : "📝 Actividades"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {tabDetalle === "info" && (
                  <>
                    <View style={styles.detalleGrid}>
                      <View style={styles.detalleItem}>
                        <Text style={styles.detalleLabel}>Edad</Text>
                        <Text style={styles.detalleValor}>{alumnoSeleccionado.edad} años</Text>
                      </View>
                      <View style={styles.detalleItem}>
                        <Text style={styles.detalleLabel}>Salón</Text>
                        <Text style={styles.detalleValor}>Kinder A</Text>
                      </View>
                    </View>
                    {alumnoSeleccionado.tutor_nombre && (
                      <View style={styles.tutorCard}>
                        <Text style={styles.tutorCardTitle}>👨‍👩‍👧 Papá / Mamá</Text>
                        <Text style={styles.tutorCardNombre}>{alumnoSeleccionado.tutor_nombre}</Text>
                        <Text style={styles.tutorCardEmail}>{alumnoSeleccionado.tutor_email}</Text>
                      </View>
                    )}
                    <View style={styles.accionesRow}>
                      <TouchableOpacity style={styles.btnEditar} onPress={() => { setDetalleVisible(false); abrirModal(alumnoSeleccionado); }}>
                        <Text style={styles.btnEditarText}>✏️ Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.btnEliminar} onPress={() => eliminar(alumnoSeleccionado.id)}>
                        <Text style={styles.btnEliminarText}>🗑️ Eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {tabDetalle === "actividades" && (
                  <ScrollView style={{ width: "100%", maxHeight: 300 }}>
                    <View style={styles.actResumen}>
                      <View style={[styles.actStat, { backgroundColor: "#6BCB7720" }]}>
                        <Text style={[styles.actStatNum, { color: "#6BCB77" }]}>{tareasEntregadas.length}</Text>
                        <Text style={styles.actStatLabel}>Entregadas</Text>
                      </View>
                      <View style={[styles.actStat, { backgroundColor: "#FF6B9D20" }]}>
                        <Text style={[styles.actStatNum, { color: "#FF6B9D" }]}>{tareasPendientes.length}</Text>
                        <Text style={styles.actStatLabel}>Pendientes</Text>
                      </View>
                    </View>
                    <Text style={styles.actSeccion}>✅ Entregadas</Text>
                    {tareasEntregadas.length === 0 && <Text style={styles.actVacio}>Sin actividades entregadas</Text>}
                    {tareasEntregadas.map((t, i) => (
                      <View key={i} style={[styles.actRow, { backgroundColor: "#6BCB7710" }]}>
                        <Text style={styles.actEmoji}>✅</Text>
                        <Text style={styles.actTitulo}>{t.titulo}</Text>
                      </View>
                    ))}
                    <Text style={styles.actSeccion}>⏳ Pendientes</Text>
                    {tareasPendientes.length === 0 && <Text style={styles.actVacio}>¡Todo entregado!</Text>}
                    {tareasPendientes.map((t, i) => (
                      <View key={i} style={[styles.actRow, { backgroundColor: "#FF6B9D10" }]}>
                        <Text style={styles.actEmoji}>⏳</Text>
                        <Text style={styles.actTitulo}>{t.titulo}</Text>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </>
            )}
            <TouchableOpacity style={styles.btnCancelar} onPress={() => setDetalleVisible(false)}>
              <Text style={styles.btnCancelarText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal crear/editar */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: "88%" }]}>
            <Text style={styles.modalEmoji}>{editando ? "✏️" : "🆕"}</Text>
            <Text style={styles.modalTitulo}>{editando ? "Editar Alumno" : "Nuevo Alumno"}</Text>
            {[
              { icon: "👤", placeholder: "Nombre del alumno", value: nombre, onChange: setNombre },
              { icon: "🎂", placeholder: "Edad", value: edad, onChange: setEdad, numeric: true },
            ].map((field, i) => (
              <View key={i} style={styles.inputBox}>
                <Text style={styles.inputIcon}>{field.icon}</Text>
                <TextInput style={styles.input} placeholder={field.placeholder} value={field.value} onChangeText={field.onChange} keyboardType={field.numeric ? "numeric" : "default"} placeholderTextColor="#BBB" />
              </View>
            ))}
            <Text style={styles.padresHint}>👨‍👩‍👧 Seleccionar tutor:</Text>
            <ScrollView style={{ maxHeight: 140, width: "100%", marginBottom: 12 }}>
              {padres.map(p => (
                <TouchableOpacity key={p.id} style={[styles.padreBadge, tutorId === String(p.id) && styles.padreBadgeActivo]} onPress={() => setTutorId(String(p.id))}>
                  <Text style={[styles.padreText, tutorId === String(p.id) && { color: "#fff" }]}>
                    {tutorId === String(p.id) ? "✓ " : ""}{p.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.btnGuardar} onPress={guardar}>
              <Text style={styles.btnGuardarText}>💾 Guardar</Text>
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
  container: { flex: 1, backgroundColor: "#FFFBFF" },
  header: { backgroundColor: "#FF6B9D", borderBottomLeftRadius: 32, borderBottomRightRadius: 32, padding: 24, paddingTop: 56, paddingBottom: 20, overflow: "hidden" },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 150, height: 150, backgroundColor: "#ffffff20", top: -50, right: -30 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  titulo: { fontSize: 28, fontWeight: "900", color: "#fff" },
  subtitulo: { fontSize: 13, color: "#ffffff99", marginTop: 2 },
  addBtn: { backgroundColor: "#ffffff30", width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  addBtnText: { color: "#fff", fontSize: 26, fontWeight: "900" },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff25", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, gap: 10 },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: "#fff", fontWeight: "600" },
  clearIcon: { color: "#ffffff80", fontSize: 16, fontWeight: "700" },
  resumenRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  resumenCard: { flex: 1, borderRadius: 14, padding: 10, alignItems: "center", borderWidth: 1.5 },
  resumenNum: { fontSize: 22, fontWeight: "900" },
  resumenLabel: { fontSize: 10, fontWeight: "700", color: "#888", marginTop: 2, textAlign: "center" },
  alumnoCard: { backgroundColor: "#fff", borderRadius: 18, padding: 14, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  avatarBox: { width: 50, height: 50, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  avatarEmoji: { fontSize: 26 },
  alumnoNombre: { fontSize: 15, fontWeight: "800", color: "#2D2D2D" },
  alumnoInfo: { fontSize: 12, color: "#AAA", marginTop: 2 },
  tutorBadge: { marginTop: 4, backgroundColor: "#FF6B9D15", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start" },
  tutorText: { fontSize: 11, color: "#FF6B9D", fontWeight: "700" },
  arrowIcon: { fontSize: 22, color: "#CCC" },
  vacioBox: { alignItems: "center", marginTop: 60 },
  vacioEmoji: { fontSize: 56, marginBottom: 12 },
  vacioText: { fontSize: 15, fontWeight: "600", color: "#AAA", textAlign: "center" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: { width: "90%", backgroundColor: "#FFFBFF", padding: 24, borderRadius: 28, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 },
  modalEmoji: { fontSize: 44, marginBottom: 8 },
  modalTitulo: { fontSize: 20, fontWeight: "900", color: "#2D2D2D", marginBottom: 4 },
  modalMatricula: { fontSize: 13, color: "#FF6B9D", fontWeight: "700", marginBottom: 16 },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 16, width: "100%" },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 12, backgroundColor: "#F8F8F8", alignItems: "center" },
  tabActivo: { backgroundColor: "#FF6B9D" },
  tabText: { fontSize: 13, fontWeight: "700", color: "#AAA" },
  tabTextActivo: { color: "#fff" },
  detalleGrid: { flexDirection: "row", gap: 10, marginBottom: 14, width: "100%" },
  detalleItem: { flex: 1, backgroundColor: "#F8F8F8", borderRadius: 14, padding: 12, alignItems: "center" },
  detalleLabel: { fontSize: 11, color: "#AAA", fontWeight: "700" },
  detalleValor: { fontSize: 18, fontWeight: "900", color: "#2D2D2D", marginTop: 4 },
  tutorCard: { width: "100%", backgroundColor: "#FF6B9D15", borderRadius: 16, padding: 14, marginBottom: 14, borderWidth: 1.5, borderColor: "#FF6B9D30" },
  tutorCardTitle: { fontSize: 12, color: "#FF6B9D", fontWeight: "700", marginBottom: 4 },
  tutorCardNombre: { fontSize: 16, fontWeight: "800", color: "#2D2D2D" },
  tutorCardEmail: { fontSize: 12, color: "#AAA", marginTop: 2 },
  accionesRow: { flexDirection: "row", gap: 10, width: "100%", marginBottom: 10 },
  btnEditar: { flex: 1, backgroundColor: "#FF6B9D", borderRadius: 14, padding: 12, alignItems: "center" },
  btnEditarText: { color: "#fff", fontWeight: "900", fontSize: 14 },
  btnEliminar: { flex: 1, backgroundColor: "#F8F8F8", borderRadius: 14, padding: 12, alignItems: "center", borderWidth: 1.5, borderColor: "#F0F0F0" },
  btnEliminarText: { color: "#AAA", fontWeight: "700", fontSize: 14 },
  actResumen: { flexDirection: "row", gap: 10, marginBottom: 14 },
  actStat: { flex: 1, borderRadius: 12, padding: 10, alignItems: "center" },
  actStatNum: { fontSize: 22, fontWeight: "900" },
  actStatLabel: { fontSize: 11, fontWeight: "700", color: "#888", marginTop: 2 },
  actSeccion: { fontSize: 13, fontWeight: "900", color: "#2D2D2D", marginBottom: 8, marginTop: 4 },
  actVacio: { fontSize: 13, color: "#AAA", textAlign: "center", marginBottom: 8 },
  actRow: { borderRadius: 12, padding: 10, marginBottom: 6, flexDirection: "row", alignItems: "center", gap: 10 },
  actEmoji: { fontSize: 18 },
  actTitulo: { fontSize: 13, fontWeight: "600", color: "#2D2D2D", flex: 1 },
  inputBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 12, borderWidth: 1.5, borderColor: "#F0F0F0", width: "100%" },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#2D2D2D", paddingVertical: 12 },
  padresHint: { fontSize: 13, color: "#2D2D2D", fontWeight: "700", alignSelf: "flex-start", marginBottom: 8 },
  padreBadge: { backgroundColor: "#F8F8F8", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 6, borderWidth: 1.5, borderColor: "#F0F0F0" },
  padreBadgeActivo: { backgroundColor: "#FF6B9D", borderColor: "#FF6B9D" },
  padreText: { fontSize: 13, fontWeight: "600", color: "#2D2D2D" },
  btnGuardar: { width: "100%", backgroundColor: "#FF6B9D", borderRadius: 16, padding: 15, alignItems: "center", marginBottom: 10, shadowColor: "#FF6B9D", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  btnGuardarText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  btnCancelar: { width: "100%", backgroundColor: "#F8F8F8", borderRadius: 16, padding: 15, alignItems: "center", marginTop: 6 },
  btnCancelarText: { color: "#AAA", fontWeight: "700", fontSize: 15 },
});
