
import { useAuth } from '../../hooks/useAuth';
import { useAuthContext } from '../../context/AuthContext';
import { Icons } from '../icons';
import Account from '../common/Account';
import { ProjectSwitcher } from '../common/ProjectSwitcher';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

const Header = ({ theme, toggleTheme }: HeaderProps) => {
  const { user } = useAuthContext();
  const { logout, loginWithGoogle } = useAuth();

  const isDarkMode = theme === 'dark';

  const onLogout = () => {
    logout();
  }

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b bg-card">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-bold">Solufuse</h1>
        <ProjectSwitcher />
      </div>

      {user && (
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-1">
              <a href="https://api.solufuse.com/docs" target="_blank" rel="noopener noreferrer" className="px-2 py-1 rounded text-[10px] font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"><Icons.FileText className="w-3 h-3" /> API</a>
              <a href="https://solufuse.com" target="_blank" rel="noopener noreferrer" className="px-2 py-1 rounded text-[10px] font-bold text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1 transition-colors"><Icons.Search className="w-3 h-3" /> About</a>
            </div>

            {toggleTheme && (
                <button onClick={toggleTheme} className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-yellow-500 dark:hover:bg-[#2d2d2d] dark:hover:text-yellow-400 transition-all" title="Switch Theme">
                    {isDarkMode ? <Icons.Sun className="w-4 h-4" /> : <Icons.Moon className="w-4 h-4" />}
                </button>
            )}

            <div className="w-px h-4 bg-slate-200 dark:bg-[#333] hidden xl:block"></div>

            <Account user={user} onLogout={onLogout} onGoogleLogin={handleGoogleLogin} />

          </div>
      )}
    </header>
  );
};

export default Header;
