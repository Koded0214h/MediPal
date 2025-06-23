import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configure base URL based on platform
const getBaseURL = () => {
  // Check if we're running on web
  if (typeof window !== 'undefined') {
    return 'http://localhost:8000/api/';  // Web
  }
  
  // React Native platforms
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api/';  // Android emulator
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:8000/api/';  // iOS simulator
  }
  return 'http://localhost:8000/api/';    // Default fallback
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Attach token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Token ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error attaching token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., token expired)
      await AsyncStorage.removeItem('token');
      // You might want to redirect to login screen here
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = async (email, password) => {
  try {
    const response = await api.post('login/', { email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const register = async (userData) => {
  const response = await api.post('register/', userData);
  if (response.data.token) {
    await AsyncStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = async () => {
  await api.post('logout/');
  await AsyncStorage.removeItem('token');
};

// Profile
export const fetchProfile = async () => {
  const response = await api.get('health-profile/');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.post('health-profile/', profileData);
  return response.data;
};

// Dashboard
export const fetchDashboard = async () => {
  const response = await api.get('dashboard/');
  return response.data;
};

// Wallet
export const fetchWallet = async () => {
  const response = await api.get('wallet/');
  return response.data;
};

export const topUpWallet = async (amount) => {
  const response = await api.post('wallet/topup/', { amount });
  return response.data;
};

// Contact
export const sendContactMessage = async (messageData) => {
  const response = await api.post('contact/', messageData);
  return response.data;
};

export default api;
