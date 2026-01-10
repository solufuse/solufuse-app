// src/types/index.ts

// --- SHARED ROLE TYPES ---
export type GlobalRole = "super_admin" | "admin" | "moderator" | "nitro" | "user" | "guest";
export type ProjectRole = "owner" | "admin" | "moderator" | "editor" | "viewer";


// --- API ACTION PAYLOADS ---

// Payload for updating a user's profile
export interface UserUpdatePayload {
    username?: string;
    first_name?: string;
    last_name?: string;
    birth_date?: string; // ISO 8601 date string (YYYY-MM-DD)
    bio?: string;
}

// Payload for banning/unbanning a user
export interface BanRequestPayload {
    user_id: string;
    is_active: boolean;
    reason?: string;
    notes?: string;
}

// Payload for updating a user's global role
export interface RoleUpdatePayload {
    email?: string;
    user_id?: string;
    role: GlobalRole;
}


// --- API DATA MODELS ---

// Summary of a project a user is a member of
export interface ProjectSummary {
    id: string;
    role: ProjectRole;
}

// Publicly visible user information
export interface UserPublic {
    uid: string;
    username?: string;
    email_masked?: string;
    global_role: GlobalRole;
    bio?: string;
    is_active: boolean;
    created_at?: string; // ISO 8601 datetime string
}

// Detailed user profile for the authenticated user ("Me")
export interface UserProfile extends UserPublic {
    email?: string;
    first_name?: string;
    last_name?: string;
    birth_date?: string; // ISO 8601 date string (YYYY-MM-DD)
    projects: ProjectSummary[];
}

// Admin-level view of a user's profile
export interface UserAdminView extends UserPublic {
    email?: string;
    first_name?: string;
    last_name?: string;
    ban_reason?: string;
    admin_notes?: string;
}

/**
 * Represents a file or folder as returned by the file details API.
 */
export interface FileInfo {
    filename: string;       // Relative path to the file/folder
    path: string;           // Same as filename
    size: number;           // Size in bytes
    uploaded_at: string;    // ISO 8601 datetime string
    content_type: string;   // Mime type
}


// --- LEGACY/APP-SPECIFIC TYPES ---
// These appear to be from a previous version or different feature.
// They are kept for compatibility but should be reviewed.

// Represents a user within the application, potentially from Firebase Auth
export interface AppUser {
    uid: string;
    email?: string | null;
    displayName?: string | null; // This could be 'username'
    photoURL?: string | null;
    isAnonymous?: boolean;
    global_role?: GlobalRole;
}

// Represents a full project entity
export interface Project {
    id: string;
    name: string;
    owner_uid: string;
    role: ProjectRole | 'guest';
}

// Represents a member of a project
export interface Member {
    uid: string;
    email: string;
    role: ProjectRole;
    photoURL?: string;
    username?: string;
    global_role?: GlobalRole;
}

// Specific settings for a "Loadflow" feature
export interface LoadflowSettings {
  target_mw: number;
  tolerance_mw: number;
  swing_bus_id: string;
}

// General application configuration
export interface AppConfig {
  loadflow_settings: LoadflowSettings;
}
