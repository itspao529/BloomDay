import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView,
} from "react-native";
import { useState } from "react";
import { register } from "../services/authService";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [rol, setRol] = useState("usuario");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !email || !password || !confirmar) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    if (password !== confirmar) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    try {
      setLoading(true);
      await register(nombre, email, password, rol);
      Alert.alert("Éxito", "Cuenta creada exitosamente");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>BloomDay</Text>
      <Text style={styles.flower}>🌸🌸</Text>
      <Text style={styles.titulo}>Registro de Cuenta</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholderTextColor="#aaa" />

        <Text style={styles.label}>Correo Electronico</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor="#aaa" />

        <Text style={styles.label}>Tipo de usuario</Text>
        <View style={styles.rolContainer}>
          <TouchableOpacity
            style={[styles.rolButton, rol === "usuario" && styles.rolActive]}
            onPress={() => setRol("usuario")}
          >
            <Text style={[styles.rolText, rol === "usuario" && styles.rolTextActive]}>Padre</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rolButton, rol === "admin" && styles.rolActive]}
            onPress={() => setRol("admin")}
          >
            <Text style={[styles.rolText, rol === "admin" && styles.rolTextActive]}>Docente</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Contraseña</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#aaa" />

        <Text style={styles.label}>Confirmar Contraseña</Text>
        <TextInput style={styles.input} value={confirmar} onChangeText={setConfirmar} secureTextEntry placeholderTextColor="#aaa" />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Cargando..." : "Registrarse"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>
            Ya tienes cuenta? <Text style={styles.loginLink}>Iniciar Sesión</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F6EFD6",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#C0392B",
    fontStyle: "italic",
    marginBottom: 5,
  },
  flower: {
    fontSize: 36,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 20,
    color: "#333",
    marginBottom: 20,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 5,
  },
  rolContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 5,
  },
  rolButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#7DBE7A",
    alignItems: "center",
  },
  rolActive: {
    backgroundColor: "#7DBE7A",
  },
  rolText: {
    color: "#7DBE7A",
    fontWeight: "bold",
  },
  rolTextActive: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#7DBE7A",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    textAlign: "center",
    color: "#333",
    fontSize: 15,
    marginTop: 5,
  },
  loginLink: {
    color: "#2563EB",
    fontWeight: "bold",
  },
});
