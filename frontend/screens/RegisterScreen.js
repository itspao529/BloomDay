import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { register } from "../services/authService";

const ROLES = [
  { key: "maestro", label: "Maestra", emoji: "👩‍🏫", color: "#FF6B9D" },
  { key: "padre", label: "Padre/Madre", emoji: "👨‍👩‍👧", color: "#4D96FF" },
];

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("padre");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !email || !password) { Alert.alert("Campos requeridos", "Por favor completa todos los campos."); return; }
    setLoading(true);
    try {
      const data = await register(nombre, email, password, rol);
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.usuario));
      navigation.replace("Home");
    } catch (e) {
      Alert.alert("Error", e.response?.data?.mensaje || "No se pudo registrar.");
    } finally { setLoading(false); }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topDecor}>
        <View style={[styles.circle, styles.c1]} />
        <View style={[styles.circle, styles.c2]} />
      </View>
      <View style={styles.logoBox}>
        <View style={styles.logoCircle}><Text style={styles.logoEmoji}>🌱</Text></View>
        <Text style={styles.logo}>Crear Cuenta</Text>
        <Text style={styles.subLogo}>Únete a BloomDay</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>¿Quién eres? 🌟</Text>
        <View style={styles.roleGrid}>
          {ROLES.map((r) => (
            <TouchableOpacity key={r.key} style={[styles.roleBtn, rol === r.key && { borderColor: r.color, backgroundColor: r.color + "15" }]} onPress={() => setRol(r.key)}>
              <Text style={styles.roleEmoji}>{r.emoji}</Text>
              <Text style={[styles.roleLabel, rol === r.key && { color: r.color }]}>{r.label}</Text>
              {rol === r.key && <View style={[styles.roleDot, { backgroundColor: r.color }]} />}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.inputIcon}>👤</Text>
          <TextInput style={styles.input} placeholder="Nombre completo" placeholderTextColor="#BBB" value={nombre} onChangeText={setNombre} />
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.inputIcon}>✉️</Text>
          <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor="#BBB" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#BBB" value={password} onChangeText={setPassword} secureTextEntry={!showPass} />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Text style={styles.eyeIcon}>{showPass ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Unirme a BloomDay 🌸</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomDecor}>
        <Text style={styles.decorEmoji}>🌸</Text>
        <Text style={styles.decorEmoji}>⭐</Text>
        <Text style={styles.decorEmoji}>🦋</Text>
        <Text style={styles.decorEmoji}>🌻</Text>
        <Text style={styles.decorEmoji}>🌈</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#FFFBFF", alignItems: "center", paddingBottom: 40 },
  topDecor: { width: "100%", height: 160, position: "relative", marginBottom: -30 },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 180, height: 180, backgroundColor: "#6BCB7722", top: -70, right: -40 },
  c2: { width: 140, height: 140, backgroundColor: "#4D96FF22", top: -20, left: -30 },
  logoBox: { alignItems: "center", marginBottom: 24 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#6BCB77", justifyContent: "center", alignItems: "center", marginBottom: 12, shadowColor: "#6BCB77", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  logoEmoji: { fontSize: 40 },
  logo: { fontSize: 32, fontWeight: "900", color: "#2D2D2D" },
  subLogo: { fontSize: 14, color: "#AAA", fontWeight: "600", marginTop: 2 },
  card: { width: "90%", backgroundColor: "#fff", borderRadius: 28, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 8 },
  cardTitle: { fontSize: 20, fontWeight: "900", color: "#2D2D2D", marginBottom: 16 },
  roleGrid: { flexDirection: "row", gap: 12, marginBottom: 20 },
  roleBtn: { flex: 1, borderWidth: 2, borderColor: "#F0F0F0", borderRadius: 20, padding: 16, alignItems: "center", backgroundColor: "#F8F8F8" },
  roleEmoji: { fontSize: 32, marginBottom: 6 },
  roleLabel: { fontSize: 13, fontWeight: "700", color: "#888" },
  roleDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  inputBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 14, borderWidth: 1.5, borderColor: "#F0F0F0" },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#2D2D2D", paddingVertical: 12 },
  eyeIcon: { fontSize: 18 },
  button: { backgroundColor: "#6BCB77", borderRadius: 16, padding: 16, alignItems: "center", marginTop: 8, shadowColor: "#6BCB77", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "900" },
  loginBtn: { backgroundColor: "#F8F8F8", borderRadius: 16, padding: 14, alignItems: "center", marginTop: 12 },
  loginText: { color: "#6BCB77", fontSize: 15, fontWeight: "700" },
  bottomDecor: { flexDirection: "row", gap: 16, marginTop: 28 },
  decorEmoji: { fontSize: 24 },
});
