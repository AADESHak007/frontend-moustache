/**
 * Shared TypeScript types for the AI Mustache Generator mobile app.
 * Matches the API contract in /docs/api-contract.md exactly.
 */

// ---------------------------------------------------------------------------
// Job
// ---------------------------------------------------------------------------
export type JobStatus = 'pending' | 'processing' | 'done' | 'failed';

export interface Job {
  job_id:     string;
  status:     JobStatus;
  output_url?: string;   // Populated when status === 'done'
  error?:      string;   // Populated when status === 'failed'
  created_at?: string;
}

// ---------------------------------------------------------------------------
// Style
// ---------------------------------------------------------------------------
export interface Style {
  id:          string;   // e.g. "handlebar"
  label:       string;   // e.g. "Handlebar"
  preview_url: string;
  asset_url:   string;
}

export interface StylesResponse {
  styles: Style[];
  count:  number;
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
export type RootStackParamList = {
  Home:         undefined;
  Upload:       undefined;
  StylePicker:  undefined;
  Processing:   undefined;
  Result:       undefined;
};
