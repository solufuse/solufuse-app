
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Solufuse</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Your All-in-One Firebase Development Studio</p>
        <button onClick={loginWithGoogle} className="btn-primary py-3 px-6 text-lg">
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
