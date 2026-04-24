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
import { Style, Job } from '../types';

// Generate a random anonymous user ID for this session
const _generateUserId = (): string =>
  `user_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------
interface AppState {
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

  // User
  userId: string;

  // Reset session (after result or on retry)
  resetSession: () => void;
}

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------
export const useAppStore = create<AppState>((set) => ({
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

  // Anonymous user ID — generated once per app session
  userId: _generateUserId(),

  // Reset everything except userId and styles (they persist across sessions)
  resetSession: () =>
    set({
      selectedImageUri: null,
      selectedStyle:    null,
      currentJob:       null,
    }),
}));
