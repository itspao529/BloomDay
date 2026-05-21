import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }) {

  useEffect(() => {

    checkLogin();

  }, []);

  const checkLogin = async () => {

    const token = await AsyncStorage.getItem(
      "token"
    );

    setTimeout(() => {

      if (token) {

        navigation.replace("Home");

      } else {

        navigation.replace("Login");

      }

    }, 2000);
  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Mi Aplicación
      </Text>

      <ActivityIndicator
        size="large"
        color="#2563EB"
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },

});
