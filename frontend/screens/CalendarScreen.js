import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Modal, Alert } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useState, useEffect } from "react";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../services/eventService";

LocaleConfig.locales["es"] = {
  monthNames: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
  monthNamesShort: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
  dayNames: ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],
  dayNamesShort: ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],
  today: "Hoy",
};
LocaleConfig.defaultLocale = "es";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [eventText, setEventText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchEvents(); }, []);
  const fetchEvents = async () => { try { const data = await getEvents(); setEvents(data.map(e => ({ ...e, date: e.fecha ? e.fecha.split("T")[0] : e.date }))); } catch (e) { console.log(e); } };
  const addEvent = async () => {
    if (!eventText.trim() || !selectedDate) { Alert.alert("¡Ups!", "Selecciona una fecha y escribe el evento"); return; }
    try { setLoading(true); await createEvent(eventText, "", selectedDate + "T08:00:00", ""); setEventText(""); await fetchEvents(); }
    catch (e) { Alert.alert("Error", "No se pudo crear"); } finally { setLoading(false); }
  };
  const deleteEventHandler = (id) => {
    Alert.alert("¿Eliminar?", "¿Borrar este evento?", [
      { text: "No", style: "cancel" },
      { text: "Sí", style: "destructive", onPress: async () => { try { await deleteEvent(id); await fetchEvents(); } catch (e) {} } }
    ]);
  };
  const openEditModal = (item) => { setEditingEvent(item); setEditedTitle(item.titulo || item.title); setModalVisible(true); };
  const saveEdit = async () => {
    try { await updateEvent(editingEvent.id, editedTitle, editingEvent.descripcion || "", editingEvent.fecha || editingEvent.date + "T08:00:00", editingEvent.lugar || ""); setModalVisible(false); await fetchEvents(); }
    catch (e) { Alert.alert("Error", "No se pudo editar"); }
  };

  const selectedEvents = events.filter(item => item.date === selectedDate);
  const markedDates = {};
  events.forEach(event => { markedDates[event.date] = { marked: true, dotColor: "#FF6B9D" }; });
  if (selectedDate) markedDates[selectedDate] = { ...(markedDates[selectedDate] || {}), selected: true, selectedColor: "#FF6B9D" };
  const colores = ["#FF6B9D","#4D96FF","#6BCB77","#FFD93D","#9B59B6"];
  const emojis = ["🎈","📌","🎉","⭐","🎨","🎵","📚"];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.circle, styles.c1]} />
        <Text style={styles.titulo}>📅 Calendario</Text>
        <Text style={styles.subtitulo}>del Salón Kinder</Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            backgroundColor: "#fff", calendarBackground: "#fff",
            textSectionTitleColor: "#AAA", selectedDayBackgroundColor: "#FF6B9D",
            selectedDayTextColor: "#fff", todayTextColor: "#FF6B9D",
            dayTextColor: "#2D2D2D", textDisabledColor: "#DDD",
            monthTextColor: "#2D2D2D", arrowColor: "#FF6B9D",
            dotColor: "#FF6B9D", textMonthFontWeight: "900", textDayFontWeight: "600",
          }}
        />
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputBox}>
          <Text style={styles.inputIcon}>✏️</Text>
          <TextInput placeholder="Agregar evento en esta fecha..." placeholderTextColor="#BBB" style={styles.input} value={eventText} onChangeText={setEventText} />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addEvent} disabled={loading}>
          <Text style={styles.addButtonText}>{loading ? "..." : "＋"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.seccionTitulo}>{selectedDate ? `🗓️ Eventos del ${selectedDate}` : "🗓️ Selecciona una fecha"}</Text>
      {selectedEvents.length === 0 && selectedDate && <View style={styles.vacioBox}><Text style={styles.vacioEmoji}>🌟</Text><Text style={styles.vacioText}>No hay eventos este día</Text></View>}
      {!selectedDate && <View style={styles.vacioBox}><Text style={styles.vacioEmoji}>👆</Text><Text style={styles.vacioText}>Toca un día para ver sus eventos</Text></View>}
      <FlatList data={selectedEvents} keyExtractor={item => item.id.toString()} scrollEnabled={false} contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item, index }) => (
          <View style={styles.eventCard}>
            <View style={[styles.eventIconBox, { backgroundColor: colores[index % colores.length] }]}><Text style={styles.eventIcon}>{emojis[index % emojis.length]}</Text></View>
            <View style={{ flex: 1 }}><Text style={styles.eventText}>{item.titulo || item.title}</Text><Text style={styles.eventDate}>{item.date}</Text></View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openEditModal(item)}><Text style={styles.actionIcon}>✏️</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => deleteEventHandler(item.id)}><Text style={styles.actionIcon}>🗑️</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>✏️</Text>
            <Text style={styles.modalTitulo}>Editar Evento</Text>
            <View style={styles.modalInputBox}><Text style={styles.inputIcon}>📌</Text><TextInput style={styles.input} value={editedTitle} onChangeText={setEditedTitle} placeholder="Nombre del evento" placeholderTextColor="#BBB" /></View>
            <TouchableOpacity style={styles.btnGuardar} onPress={saveEdit}><Text style={styles.btnGuardarText}>💾 Guardar Cambios</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}><Text style={styles.btnCancelarText}>Cancelar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBFF" },
  header: { backgroundColor: "#FFD93D", borderBottomLeftRadius: 32, borderBottomRightRadius: 32, padding: 24, paddingTop: 56, paddingBottom: 28, overflow: "hidden" },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 150, height: 150, backgroundColor: "#ffffff30", top: -50, right: -30 },
  titulo: { fontSize: 28, fontWeight: "900", color: "#2D2D2D" },
  subtitulo: { fontSize: 14, color: "#2D2D2D99", marginTop: 2 },
  calendarContainer: { margin: 20, backgroundColor: "#fff", borderRadius: 24, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  inputContainer: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  inputBox: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, borderWidth: 1.5, borderColor: "#F0F0F0", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: "#2D2D2D", paddingVertical: 12 },
  addButton: { width: 50, height: 50, backgroundColor: "#FF6B9D", borderRadius: 16, justifyContent: "center", alignItems: "center", shadowColor: "#FF6B9D", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  addButtonText: { color: "#fff", fontSize: 24, fontWeight: "900" },
  seccionTitulo: { fontSize: 16, fontWeight: "900", color: "#2D2D2D", paddingHorizontal: 20, marginBottom: 12 },
  vacioBox: { alignItems: "center", marginVertical: 20 },
  vacioEmoji: { fontSize: 40, marginBottom: 8 },
  vacioText: { color: "#AAA", fontSize: 14, fontWeight: "600" },
  eventCard: { backgroundColor: "#fff", borderRadius: 18, padding: 14, marginBottom: 12, flexDirection: "row", alignItems: "center", gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  eventIconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  eventIcon: { fontSize: 22 },
  eventText: { fontSize: 15, fontWeight: "800", color: "#2D2D2D" },
  eventDate: { fontSize: 12, color: "#AAA", marginTop: 2 },
  actions: { flexDirection: "row", gap: 10 },
  actionIcon: { fontSize: 20 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: { width: "90%", backgroundColor: "#FFFBFF", padding: 28, borderRadius: 28, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 },
  modalEmoji: { fontSize: 44, marginBottom: 8 },
  modalTitulo: { fontSize: 20, fontWeight: "900", color: "#2D2D2D", marginBottom: 16 },
  modalInputBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 16, borderWidth: 1.5, borderColor: "#F0F0F0", width: "100%" },
  btnGuardar: { width: "100%", backgroundColor: "#FF6B9D", borderRadius: 16, padding: 15, alignItems: "center", marginBottom: 10, shadowColor: "#FF6B9D", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  btnGuardarText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  btnCancelar: { width: "100%", backgroundColor: "#F8F8F8", borderRadius: 16, padding: 15, alignItems: "center" },
  btnCancelarText: { color: "#AAA", fontWeight: "700", fontSize: 15 },
});
