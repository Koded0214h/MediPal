import api from './axios';

// Test API connection
export const testApiConnection = async () => {
  try {
    const response = await api.get('/');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// Auth functions
export const loginUser = async (credentials) => {
  const response = await api.post('/login/', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/register/', userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/logout/');
  return response.data;
};

// Dashboard
export const getDashboardData = async () => {
  const response = await api.get('/dashboard/');
  return response.data;
};

// Health Profile
export const getHealthProfile = async () => {
  const response = await api.get('/health-profile/');
  return response.data;
};

export const updateHealthProfile = async (profileData) => {
  const response = await api.put('/health-profile/', profileData);
  return response.data;
};

// Wallet
export const getWalletDetails = async () => {
  const response = await api.get('/wallet/');
  return response.data;
};

export const topUpWallet = async (amount) => {
  const response = await api.post('/wallet/topup/', { amount });
  return response.data;
};

// Contact
export const sendContactMessage = async (messageData) => {
  const response = await api.post('/contact/', messageData);
  return response.data;
}; 