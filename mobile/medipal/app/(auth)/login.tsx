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
import PhoneInput, { ICountry } from "react-native-international-phone-number";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/constants/styles/login-styles";

export default function Login() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputValue = (phoneNumber: string) => {
    setInputValue(phoneNumber);
  };

  const handleSelectedCountry = (country: ICountry) => {
    setSelectedCountry(country);
  };

  const handleLogin = () => {
    if (!inputValue || !password) {
      Alert.alert("Error", "Please fill all the fields");
    } else {
      setInputValue("");
      setPassword("");
    }
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
                <PhoneInput
                  value={inputValue}
                  onChangePhoneNumber={handleInputValue}
                  selectedCountry={selectedCountry}
                  onChangeSelectedCountry={handleSelectedCountry}
                  defaultCountry="NG"
                  placeholder="Phone Number"
                  placeholderTextColor={"#263238"}
                  phoneInputStyles={{
                    container: {
                      borderWidth: 0,
                    },
                    input: {
                      backgroundColor: "#A5D6A7",
                      paddingHorizontal: 15,
                      paddingVertical: 15,
                      fontSize: 16,
                      fontWeight: 500,
                      borderEndEndRadius: 10,
                      borderTopEndRadius: 10,
                    },
                    flagContainer: {
                      backgroundColor: "#A5D6A7",
                    },
                  }}
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
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="#263238"
                    />
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
