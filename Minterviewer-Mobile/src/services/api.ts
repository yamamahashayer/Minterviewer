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
        // Handle 401 Unauthorized globally - clear auth data
        if (error.response && error.response.status === 401) {
            console.log('Token expired or invalid, clearing auth data');
            await AsyncStorage.multiRemove(['auth_token', 'user_data']);
            delete api.defaults.headers.Authorization;
        }
        return Promise.reject(error);
    }
);

export default api;
