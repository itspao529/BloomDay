import {
  View,
  Text,
 StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from "react-native";

import { Calendar } from "react-native-calendars";

import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";

export default function CalendarScreen() {

  const [selectedDate, setSelectedDate] = useState("");

  const [eventText, setEventText] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const [editingEvent, setEditingEvent] = useState(null);

  const [editedTitle, setEditedTitle] = useState("");

  const [events, setEvents] = useState([

    {
      id: "1",
      title: "Reunión",
      date: "2026-05-20",
    },

    {
      id: "2",
      title: "Entrega",
      date: "2026-05-20",
    },

    {
      id: "3",
      title: "Examen",
      date: "2026-05-25",
    },

  ]);

  const addEvent = () => {

    if (!eventText.trim() || !selectedDate) return;

    const newEvent = {

      id: Date.now().toString(),
      title: eventText,
      date: selectedDate,

    };

    setEvents([newEvent, ...events]);

    setEventText("");
  };

  const deleteEvent = (id) => {

    const filtered = events.filter(
      (item) => item.id !== id
    );

    setEvents(filtered);
  };

  const openEditModal = (item) => {

    setEditingEvent(item);

    setEditedTitle(item.title);

    setModalVisible(true);
  };

  const saveEdit = () => {

    const updated = events.map((item) => {

      if (item.id === editingEvent.id) {

        return {

          ...item,
          title: editedTitle,

        };
      }

      return item;
    });

    setEvents(updated);

    setModalVisible(false);
  };

  const selectedEvents = events.filter(
    (item) => item.date === selectedDate
  );

  const markedDates = {};

  events.forEach((event) => {

    markedDates[event.date] = {

      marked: true,
      dotColor: "#2563EB",

    };
  });

  if (selectedDate) {

    markedDates[selectedDate] = {

      ...(markedDates[selectedDate] || {}),

      selected: true,
      selectedColor: "#2563EB",

    };
  }

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Calendario
      </Text>

      <Text style={styles.subtitle}>
        Organiza tus eventos
      </Text>

      <View style={styles.calendarContainer}>

        <Calendar

          onDayPress={(day) => {

            setSelectedDate(day.dateString);

          }}

          markedDates={markedDates}

          theme={{

            backgroundColor: "#1E293B",

            calendarBackground: "#1E293B",

            textSectionTitleColor: "#CBD5E1",

            selectedDayBackgroundColor: "#2563EB",

            selectedDayTextColor: "#FFFFFF",

            todayTextColor: "#2563EB",

            dayTextColor: "#FFFFFF",

            textDisabledColor: "#475569",

            monthTextColor: "#FFFFFF",

            arrowColor: "#2563EB",

          }}

        />

      </View>

      <View style={styles.inputContainer}>

        <TextInput
          placeholder="Nuevo evento..."
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={eventText}
          onChangeText={setEventText}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={addEvent}
        >

          <Ionicons
            name="add"
            size={28}
            color="white"
          />

        </TouchableOpacity>

      </View>

      <Text style={styles.eventsTitle}>
        Eventos del día
      </Text>

      {

        selectedEvents.length === 0 && (

          <Text style={styles.emptyText}>
            No hay eventos
          </Text>

        )

      }

      <FlatList
        data={selectedEvents}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (

          <View style={styles.eventCard}>

  <View style={styles.eventInfo}>

  <View style={styles.iconContainer}>

    <Ionicons
      name="calendar-outline"
      size={24}
      color="#2563EB"
    />

  </View>

  <View style={styles.eventTextContainer}>

    <Text style={styles.eventText}>
      {item.title}
    </Text>

    <Text style={styles.eventDate}>
      {item.date}
    </Text>

  </View>

</View>

            <View style={styles.actions}>

              <TouchableOpacity
                onPress={() => openEditModal(item)}
              >

                <Ionicons
                  name="create-outline"
                  size={22}
                  color="#FACC15"
                />

              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => deleteEvent(item.id)}
              >

                <Ionicons
                  name="trash-outline"
                  size={22}
                  color="#EF4444"
                />

              </TouchableOpacity>

            </View>

          </View>

        )}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >

        <View style={styles.modalContainer}>

          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>
              Editar Evento
            </Text>

            <TextInput
              style={styles.modalInput}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Editar evento"
              placeholderTextColor="#CBD5E1"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveEdit}
            >

              <Text style={styles.saveButtonText}>
                Guardar Cambios
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >

              <Text style={styles.cancelButtonText}>
                Cancelar
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
  },

  subtitle: {
    color: "#CBD5E1",
    marginTop: 5,
    marginBottom: 20,
  },

  calendarContainer: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    overflow: "hidden",
  },

  inputContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    backgroundColor: "#1E293B",
    color: "white",
    borderRadius: 14,
    paddingHorizontal: 15,
    marginRight: 10,
    height: 55,
  },

  addButton: {
    width: 55,
    height: 55,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  eventsTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  emptyText: {
    color: "#CBD5E1",
    textAlign: "center",
    marginBottom: 20,
  },

  eventCard: {
  backgroundColor: "#1E293B",
  borderRadius: 20,
  padding: 20,
  marginBottom: 14,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#334155",
},
 
  eventInfo: {
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
},

 eventTextContainer: {
  flex: 1,
  justifyContent: "center",
},

eventText: {
  color: "white",
  fontSize: 17,
  fontWeight: "bold",
},

eventDate: {
  color: "#94A3B8",
  marginTop: 2,
  fontSize: 13,
},

  iconContainer: {
  width: 45,
  justifyContent: "center",
  alignItems: "center",
  },

  actions: {
  flexDirection: "row",
  alignItems: "center",
  gap: 18,
  marginLeft: 15,
},

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  modalContent: {
    width: "90%",
    backgroundColor: "#1E293B",
    padding: 25,
    borderRadius: 20,
  },

  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  modalInput: {
    backgroundColor: "#334155",
    color: "white",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 20,
  },

  saveButton: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  cancelButton: {
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#475569",
    alignItems: "center",
  },

  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },

});
