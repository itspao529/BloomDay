import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function GaleriaScreen() {
  const [fotos, setFotos] = useState([]);
  const agregarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") { Alert.alert("¡Ups!", "Necesitamos permiso para acceder a tus fotos"); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    if (!result.canceled) { setFotos(prev => [...prev, { id: Date.now().toString(), uri: result.assets[0].uri }]); }
  };
  const eliminarFoto = (id) => { Alert.alert("¿Eliminar?", "¿Quieres eliminar esta foto?", [{ text: "No", style: "cancel" }, { text: "Sí", style: "destructive", onPress: () => setFotos(prev => prev.filter(f => f.id !== id)) }]); };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.circle, styles.c1]} />
        <Text style={styles.titulo}>🖼️ Galería</Text>
        <Text style={styles.subtitulo}>Momentos del Salón</Text>
        <TouchableOpacity style={styles.addBtn} onPress={agregarFoto}><Text style={styles.addBtnText}>📸</Text></TouchableOpacity>
      </View>
      {fotos.length === 0 ? (
        <View style={styles.vacioBox}>
          <Text style={styles.vacioEmoji}>📷</Text>
          <Text style={styles.vacioText}>No hay fotos todavía</Text>
          <Text style={styles.vacioSub}>Toca el botón para agregar momentos del salón</Text>
          <TouchableOpacity style={styles.vacioBtn} onPress={agregarFoto}><Text style={styles.vacioBtnText}>📸 Agregar Foto</Text></TouchableOpacity>
        </View>
      ) : (
        <FlatList data={fotos} keyExtractor={item => item.id} numColumns={2} contentContainerStyle={{ padding: 20, gap: 14 }} columnWrapperStyle={{ gap: 14 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.fotoCard} onLongPress={() => eliminarFoto(item.id)}>
              <Image source={{ uri: item.uri }} style={styles.foto} />
              <View style={styles.fotoOverlay}><Text style={styles.fotoHint}>Mantén para eliminar</Text></View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBFF" },
  header: { backgroundColor: "#4D96FF", borderBottomLeftRadius: 32, borderBottomRightRadius: 32, padding: 24, paddingTop: 56, paddingBottom: 28, overflow: "hidden" },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 150, height: 150, backgroundColor: "#ffffff20", top: -50, right: -30 },
  titulo: { fontSize: 28, fontWeight: "900", color: "#fff" },
  subtitulo: { fontSize: 13, color: "#ffffff99", marginTop: 2 },
  addBtn: { position: "absolute", top: 52, right: 24, backgroundColor: "#ffffff30", width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  addBtnText: { fontSize: 22 },
  vacioBox: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  vacioEmoji: { fontSize: 72, marginBottom: 16 },
  vacioText: { fontSize: 18, fontWeight: "900", color: "#2D2D2D", marginBottom: 6 },
  vacioSub: { fontSize: 13, color: "#AAA", textAlign: "center", marginBottom: 24 },
  vacioBtn: { backgroundColor: "#4D96FF", borderRadius: 16, paddingHorizontal: 24, paddingVertical: 14, shadowColor: "#4D96FF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  vacioBtnText: { color: "#fff", fontWeight: "900", fontSize: 15 },
  fotoCard: { flex: 1, borderRadius: 18, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  foto: { width: "100%", height: 160 },
  fotoOverlay: { backgroundColor: "rgba(0,0,0,0.2)", padding: 6, alignItems: "center" },
  fotoHint: { fontSize: 10, color: "#fff", fontWeight: "700" },
});
