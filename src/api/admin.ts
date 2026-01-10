
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { User } from '../types/index'; // Correct import path

const listAllUsersCallable = httpsCallable(functions, 'listAllUsers');

export const listAllUsers = async (): Promise<User[]> => {
  try {
    const result = await listAllUsersCallable();
    return result.data as User[];
  } catch (error) {
    console.error('Error calling listAllUsers function:', error);
    throw new Error('Could not list users.');
  }
};
