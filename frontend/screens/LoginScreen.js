import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rol, setRol] = useState("admin");

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert("¡Ups!", "Completa todos los campos 📝"); return; }
    try {
      setLoading(true);
      const res = await login(email, password);
      await AsyncStorage.setItem("token", res.token);
      await AsyncStorage.setItem("user", JSON.stringify(res.usuario));
      navigation.replace("Home");
    } catch (e) { Alert.alert("¡Ups!", "Correo o contraseña incorrectos 🙈"); }
    finally { setLoading(false); }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={[styles.circle, styles.c1]} /><View style={[styles.circle, styles.c2]} />
      <View style={styles.logoCircle}><Text style={styles.logoEmoji}>🌸</Text></View>
      <Text style={styles.logo}>BloomDay</Text>
      <Text style={styles.subLogo}>Salón Kinder</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>¡Bienvenid@! 👋</Text>
        <Text style={styles.cardSub}>Ingresa para continuar</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputIcon}>✉️</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="correo@ejemplo.com" placeholderTextColor="#BBB" />
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.inputIcon}>🔑</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" placeholderTextColor="#BBB" />
        </View>
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>¿Quién eres?</Text>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.roleGrid}>
          <TouchableOpacity
            style={[styles.roleBtn, rol === "admin" && { borderColor: "#FF6B9D", backgroundColor: "#FF6B9D15" }]}
            onPress={() => setRol("admin")}
          >
            <Text style={styles.roleEmoji}>👩‍🏫</Text>
            <Text style={styles.roleLabel}>Soy Maestra</Text>
            <View style={[styles.roleDot, { backgroundColor: rol === "admin" ? "#FF6B9D" : "#EEE" }]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, rol === "usuario" && { borderColor: "#6BCB77", backgroundColor: "#6BCB7715" }]}
            onPress={() => setRol("usuario")}
          >
            <Text style={styles.roleEmoji}>👨‍👩‍👧</Text>
            <Text style={styles.roleLabel}>Soy Papá/Mamá</Text>
            <View style={[styles.roleDot, { backgroundColor: rol === "usuario" ? "#6BCB77" : "#EEE" }]} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Entrando..." : "¡Entrar al Salón! 🚀"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerBtn} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>¿Primera vez? Crear cuenta</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomDecor}>
        <Text style={styles.decorEmoji}>🌻</Text>
        <Text style={styles.decorEmoji}>🦋</Text>
        <Text style={styles.decorEmoji}>⭐</Text>
        <Text style={styles.decorEmoji}>🌺</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#FFFBFF", alignItems: "center", justifyContent: "center", padding: 24 },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 220, height: 220, backgroundColor: "#FF6B9D15", top: -60, right: -60 },
  c2: { width: 160, height: 160, backgroundColor: "#FFD93D15", bottom: 80, left: -40 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#FF6B9D", justifyContent: "center", alignItems: "center", marginBottom: 12, shadowColor: "#FF6B9D", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  logoEmoji: { fontSize: 40 },
  logo: { fontSize: 36, fontWeight: "900", color: "#2D2D2D", letterSpacing: -0.5 },
  subLogo: { fontSize: 14, color: "#AAA", fontWeight: "600", marginTop: 2 },
  card: { width: "100%", backgroundColor: "#fff", borderRadius: 28, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 8, marginTop: 20 },
  cardTitle: { fontSize: 22, fontWeight: "900", color: "#2D2D2D", marginBottom: 4 },
  cardSub: { fontSize: 14, color: "#AAA", marginBottom: 24 },
  inputBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 14, borderWidth: 1.5, borderColor: "#F0F0F0" },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#2D2D2D", paddingVertical: 12 },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 20, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#F0F0F0" },
  dividerText: { color: "#CCC", fontWeight: "700", fontSize: 12 },
  roleGrid: { flexDirection: "row", gap: 12, marginBottom: 20 },
  roleBtn: { flex: 1, borderWidth: 2, borderColor: "#F0F0F0", borderRadius: 20, padding: 16, alignItems: "center", backgroundColor: "#F8F8F8" },
  roleEmoji: { fontSize: 32, marginBottom: 6 },
  roleLabel: { fontSize: 13, fontWeight: "700", color: "#888" },
  roleDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  button: { backgroundColor: "#FF6B9D", borderRadius: 16, padding: 16, alignItems: "center", marginTop: 8, shadowColor: "#FF6B9D", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "900" },
  registerBtn: { backgroundColor: "#F8F8F8", borderRadius: 16, padding: 14, alignItems: "center", marginTop: 12 },
  registerText: { color: "#FF6B9D", fontSize: 15, fontWeight: "700" },
  bottomDecor: { flexDirection: "row", gap: 16, marginTop: 32 },
  decorEmoji: { fontSize: 24 },
});
