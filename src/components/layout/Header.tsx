
import { Sun, Moon, Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthContext } from '../../context/AuthContext';
import Dropdown from '../common/Dropdown';
import { Link } from 'react-router-dom';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

const Header = ({ theme, toggleTheme }: HeaderProps) => {
  const { user } = useAuthContext();
  const { logout, loginWithGoogle } = useAuth();

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b bg-card">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-bold">Solufuse</h1>
        <div className="flex items-center space-x-2">
            <div className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">PROJET-ACTUEL</div>
            <button className="btn-secondary p-2 rounded-full"><ChevronDown size={16} /></button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="btn-secondary p-2 rounded-full">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="btn-secondary p-2 rounded-full">
            <Bell size={20} />
        </button>
        <Dropdown
          trigger={
            <button className="flex items-center space-x-2 btn-secondary p-1 rounded-full">
              {user && user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full" />
              ) : (
                <User size={20} />
              )}
            </button>
          }
        >
          {user ? (
            <div>
              <Link to="/profile" className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary/10">
                Profile
              </Link>
              <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary/10">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={loginWithGoogle} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary/10">
              Sign In
            </button>
          )}
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
