import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { fetchDashboard, logout } from '../services/api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dashboardData = await fetchDashboard();
        setData(dashboardData);
      } catch (error: any) {
        Alert.alert('Error', error?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  if (loading) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.section}>Welcome, {data?.user?.fullName || 'User'}!</Text>
      <Text style={styles.section}>Email: {data?.user?.email}</Text>
      <Text style={styles.section}>Wallet Balance: ₦{data?.profile?.balance || '0.00'}</Text>
      {/* Add more dashboard info as needed */}
      <Button title="Logout" onPress={handleLogout} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  section: { fontSize: 18, marginBottom: 12 },
  loading: { flex: 1, textAlign: 'center', marginTop: 100, fontSize: 20 },
});

export default DashboardScreen; 