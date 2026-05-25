import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert("Campos requeridos", "Por favor ingresa tu correo y contraseña."); return; }
    setLoading(true);
    try {
      const data = await login(email, password);
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.usuario));
      navigation.replace("Home");
    } catch (e) {
      Alert.alert("Error", e.response?.data?.mensaje || "Credenciales incorrectas.");
    } finally { setLoading(false); }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topDecor}>
        <View style={[styles.circle, styles.c1]} />
        <View style={[styles.circle, styles.c2]} />
        <View style={[styles.circle, styles.c3]} />
      </View>
      <View style={styles.logoBox}>
        <View style={styles.logoCircle}><Text style={styles.logoEmoji}>🌸</Text></View>
        <Text style={styles.logo}>BloomDay</Text>
        <Text style={styles.subLogo}>Jardín de Niños</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>¡Bienvenido de vuelta! 👋</Text>
        <Text style={styles.cardSub}>Inicia sesión para continuar</Text>
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
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar al Jardín 🌱</Text>}
        </TouchableOpacity>
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>
        <TouchableOpacity style={styles.registerBtn} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>¿Eres nuevo? Crear cuenta</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomDecor}>
        <Text style={styles.decorEmoji}>🌻</Text>
        <Text style={styles.decorEmoji}>🦋</Text>
        <Text style={styles.decorEmoji}>🌈</Text>
        <Text style={styles.decorEmoji}>⭐</Text>
        <Text style={styles.decorEmoji}>🌺</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#FFFBFF", alignItems: "center", paddingBottom: 40 },
  topDecor: { width: "100%", height: 180, position: "relative", marginBottom: -40 },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 200, height: 200, backgroundColor: "#FF6B9D22", top: -80, left: -60 },
  c2: { width: 150, height: 150, backgroundColor: "#FFD93D22", top: -40, right: -30 },
  c3: { width: 120, height: 120, backgroundColor: "#4D96FF22", top: 40, left: 60 },
  logoBox: { alignItems: "center", marginBottom: 28 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#FF6B9D", justifyContent: "center", alignItems: "center", marginBottom: 12, shadowColor: "#FF6B9D", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  logoEmoji: { fontSize: 40 },
  logo: { fontSize: 36, fontWeight: "900", color: "#2D2D2D", letterSpacing: -0.5 },
  subLogo: { fontSize: 14, color: "#AAA", fontWeight: "600", marginTop: 2 },
  card: { width: "90%", backgroundColor: "#fff", borderRadius: 28, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 8 },
  cardTitle: { fontSize: 22, fontWeight: "900", color: "#2D2D2D", marginBottom: 4 },
  cardSub: { fontSize: 14, color: "#AAA", marginBottom: 24 },
  inputBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 14, borderWidth: 1.5, borderColor: "#F0F0F0" },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#2D2D2D", paddingVertical: 12 },
  eyeIcon: { fontSize: 18 },
  button: { backgroundColor: "#FF6B9D", borderRadius: 16, padding: 16, alignItems: "center", marginTop: 8, shadowColor: "#FF6B9D", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "900" },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 20, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#F0F0F0" },
  dividerText: { color: "#CCC", fontWeight: "700" },
  registerBtn: { backgroundColor: "#F8F8F8", borderRadius: 16, padding: 14, alignItems: "center" },
  registerText: { color: "#FF6B9D", fontSize: 15, fontWeight: "700" },
  bottomDecor: { flexDirection: "row", gap: 16, marginTop: 32 },
  decorEmoji: { fontSize: 24 },
});
