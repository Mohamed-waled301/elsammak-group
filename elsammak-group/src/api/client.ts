import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
 baseURL: API_BASE_URL,
 headers: {
 'Content-Type': 'application/json',
 },
 timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
 // Hook for adding auth tokens in the future
 return config;
});

apiClient.interceptors.response.use(
 (response) => response,
 (error) => {
 // Global error handling
 console.error('API Error:', error);
 return Promise.reject(error);
 }
);
