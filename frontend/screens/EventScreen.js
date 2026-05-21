import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
} from "react-native";

import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";

export default function EventScreen() {

  const [event, setEvent] = useState("");

  const [events, setEvents] = useState([

    {
      id: "1",
      title: "Reunión de Proyecto",
      date: "2026-05-20",
    },

    {
      id: "2",
      title: "Entrega Final",
      date: "2026-05-25",
    },

  ]);

  const [editingEvent, setEditingEvent] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const [editedTitle, setEditedTitle] = useState("");

  const addEvent = () => {

    if (!event.trim()) return;

    const newEvent = {

      id: Date.now().toString(),
      title: event,
      date: new Date().toISOString().split("T")[0],

    };

    setEvents([newEvent, ...events]);

    setEvent("");
  };

  const deleteEvent = (id) => {

    const filteredEvents = events.filter(
      (item) => item.id !== id
    );

    setEvents(filteredEvents);
  };

  const openEditModal = (item) => {

    setEditingEvent(item);

    setEditedTitle(item.title);

    setModalVisible(true);
  };

  const saveEdit = () => {

    const updatedEvents = events.map((item) => {

      if (item.id === editingEvent.id) {

        return {

          ...item,
          title: editedTitle,

        };
      }

      return item;
    });

    setEvents(updatedEvents);

    setModalVisible(false);
  };

  const renderItem = ({ item }) => (

    <View style={styles.eventCard}>

      <View style={styles.eventInfo}>

        <Ionicons
          name="calendar-outline"
          size={28}
          color="#2563EB"
        />

        <View style={styles.textContainer}>

          <Text style={styles.eventTitle}>
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
            size={24}
            color="#FACC15"
          />

        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteEvent(item.id)}
        >

          <Ionicons
            name="trash-outline"
            size={24}
            color="#EF4444"
          />

        </TouchableOpacity>

      </View>

    </View>
  );

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Eventos
      </Text>

      <View style={styles.inputContainer}>

        <TextInput
          placeholder="Nuevo evento..."
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={event}
          onChangeText={setEvent}
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

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
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

    </View>
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
    marginBottom: 20,
    marginTop: 20,
  },

  inputContainer: {
    flexDirection: "row",
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

  eventCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  eventInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  textContainer: {
    marginLeft: 15,
  },

  eventTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  eventDate: {
    color: "#CBD5E1",
    marginTop: 4,
  },

  actions: {
    flexDirection: "row",
    gap: 15,
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
