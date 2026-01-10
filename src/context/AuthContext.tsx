
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
  user: User | null;
  idToken: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, idToken: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const token = await currentUser.getIdToken();
        setIdToken(token);
        localStorage.setItem('token', token);
      } else {
        setUser(null);
        setIdToken(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, idToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
