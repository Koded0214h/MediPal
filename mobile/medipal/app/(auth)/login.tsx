import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import styles from "@/constants/styles/login-styles";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    // Temporarily disable backend connection
    Alert.alert("Info", "Login functionality is currently disabled.");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.screenContainer}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ fontSize: 30, fontWeight: "bold" }}>×</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>Login</Text>
            <View style={{ width: 24 }}></View>
          </View>

          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View>
              {/* Form */}
              <View style={{ marginBottom: 10 }}>
                <TextInput
                  placeholder="Email"
                  style={[styles.input, { marginTop: 20 }]}
                  placeholderTextColor={"#263238"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <View style={{ position: "relative" }}>
                  <TextInput
                    placeholder="Password"
                    style={[styles.input, { marginTop: 20 }]}
                    placeholderTextColor={"#263238"}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 15,
                      top: 35,
                    }}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={{ color: "#263238" }}>
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={{ marginBottom: 30, maxWidth: "50%" }}>
                <Text
                  style={{ textDecorationLine: "underline", color: "#263238" }}
                >
                  Forgot password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButtonContainer}
                onPress={handleLogin}
              >
                <Text style={styles.loginButton}>Login</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                router.push("/(auth)/signup");
              }}
            >
              <Text
                style={{
                  textDecorationLine: "underline",
                  color: "#263238",
                  textAlign: "center",
                }}
              >
                Don't have an account? Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
