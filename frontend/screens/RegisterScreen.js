import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen({ navigation }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {

    navigation.navigate("Login");

  };

  return (

    <ScrollView
      contentContainerStyle={styles.container}
    >

      <View style={styles.card}>

        <Text style={styles.title}>
          Crear Cuenta
        </Text>

        <Text style={styles.subtitle}>
          Regístrate para comenzar
        </Text>

        <View style={styles.inputContainer}>

          <Ionicons
            name="person-outline"
            size={22}
            color="#666"
          />

          <TextInput
            placeholder="Nombre completo"
            placeholderTextColor="#888"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

        </View>

        <View style={styles.inputContainer}>

          <Ionicons
            name="mail-outline"
            size={22}
            color="#666"
          />

          <TextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#888"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

        </View>

        <View style={styles.inputContainer}>

          <Ionicons
            name="lock-closed-outline"
            size={22}
            color="#666"
          />

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
          onPress={handleRegister}
        >

          <Text style={styles.buttonText}>
            Registrarse
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
        >

          <Text style={styles.loginText}>
            ¿Ya tienes cuenta? Inicia sesión
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
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

  loginText: {
    textAlign: "center",
    marginTop: 20,
    color: "#2563EB",
    fontWeight: "600",
  },

});
