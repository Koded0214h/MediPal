import api from './api';

/**
 * Example function to login a user using the Django backend API.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Response data containing token and user info
 */
export async function loginUser(email, password) {
  try {
    const response = await api.post('login/', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    throw error;
  }
}
