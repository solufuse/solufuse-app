
import { UserProfile, UserPublic, UserUpdatePayload, RoleUpdatePayload, BanRequestPayload, UserAdminView } from '../types';

const API_URL = 'https://api.solufuse.com'; // Make sure this is your actual API URL

// Helper to get the auth token, consistent with projects.ts
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
      console.warn("Authentication token not found. API calls may fail.");
  }
  return token;
};

/**
 * Fetches the profile of the currently authenticated user.
 * Corresponds to the `UserProfile` schema.
 * @returns {Promise<UserProfile>} The user's full profile.
 */
export const getMe = async (): Promise<UserProfile> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch user profile');
  }
  return response.json();
};

/**
 * Updates the profile of the currently authenticated user.
 * @param {UserUpdatePayload} payload The data to update.
 * @returns {Promise<UserProfile>} The updated user profile.
 */
export const updateMe = async (payload: UserUpdatePayload): Promise<UserProfile> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update profile');
  }
  return response.json();
};

/**
 * Fetches the public profile of a specific user.
 * Corresponds to the `UserPublic` schema.
 * @param {string} userId The UID of the user to fetch.
 * @returns {Promise<UserPublic>} The user's public profile.
 */
export const getUser = async (userId: string): Promise<UserPublic> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch user');
  }
  return response.json();
};


// --- ADMIN ACTIONS ---

/**
 * [Admin] Fetches a detailed view of a user's profile.
 * Corresponds to the `UserAdminView` schema.
 * @param {string} userId The UID of the user to fetch.
 * @returns {Promise<UserAdminView>} The user's admin-level profile data.
 */
export const getUserAsAdmin = async (userId: string): Promise<UserAdminView> => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch user data');
    }
    return response.json();
  };

/**
 * [Admin] Updates a user's global role.
 * @param {RoleUpdatePayload} payload The details for the role update.
 * @returns {Promise<{message: string}>} Confirmation message.
 */
export const updateUserRole = async (payload: RoleUpdatePayload): Promise<{message: string}> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/admin/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update role');
  }
  return response.json();
};

/**
 * [Admin] Bans or un-suspends a user.
 * @param {BanRequestPayload} payload The details for the ban/unban action.
 * @returns {Promise<{message: string}>} Confirmation message.
 */
export const setUserBanStatus = async (payload: BanRequestPayload): Promise<{message: string}> => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/ban`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to set user ban status');
    }
    return response.json();
  };
