import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import styles from "@/constants/styles/login-styles";

export default function Index() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 50,
        paddingHorizontal: 20,
        backgroundColor: "#f0f0f0",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 700, marginTop: 20 }}>
        Welcome to MediPal 🩺
      </Text>

      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={require("../assets/images/onboarding.png")}
          style={{ width: 300, height: 300 }}
        />
        <Text style={{ fontSize: 18, color: "#666", fontWeight: 500 }}>
          Your personal health savings assistant
        </Text>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#4CAF50",
          width: "100%",
          paddingVertical: 15,
          borderRadius: 20,
        }}
        onPress={() => {
          router.push("/(auth)/login");
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#fff",
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
}
