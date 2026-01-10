
import { Project, Member } from '../types';

const API_URL = 'https://api.solufuse.com'; // Replace with your API URL

// Function to get the auth token from local storage
const getAuthToken = () => {
  return localStorage.getItem('token'); // Adjust this to how you store your token
};

export const listProjects = async (): Promise<Project[]> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/projects/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
};

export const createProject = async (id: string, name: string): Promise<Project> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/projects/create`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ id, name }),
  });
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
  return response.json();
};

export const getProjectMembers = async (projectId: string): Promise<Member[]> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/projects/${projectId}/members`,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch project members');
  }
  return response.json();
};

export const inviteMember = async (projectId: string, email: string, role: string): Promise<Member> => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/projects/${projectId}/members`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email, role }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to invite member');
    }
    return response.json();
  };

  export const inviteMemberWithUid = async (projectId: string, userId: string, role: string): Promise<Member> => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/projects/${projectId}/members`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: userId, role }),
    });
    if (!response.ok) {
        const error = await response.json();
      throw new Error(error.detail || 'Failed to invite member');
    }
    return response.json();
  };

export const removeMember = async (projectId: string, userId: string): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/projects/${projectId}/members/${userId}`,
  {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to remove member');
  }
};

export const updateMemberRole = async (projectId: string, userId: string, role: string): Promise<void> => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/projects/${projectId}/members`,
    {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, role }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update member role');
    }
};
