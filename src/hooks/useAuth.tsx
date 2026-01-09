
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export const useAuth = () => {
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      window.location.href = '/';
    } catch (error) {
      console.error("Google sign-in failed", error);
    }
  };

  const logout = () => {
      auth.signOut().then(() => {
        window.location.href = '/login';
      });
  }

  return { loginWithGoogle, logout };
};
