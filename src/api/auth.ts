/**
 * Auth API — handles sign-up and sign-in.
 */

import apiClient from './client';
import { AuthResponse } from '../types';

export const authApi = {
  /**
   * Register a new user.
   */
  async signUp(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/signup', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Sign in an existing user.
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/signin', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Get current user profile (verifies token).
   */
  async getMe(): Promise<any> {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },
};
