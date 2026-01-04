import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../constants/config';

const api = axios.create({
    baseURL: CONFIG.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle 401 Unauthorized globally if needed (e.g., logout)
        if (error.response && error.response.status === 401) {
            // Optional: Clear storage and redirect to login
            // await AsyncStorage.removeItem('auth_token');
            // await AsyncStorage.removeItem('user_data');
        }
        return Promise.reject(error);
    }
);

export default api;
