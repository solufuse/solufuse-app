
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { UserAdminView } from '../types/index'; // Corrected import from User to UserAdminView

const listAllUsersCallable = httpsCallable(functions, 'listAllUsers');

export const listAllUsers = async (): Promise<UserAdminView[]> => {
  try {
    const result = await listAllUsersCallable();
    return result.data as UserAdminView[];
  } catch (error) {
    console.error('Error calling listAllUsers function:', error);
    throw new Error('Could not list users.');
  }
};
