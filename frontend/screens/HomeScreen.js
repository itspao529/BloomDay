import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";

export default function HomeScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [tareasPendientes, setTareasPendientes] = useState(0);
  const [totalEventos, setTotalEventos] = useState(0);
  const [proximosEventos, setProximosEventos] = useState([]);
  const fecha = new Date();
  const dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const fechaTexto = `${dias[fecha.getDay()]} ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const u = await AsyncStorage.getItem("usuario");
      if (u) setUsuario(JSON.parse(u));
      const resTareas = await API.get("/tareas");
      const pendientes = resTareas.data.filter(t => t.estado === "pendiente");
      setTareasPendientes(pendientes.length);
      const resEventos = await API.get("/eventos");
      setTotalEventos(resEventos.data.length);
      setProximosEventos(resEventos.data.slice(0, 2));
    } catch (error) {
      console.log("Error cargando datos:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.saludo}>Hola, {usuario?.nombre || "Usuario"} 🔥</Text>
          <Text style={styles.fecha}>{fechaTexto}</Text>
        </View>
        <Text style={styles.campana}>🔔</Text>
      </View>

      <View style={styles.cards}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Tasks")}>
          <Text style={styles.cardLabel}>Tareas{"\n"}Pendientes.</Text>
          <Text style={styles.cardNum}>{tareasPendientes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Events")}>
          <Text style={styles.cardLabel}>Eventos</Text>
          <Text style={styles.cardNum}>{totalEventos}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>Proximos Eventos</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Events")}>
          <Text style={styles.verTodos}>Ver Todos</Text>
        </TouchableOpacity>
      </View>

      {proximosEventos.length === 0 ? (
        <Text style={styles.vacio}>No hay eventos próximos</Text>
      ) : (
        proximosEventos.map((evento, i) => (
          <View key={i} style={styles.eventoCard}>
            <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
            <Text style={styles.eventoFecha}>
              {evento.fecha ? new Date(evento.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "long" }) : ""} {i === 0 ? "💗" : "✅"}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6EFD6", padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 40, marginBottom: 20 },
  saludo: { fontSize: 22, fontWeight: "bold", color: "#222" },
  fecha: { fontSize: 14, color: "#555", marginTop: 4 },
  campana: { fontSize: 26 },
  cards: { flexDirection: "row", gap: 15, marginBottom: 25 },
  card: { flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: 20, borderWidth: 1, borderColor: "#ddd" },
  cardLabel: { fontSize: 14, color: "#C0392B", fontWeight: "bold", marginBottom: 10 },
  cardNum: { fontSize: 40, fontWeight: "bold", color: "#222" },
  seccion: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  seccionTitulo: { fontSize: 18, fontWeight: "bold", color: "#222" },
  verTodos: { fontSize: 14, color: "#555" },
  eventoCard: { backgroundColor: "#fff", borderRadius: 12, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: "#ddd" },
  eventoTitulo: { fontSize: 17, fontWeight: "bold", color: "#222", marginBottom: 6 },
  eventoFecha: { fontSize: 14, color: "#555" },
  vacio: { textAlign: "center", color: "#888", marginTop: 20 },
});
