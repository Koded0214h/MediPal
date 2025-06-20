import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { register } from '../services/api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    country: '',
    countryCode: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        country: form.country,
        countryCode: form.countryCode,
        password: form.password,
      });
      navigation.replace('Dashboard');
    } catch (error: any) {
      Alert.alert('Registration Failed', error?.response?.data?.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput placeholder="Full Name" value={form.fullName} onChangeText={v => handleChange('fullName', v)} style={styles.input} />
      <TextInput placeholder="Email" value={form.email} onChangeText={v => handleChange('email', v)} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
      <TextInput placeholder="Phone Number" value={form.phoneNumber} onChangeText={v => handleChange('phoneNumber', v)} keyboardType="phone-pad" style={styles.input} />
      <TextInput placeholder="Country" value={form.country} onChangeText={v => handleChange('country', v)} style={styles.input} />
      <TextInput placeholder="Country Code" value={form.countryCode} onChangeText={v => handleChange('countryCode', v)} style={styles.input} />
      <TextInput placeholder="Password" value={form.password} onChangeText={v => handleChange('password', v)} secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirm Password" value={form.confirmPassword} onChangeText={v => handleChange('confirmPassword', v)} secureTextEntry style={styles.input} />
      <Button title={loading ? "Registering..." : "Register"} onPress={handleRegister} disabled={loading} />
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  link: { color: '#007bff', marginTop: 16, textAlign: 'center' },
});

export default RegisterScreen; 