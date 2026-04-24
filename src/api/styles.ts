/**
 * Styles API function.
 * Wraps GET /api/styles.
 */

import apiClient from './client';
import { StylesResponse } from '../types';

/**
 * Fetch all available mustache styles.
 * The backend caches this for 5 minutes — safe to call on every mount.
 */
export const getStyles = async (): Promise<StylesResponse> => {
  const response = await apiClient.get<StylesResponse>('/api/styles');
  return response.data;
};
