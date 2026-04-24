/**
 * Jobs API functions.
 * Wraps POST /api/jobs and GET /api/jobs/{id}.
 */
import { Platform } from 'react-native';
import apiClient from './client';
import { Job } from '../types';

export interface CreateJobResponse {
  job_id:     string;
  status:     'pending';
  created_at?: string;
}

/**
 * Upload a photo and request mustache generation.
 *
 * @param imageUri  Local file URI from Expo ImagePicker / Camera
 * @param styleId   Mustache style ID (e.g. "handlebar")
 * @param userId    Client-generated UUID (from Zustand store)
 */
export const createJob = async (
  imageUri: string,
  styleId:  string,
  userId:   string,
): Promise<CreateJobResponse> => {
  // Build multipart/form-data payload
  const formData = new FormData();

  const filename   = imageUri.split('/').pop() ?? 'photo.jpg';
  const extension  = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
  const mimeType   = extension === 'png' ? 'image/png' : 'image/jpeg';

  // React Native Mobile vs Web FormData polyfill
  if (Platform.OS === 'web') {
    // On the web browser, we must convert the local URI into an actual Blob.
    const res = await fetch(imageUri);
    const blob = await res.blob();
    formData.append('image', blob, filename);
  } else {
    // React Native Mobile FormData trick
    formData.append('image', {
      uri:  imageUri,
      name: filename,
      type: mimeType,
    } as any);
  }

  formData.append('style_id', styleId);
  formData.append('user_id',  userId);

  const response = await apiClient.post<CreateJobResponse>('/api/jobs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

/**
 * Poll job status.
 * Call every 2 seconds until status === 'done' | 'failed'.
 */
export const getJobStatus = async (jobId: string): Promise<Job> => {
  const response = await apiClient.get<Job>(`/api/jobs/${jobId}`);
  return response.data;
};
