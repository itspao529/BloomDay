import { View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const check = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setTimeout(() => {
          navigation.replace(token ? "Home" : "Login");
        }, 2000);
      } catch (e) {
        navigation.replace("Login");
      }
    };
    check();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.circle, styles.c1]} />
      <View style={[styles.circle, styles.c2]} />
      <View style={[styles.circle, styles.c3]} />
      <View style={styles.logoCircle}><Text style={styles.logoEmoji}>🌸</Text></View>
      <Text style={styles.logo}>BloomDay</Text>
      <Text style={styles.sub}>Jardín de Niños</Text>
      <View style={styles.dotsRow}>
        <View style={[styles.dot, { backgroundColor: "#FF6B9D" }]} />
        <View style={[styles.dot, { backgroundColor: "#FFD93D" }]} />
        <View style={[styles.dot, { backgroundColor: "#6BCB77" }]} />
      </View>
      <View style={styles.bottomDecor}>
        <Text style={styles.decorEmoji}>🌻</Text>
        <Text style={styles.decorEmoji}>🦋</Text>
        <Text style={styles.decorEmoji}>🌈</Text>
        <Text style={styles.decorEmoji}>⭐</Text>
        <Text style={styles.decorEmoji}>🌺</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBFF", justifyContent: "center", alignItems: "center" },
  circle: { position: "absolute", borderRadius: 999 },
  c1: { width: 250, height: 250, backgroundColor: "#FF6B9D22", top: -80, left: -60 },
  c2: { width: 180, height: 180, backgroundColor: "#FFD93D22", top: 40, right: -40 },
  c3: { width: 150, height: 150, backgroundColor: "#6BCB7722", bottom: 60, left: 20 },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#FF6B9D", justifyContent: "center", alignItems: "center", marginBottom: 16, shadowColor: "#FF6B9D", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10 },
  logoEmoji: { fontSize: 52 },
  logo: { fontSize: 42, fontWeight: "900", color: "#2D2D2D", letterSpacing: -0.5 },
  sub: { fontSize: 16, color: "#AAA", fontWeight: "600", marginTop: 4, marginBottom: 32 },
  dotsRow: { flexDirection: "row", gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  bottomDecor: { position: "absolute", bottom: 40, flexDirection: "row", gap: 16 },
  decorEmoji: { fontSize: 24 },
});
