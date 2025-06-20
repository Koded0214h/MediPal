import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import styles from "@/constants/styles/login-styles";
import { updateProfile, fetchProfile } from "@/src/services/api";

export default function HealthProfile() {
  const router = useRouter();
  const [form, setForm] = useState({
    age: "",
    gender: "",
    location: "",
    existing_conditions: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await fetchProfile();
      console.log('Fetched profile:', profile);
      setForm({
        age: profile.age?.toString() || "",
        gender: profile.gender || "",
        location: profile.location || "",
        existing_conditions: profile.existing_conditions?.join(", ") || "",
      });
    } catch (error) {
      console.log("Error loading profile:", error);
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

    console.log('Submitting profile data:', profileData);
    setLoading(true);
    try {
      const response = await updateProfile(profileData);
      console.log('Profile update response:', response);
      Alert.alert("Success", "Health profile updated successfully");
      router.push("/dashboard");
    } catch (error: any) {
      console.error('Profile update error:', error?.response?.data || error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || 
        (typeof error?.response?.data === 'object' ? JSON.stringify(error?.response?.data) : 'Failed to update profile')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.screenContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>×</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Health Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={{ flex: 1, marginTop: 20 }}>
          {/* Form */}
          <TextInput
            placeholder="Age"
            value={form.age}
            onChangeText={(value) => setForm({ ...form, age: value })}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor={"#263238"}
          />

          <View style={[styles.input, { padding: 0 }]}>
            <Picker
              selectedValue={form.gender}
              onValueChange={(value) => setForm({ ...form, gender: value })}
              style={{ color: "#263238" }}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <TextInput
            placeholder="Location"
            value={form.location}
            onChangeText={(value) => setForm({ ...form, location: value })}
            style={styles.input}
            placeholderTextColor={"#263238"}
          />

          <TextInput
            placeholder="Existing Conditions (comma-separated)"
            value={form.existing_conditions}
            onChangeText={(value) =>
              setForm({ ...form, existing_conditions: value })
            }
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            multiline
            placeholderTextColor={"#263238"}
          />

          <TouchableOpacity
            style={[
              styles.loginButtonContainer,
              { marginTop: 30 },
              loading && { opacity: 0.7 },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.loginButton}>
              {loading ? "Updating..." : "Update Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 