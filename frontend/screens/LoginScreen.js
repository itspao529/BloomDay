import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";

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
      console.log(error);
      Alert.alert("Error", "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={22} color="#666" />
          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#888"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={22} color="#666" />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>
            ¿No tienes cuenta? Registrarse
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0F172A",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 55,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#000",
  },
  button: {
    backgroundColor: "#2563EB",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#2563EB",
    fontWeight: "600",
  },
});