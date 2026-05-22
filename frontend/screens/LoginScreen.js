import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
} from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    try {
      setLoading(true);
      const res = await login(email, password);
      await AsyncStorage.setItem("token", res.token);
      await AsyncStorage.setItem("usuario", JSON.stringify(res.usuario));
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Error", "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>BloomDay</Text>
      <Text style={styles.flower}>🌸🌸🌸</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Correo Electronico</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#aaa"
        />
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>Crear Cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 40,
    marginBottom: 40,
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
  registerText: {
    textAlign: "center",
    color: "#333",
    fontSize: 16,
    marginTop: 5,
  },
});
