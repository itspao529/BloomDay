import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useState } from "react";
import { register } from "../services/authService";

const ROLES = [
  { value: "admin", emoji: "👩‍🏫", label: "Soy Maestra", color: "#FF6B9D" },
  { value: "usuario", emoji: "👨‍👩‍👧", label: "Soy Papá/Mamá", color: "#6BCB77" }
];

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("admin");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !email || !password) { Alert.alert("¡Ups!", "Completa todos los campos 📝"); return; }
    try {
      setLoading(true);
      await register(nombre, email, password, rol);
      Alert.alert("¡Listo!", "Cuenta creada exitosamente 🎉");
      navigation.replace("Login");
    } catch (e) { Alert.alert("Error", "No se pudo crear la cuenta"); }
    finally { setLoading(false); }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={[styles.circle, styles.c1]} /><View style={[styles.circle, styles.c2]} />
      <View style={styles.logoCircle}><Text style={styles.logoEmoji}>🌸</Text></View>
      <Text style={styles.logo}>BloomDay</Text>
      <Text style={styles.subLogo}>Crear Cuenta</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>¡Únete al Salón! 🎉</Text>
        {[
          { icon: "👤", placeholder: "Nombre completo", value: nombre, onChange: setNombre },
          { icon: "✉️", placeholder: "correo@ejemplo.com", value: email, onChange: setEmail, email: true },
          { icon: "🔑", placeholder: "Contraseña", value: password, onChange: setPassword, secure: true }
        ].map((f, i) => (
          <View key={i} style={styles.inputBox}>
            <Text style={styles.inputIcon}>{f.icon}</Text>
            <TextInput style={styles.input} placeholder={f.placeholder} value={f.value} onChangeText={f.onChange} autoCapitalize="none" keyboardType={f.email ? "email-address" : "default"} secureTextEntry={f.secure} placeholderTextColor="#BBB" />
          </View>
        ))}
        <View style={styles.roleGrid}>
          {ROLES.map(r => (
            <TouchableOpacity key={r.value} style={[styles.roleBtn, rol === r.value && { borderColor: r.color, backgroundColor: r.color + "15" }]} onPress={() => setRol(r.value)}>
              <Text style={styles.roleEmoji}>{r.emoji}</Text>
              <Text style={styles.roleLabel}>{r.label}</Text>
              <View style={[styles.roleDot, { backgroundColor: rol === r.value ? r.color : "#EEE" }]} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Creando cuenta..." : "¡Crear Cuenta! 🚀"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomDecor}>
        <Text style={styles.decorEmoji}>🌻</Text><Text style={styles.decorEmoji}>🦋</Text><Text style={styles.decorEmoji}>⭐</Text><Text style={styles.decorEmoji}>🌺</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#FFFBFF", alignItems: "center", justifyContent: "center", padding: 24 },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 220, height: 220, backgroundColor: "#6BCB7715", top: -60, right: -60 },
  c2: { width: 160, height: 160, backgroundColor: "#FFD93D15", bottom: 80, left: -40 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#FF6B9D", justifyContent: "center", alignItems: "center", marginBottom: 12, shadowColor: "#FF6B9D", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  logoEmoji: { fontSize: 40 },
  logo: { fontSize: 32, fontWeight: "900", color: "#2D2D2D" },
  subLogo: { fontSize: 14, color: "#AAA", fontWeight: "600", marginTop: 2 },
  card: { width: "100%", backgroundColor: "#fff", borderRadius: 28, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 8, marginTop: 20 },
  cardTitle: { fontSize: 20, fontWeight: "900", color: "#2D2D2D", marginBottom: 16 },
  inputBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 14, borderWidth: 1.5, borderColor: "#F0F0F0" },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#2D2D2D", paddingVertical: 12 },
  roleGrid: { flexDirection: "row", gap: 12, marginBottom: 20 },
  roleBtn: { flex: 1, borderWidth: 2, borderColor: "#F0F0F0", borderRadius: 20, padding: 16, alignItems: "center", backgroundColor: "#F8F8F8" },
  roleEmoji: { fontSize: 32, marginBottom: 6 },
  roleLabel: { fontSize: 13, fontWeight: "700", color: "#888" },
  roleDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  button: { backgroundColor: "#6BCB77", borderRadius: 16, padding: 16, alignItems: "center", marginTop: 8, shadowColor: "#6BCB77", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "900" },
  loginBtn: { backgroundColor: "#F8F8F8", borderRadius: 16, padding: 14, alignItems: "center", marginTop: 12 },
  loginText: { color: "#6BCB77", fontSize: 15, fontWeight: "700" },
  bottomDecor: { flexDirection: "row", gap: 16, marginTop: 28 },
  decorEmoji: { fontSize: 24 },
});
