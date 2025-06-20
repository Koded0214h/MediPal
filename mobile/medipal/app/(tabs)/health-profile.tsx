import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { updateProfile, fetchProfile } from "@/src/services/api";

export default function HealthProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    age: "",
    gender: "",
    location: "",
    existing_conditions: "",
  });

  const loadProfile = async () => {
    try {
      const profile = await fetchProfile();
      setForm({
        age: profile.age?.toString() || "",
        gender: profile.gender || "",
        location: profile.location || "",
        existing_conditions: profile.existing_conditions?.join(", ") || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.gender || !form.location) {
      Alert.alert("Error", "Gender and location are required");
      return;
    }

    const profileData = {
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender,
      location: form.location,
      existing_conditions: form.existing_conditions
        ? form.existing_conditions.split(",").map((c) => c.trim())
        : [],
    };

    setSaving(true);
    try {
      await updateProfile(profileData);
      Alert.alert("Success", "Health profile updated successfully");
      router.push("/(tabs)/dashboard");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Health Profile</Text>
          <Text style={styles.subtitle}>Complete your health information</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={form.age}
            onChangeText={(value) => setForm({ ...form, age: value })}
            keyboardType="numeric"
            editable={!saving}
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.gender}
              onValueChange={(value) => setForm({ ...form, gender: value })}
              enabled={!saving}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Location"
            value={form.location}
            onChangeText={(value) => setForm({ ...form, location: value })}
            editable={!saving}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Existing Conditions (comma-separated)"
            value={form.existing_conditions}
            onChangeText={(value) =>
              setForm({ ...form, existing_conditions: value })
            }
            multiline
            numberOfLines={4}
            editable={!saving}
          />

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    padding: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
}); 