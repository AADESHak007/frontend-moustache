/**
 * Axios HTTP client configured for the AI Mustache Generator backend.
 *
 * Base URL is read from app.json → expo.extra.apiUrl.
 * Falls back to localhost:8000 for local development.
 */

import axios, { AxiosInstance } from 'axios';
import Constants from 'expo-constants';

const BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra?.apiUrl as string) ??
  'http://localhost:8000';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,   // 30s — generous for AI processing uploads
  headers: {
    Accept: 'application/json',
  },
});

// Request interceptor: log outgoing requests in development
apiClient.interceptors.request.use((config) => {
  if (__DEV__) {
    console.log(`[API →] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  }
  return config;
});

// Response interceptor: normalize error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail  = error.response?.data?.detail;
    const message = typeof detail === 'string' ? detail : error.message ?? 'Unknown error';
    if (__DEV__) {
      console.error(`[API ✗] ${message}`);
    }
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
