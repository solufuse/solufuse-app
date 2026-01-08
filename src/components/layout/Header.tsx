
import { Sun, Moon, Bell, User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

const Header = ({ theme, toggleTheme }: HeaderProps) => {
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
        <button className="flex items-center space-x-2 btn-secondary p-2 rounded-full">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
