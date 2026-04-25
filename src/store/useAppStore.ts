/**
 * Global Zustand store for the AI Mustache Generator app.
 *
 * Manages:
 *  - selectedImageUri  — the photo the user picked
 *  - styles           — list fetched from GET /api/styles
 *  - selectedStyle    — the style the user chose
 *  - currentJob       — active job being processed
 *  - userId           — anonymous UUID persisted for the session
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Style, Job, UserProfile } from '../types';

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------
interface AppState {
  // Auth
  token: string | null;
  user:  UserProfile | null;
  setAuth: (token: string, user: UserProfile) => void;
  logout:  () => void;

  // Image
  selectedImageUri: string | null;
  setSelectedImageUri: (uri: string | null) => void;

  // Styles
  styles:          Style[];
  selectedStyle:   Style | null;
  setStyles:       (styles: Style[]) => void;
  setSelectedStyle:(style: Style | null) => void;

  // Job
  currentJob:      Job | null;
  setCurrentJob:   (job: Job | null) => void;
  updateJob:       (updates: Partial<Job>) => void;

  // Reset session (after result or on retry)
  resetSession: () => void;
}

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      token: null,
      user:  null,
      setAuth: (token, user) => set({ token, user }),
      logout:  () => set({ token: null, user: null }),

      // Image
      selectedImageUri:    null,
      setSelectedImageUri: (uri) => set({ selectedImageUri: uri }),

      // Styles
      styles:           [],
      selectedStyle:    null,
      setStyles:        (styles) => set({ styles }),
      setSelectedStyle: (style)  => set({ selectedStyle: style }),

      // Job
      currentJob:    null,
      setCurrentJob: (job) => set({ currentJob: job }),
      updateJob:     (updates) =>
        set((state) => ({
          currentJob: state.currentJob ? { ...state.currentJob, ...updates } : null,
        })),

      // Reset everything except auth and styles
      resetSession: () =>
        set({
          selectedImageUri: null,
          selectedStyle:    null,
          currentJob:       null,
        }),
    }),
    {
      name: 'mustache-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token:  state.token,
        user:   state.user,
        styles: state.styles,
      }),
    }
  )
);
