import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import PhoneInput, { ICountry } from "react-native-international-phone-number";
import styles from "@/constants/styles/login-styles";
import { Ionicons } from "@expo/vector-icons";

export default function Signup() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"patient" | "provider" | null>(null);

  const handleInputValue = (phoneNumber: string) => {
    setInputValue(phoneNumber);
  };

  const handleSelectedCountry = (country: ICountry) => {
    setSelectedCountry(country);
  };

  const handleSignUp = () => {
    if (!fullName || !email || !inputValue || !password || !role) {
      Alert.alert("Error", "Please fill all the fields");
    } else {
      setFullName("");
      setEmail("");
      setInputValue("");
      setPassword("");
      setRole(null);
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
            <Text style={styles.headerText}>Sign up</Text>
            <View style={{ width: 24 }}></View>
          </View>

          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View>
              {/* Form */}
              <View style={{ marginBottom: 20 }}>
                <TextInput
                  placeholder="Full Name"
                  style={styles.input}
                  placeholderTextColor={"#263238"}
                  value={fullName}
                  onChangeText={setFullName}
                />
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  placeholderTextColor={"#263238"}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
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

              {/* Role */}
              <View>
                <Text
                  style={{
                    color: "#263238",
                    fontSize: 20,
                    fontWeight: 600,
                    marginBottom: 30,
                  }}
                >
                  Role
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    maxWidth: "50%",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setRole("patient")}
                    style={[
                      styles.roleButton,
                      role === "patient" && {
                        backgroundColor: "#4CAF50",
                        borderWidth: 0,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleText,
                        role === "patient" && { color: "#fff" },
                      ]}
                    >
                      Patient
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setRole("provider")}
                    style={[
                      styles.roleButton,
                      role === "provider" && {
                        backgroundColor: "#4CAF50",
                        borderWidth: 0,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleText,
                        role === "provider" && { color: "#fff" },
                      ]}
                    >
                      Provider
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.loginButtonContainer}
              onPress={handleSignUp}
            >
              <Text style={styles.loginButton}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
