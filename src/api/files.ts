
import { FileInfo } from '../types';

const API_URL = 'https://api.solufuse.com/files'; // Base URL for the files router

// Helper to get the auth token, consistent with other API files
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
      console.warn("Authentication token not found. API calls may fail.");
  }
  return token;
};

/**
 * Appends query parameters to a URL, including the project_id if available.
 * @param {string} url The base URL.
 * @param {string | null} projectId The optional project ID.
 * @returns {URL} A URL object with appended query parameters.
 */
const buildUrl = (endpoint: string, projectId: string | null): URL => {
    const url = new URL(`${API_URL}${endpoint}`);
    if (projectId) {
        url.searchParams.append('project_id', projectId);
    }
    return url;
};


/**
 * Lists all files and folders for a user or a specific project.
 * @param {string | null} projectId - If null, lists user's personal files. Otherwise, lists files for that project.
 * @returns {Promise<FileInfo[]>} A list of file information objects.
 */
export const listFiles = async (projectId: string | null = null): Promise<FileInfo[]> => {
    const url = buildUrl('/details', projectId);
    const token = getAuthToken();

    const response = await fetch(url.toString(), {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to list files');
    }

    const data = await response.json();
    return data.files || [];
};

/**
 * Uploads one or more files to the specified project or user's personal space.
 * @param {File[]} files - An array of File objects to upload.
 * @param {string | null} projectId - The target project ID, or null for the user's space.
 * @returns {Promise<any>} The result from the API, including status and saved file names.
 */
export const uploadFiles = async (files: File[], projectId: string | null = null): Promise<any> => {
    const url = buildUrl('/upload', projectId);
    const token = getAuthToken();
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });

    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'File upload failed');
    }

    return response.json();
};

/**
 * Deletes a list of files or folders.
 * @param {string[]} filenames - The relative paths of the items to delete.
 * @param {string | null} projectId - The project context.
 * @returns {Promise<any>} The result from the API.
 */
export const deleteItems = async (filenames: string[], projectId: string | null = null): Promise<any> => {
    const url = buildUrl('/delete', projectId);
    const token = getAuthToken();

    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(filenames),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete items');
    }

    return response.json();
};

/**
 * Renames a file or folder.
 * @param {string} oldPath - The current relative path of the item.
 * @param {string} newPath - The desired new relative path.
 * @param {string | null} projectId - The project context.
 * @returns {Promise<any>} The result from the API.
 */
export const renameItem = async (oldPath: string, newPath: string, projectId: string | null = null): Promise<any> => {
    const url = buildUrl('/rename', projectId);
    const token = getAuthToken();

    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ old_path: oldPath, new_path: newPath }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to rename item');
    }

    return response.json();
};

/**
 * Creates a new folder.
 * @param {string} folderPath - The relative path of the new folder to create.
 * @param {string | null} projectId - The project context.
 * @returns {Promise<any>} The result from the API.
 */
export const createFolder = async (folderPath: string, projectId: string | null = null): Promise<any> => {
    const url = buildUrl('/create-folder', projectId);
    const token = getAuthToken();

    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ folder_path: folderPath }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create folder');
    }

    return response.json();
};

/**
 * Downloads a selection of files and/or folders as a single zip archive.
 * @param {string[]} filenames - The relative paths of the items to download.
 * @param {string | null} projectId - The project context.
 */
export const downloadItems = async (filenames: string[], projectId: string | null = null): Promise<void> => {
    const url = buildUrl('/download', projectId);
    const token = getAuthToken();

    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(filenames),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Download failed');
    }

    // Handle the zip file download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;

    // Extract filename from Content-Disposition header
    const disposition = response.headers.get('content-disposition');
    let filename = 'download.zip'; // Default filename
    if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['|"])(.*?)\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[3]) {
            filename = matches[3];
        }
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    a.remove();
};
