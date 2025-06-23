import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://medipal-kx8d.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Debug logging
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'https://medipal-kx8d.onrender.com/api');

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        console.log('Making API request to:', config.url);
        console.log('Full URL:', config.baseURL + config.url);
        console.log('Request data:', config.data);
        
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
            console.log('Token attached to request:', token);
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => {
        console.log('API response received:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('API response error:', error.response?.status, error.response?.data);
        console.error('Error details:', error.message);
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 