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
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PhoneInput from "react-native-international-phone-number";
import { register } from "@/src/services/api";

const { width } = Dimensions.get('window');

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    countryCode: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePhoneChange = (phoneNumber: string, countryCode: string) => {
    setForm({
      ...form,
      phoneNumber,
      countryCode,
    });
  };

  const handleSignUp = async () => {
    if (!form.fullName || !form.email || !form.phoneNumber || !form.password || !form.confirmPassword) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        countryCode: form.countryCode,
        password: form.password,
      });
      Alert.alert("Success", "Account created successfully", [
        { text: "OK", onPress: () => router.replace("/(tabs)/dashboard") }
      ]);
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message || 
        error.message === 'Network Error'
          ? "Unable to connect to server. Please check your internet connection and try again."
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.inner}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={form.fullName}
                  onChangeText={(value) => setForm({ ...form, fullName: value })}
                  editable={!loading}
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={form.email}
                  onChangeText={(value) => setForm({ ...form, email: value })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.phoneContainer}>
                <PhoneInput
                  value={form.phoneNumber}
                  onChangePhoneNumber={handlePhoneChange}
                  defaultCountry="NG"
                  placeholder="Phone Number"
                  disabled={loading}
                  containerStyle={styles.phoneInputContainer}
                  inputStyle={styles.phoneInput}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                  style={[styles.input, { paddingRight: 50 }]}
                    placeholder="Password"
                  value={form.password}
                  onChangeText={(value) => setForm({ ...form, password: value })}
                    secureTextEntry={!showPassword}
                  editable={!loading}
                  placeholderTextColor="#666"
                  />
                  <TouchableOpacity
                  style={styles.showPasswordButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#666"
                    />
                  </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingRight: 50 }]}
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChangeText={(value) => setForm({ ...form, confirmPassword: value })}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                  placeholderTextColor="#666"
                />
                <TouchableOpacity
                  style={styles.showPasswordButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

                  <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
                  </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                  <TouchableOpacity
                  onPress={() => router.back()}
                  disabled={loading}
                >
                  <Text style={styles.loginLink}>Sign In</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  inner: {
    padding: 24,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  phoneContainer: {
    marginBottom: 16,
  },
  phoneInputContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    height: 56,
    borderWidth: 0,
  },
  phoneInput: {
    backgroundColor: "#f5f5f5",
    fontSize: 16,
    color: "#333",
    height: 56,
  },
  showPasswordButton: {
    position: "absolute",
    right: 16,
    height: "100%",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  loginText: {
    color: "#666",
    fontSize: 14,
  },
  loginLink: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
