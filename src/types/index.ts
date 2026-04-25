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
// Auth
// ---------------------------------------------------------------------------
export interface UserProfile {
  id:         string;
  email:      string;
  created_at?: string;
}

export interface AuthResponse {
  access_token:  string;
  token_type:    string;
  expires_in:    number;
  refresh_token: string;
  user:          UserProfile;
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
export type RootStackParamList = {
  Home:         undefined;
  SignIn:       undefined;
  SignUp:       undefined;
  Upload:       undefined;
  StylePicker:  undefined;
  Processing:   undefined;
  Result:       undefined;
};
