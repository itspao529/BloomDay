import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {

  const [image, setImage] = useState("https://i.pravatar.cc/300");
  const [name, setName] = useState("Usuario Demo");
  const [email, setEmail] = useState("usuario@email.com");
  const [bio, setBio] = useState("Sin descripción");

  // 📥 Cargar datos guardados
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem("profile");

      if (saved) {
        const data = JSON.parse(saved);
        setName(data.name);
        setEmail(data.email);
        setBio(data.bio);
        setImage(data.image);
      }

    } catch (error) {
      console.log(error);
    }
  };

  // 💾 Guardar perfil
  const saveProfile = async () => {
    try {
      const data = {
        name,
        email,
        bio,
        image,
      };

      await AsyncStorage.setItem("profile", JSON.stringify(data));

      Alert.alert("Listo", "Perfil actualizado correctamente");

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo guardar el perfil");
    }
  };

  // 📸 Cambiar foto
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permiso requerido");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* FOTO */}
      <View style={styles.header}>

        <View style={styles.avatarContainer}>
          <Image source={{ uri: image }} style={styles.avatar} />

          <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
            <Ionicons name="camera" size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* NOMBRE */}
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.inputName}
          placeholderTextColor="#94A3B8"
        />

        {/* EMAIL */}
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.inputEmail}
          placeholderTextColor="#94A3B8"
        />

      </View>

      {/* BIO */}
      <View style={styles.card}>
        <Text style={styles.label}>Bio</Text>

        <TextInput
          value={bio}
          onChangeText={setBio}
          multiline
          style={styles.bioInput}
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* BOTÓN GUARDAR */}
      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Ionicons name="save-outline" size={20} color="white" />
        <Text style={styles.saveText}>Guardar cambios</Text>
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="white" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  content: {
    alignItems: "center",
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },

  avatarContainer: {
    position: "relative",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#2563EB",
  },

  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#2563EB",
    padding: 6,
    borderRadius: 20,
  },

  inputName: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },

  inputEmail: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#1E293B",
    width: "100%",
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
  },

  label: {
    color: "white",
    fontWeight: "600",
    marginBottom: 8,
  },

  bioInput: {
    color: "#CBD5E1",
    minHeight: 80,
    textAlignVertical: "top",
  },

  saveButton: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    width: "100%",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  saveText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },

  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#DC2626",
    width: "100%",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  logoutText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
});
