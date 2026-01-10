
// Base User definition
export interface User {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
    isAnonymous?: boolean;
    global_role?: 'super_admin' | 'admin' | 'user';
}

// Merged Project definition
export interface Project {
    id: string;
    name: string;
    owner_uid: string; // Kept from recent updates
    role: 'owner' | 'admin' | 'editor' | 'viewer' | 'guest'; // Kept stricter roles
}

// Merged Member definition
export interface Member {
    uid: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    photoURL?: string;
    username?: string; // Added from the old types.ts
}

// Types from the old types.ts
export interface LoadflowSettings {
  target_mw: number;
  tolerance_mw: number;
  swing_bus_id: string;
}

export interface AppConfig {
  loadflow_settings: LoadflowSettings;
}
