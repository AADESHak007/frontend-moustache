/**
 * Axios HTTP client configured for the AI Mustache Generator backend.
 *
 * Base URL is read from app.json → expo.extra.apiUrl.
 * Falls back to localhost:8000 for local development.
 */

import axios, { AxiosInstance } from 'axios';
import Constants from 'expo-constants';
import { useAppStore } from '../store/useAppStore';

const BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra?.apiUrl as string) ??
  'http://localhost:8000';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    Accept: 'application/json',
  },
});

// Request interceptor: add Bearer token and log outgoing requests
apiClient.interceptors.request.use((config) => {
  const token = useAppStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (__DEV__) {
    console.log(`[API →] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  }
  return config;
});

// Response interceptor: normalize errors and handle 401s
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiry
    if (error.response?.status === 401) {
      useAppStore.getState().logout();
    }

    const detail  = error.response?.data?.detail;
    const message = typeof detail === 'string' ? detail : error.message ?? 'Unknown error';
    if (__DEV__) {
      console.error(`[API ✗] ${message}`);
    }
    const wrapped = new Error(message) as Error & { status?: number };
    wrapped.status = error.response?.status;
    return Promise.reject(wrapped);
  }
);

export default apiClient;
