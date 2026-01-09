
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../icons';

// We define the type for the user object based on its usage
interface User {
  isAnonymous: boolean;
  photoURL?: string | null;
  displayName?: string | null;
  uid: string;
}

interface AccountProps {
  user: User;
  onLogout: () => void;
  onGoogleLogin: () => void;
}

const Account = ({ user, onLogout, onGoogleLogin }: AccountProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const handleGoogleLogin = () => {
    onGoogleLogin();
    setShowMenu(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setShowMenu(!showMenu)} className={`flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-full border transition-all ${user.isAnonymous ? 'bg-slate-100 border-transparent hover:bg-slate-200 dark:bg-[#2d2d2d] dark:text-slate-400' : 'bg-transparent border-slate-200 hover:border-slate-300 dark:border-[#333] dark:hover:border-[#555] dark:text-slate-200'}`}>
        {user.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
        ) : (
            <div className="w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center text-white text-[9px] font-bold">
                {user.displayName ? user.displayName[0] : <Icons.User className="w-3 h-3" />}
            </div>
        )}
        <span className="text-[10px] font-bold hidden md:block max-w-[80px] truncate">
            {user.isAnonymous ? "Guest" : user.displayName}
        </span>
        <Icons.ChevronDown className="w-3 h-3 opacity-50" />
      </button>

      {showMenu && (
        <div className="absolute right-0 top-10 w-56 bg-white dark:bg-[#252526] rounded-xl shadow-xl border border-slate-100 dark:border-[#333] overflow-hidden animate-in fade-in zoom-in-95 duration-100 z-50 origin-top-right">
          <div className="p-3 border-b border-slate-50 dark:border-[#333]">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Session ID</p>
            <p className="text-[10px] font-mono text-slate-600 dark:text-slate-300 truncate">{user.uid}</p>
          </div>
          <div className="p-1">
              <Link to="/profile" onClick={() => setShowMenu(false)} className="flex items-center gap-2 w-full text-left px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d2d2d] text-slate-700 dark:text-slate-300 transition-colors">
                  <Icons.User className="w-3.5 h-3.5 opacity-70" />
                  <span className="text-[11px] font-bold">My Profile</span>
              </Link>
              
              {user.isAnonymous && (
                  <button onClick={handleGoogleLogin} className="flex items-center gap-2 w-full text-left px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d2d2d] text-slate-700 dark:text-slate-300 transition-colors">
                      <Icons.LogIn className="w-3.5 h-3.5 opacity-70" />
                      <span className="text-[11px] font-bold">Sign In with Google</span>
                  </button>
              )}
          </div>
          <div className="p-1 border-t border-slate-50 dark:border-[#333]">
            <button onClick={() => { onLogout(); setShowMenu(false); }} className="w-full flex items-center gap-2 px-2 py-2 text-[11px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
              <Icons.Logout className="w-3.5 h-3.5" />
              {user.isAnonymous ? "Exit Guest Mode" : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
