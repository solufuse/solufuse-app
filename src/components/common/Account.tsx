
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
      <button onClick={() => setShowMenu(!showMenu)} className={`flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-full border transition-all ${user.isAnonymous ? 'bg-secondary hover:bg-secondary/80' : 'bg-transparent border hover:border-border'}`}>
        {user.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
        ) : (
            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sublabel">
                {user.displayName ? user.displayName[0] : <Icons.User className="w-3 h-3" />}
            </div>
        )}
        <span className="text-label hidden md:block max-w-[80px] truncate">
            {user.isAnonymous ? "Guest" : user.displayName}
        </span>
        <Icons.ChevronDown className="w-3 h-3 opacity-50" />
      </button>

      {showMenu && (
        <div className="absolute right-0 top-10 w-56 bg-popover text-popover-foreground rounded-xl shadow-xl border overflow-hidden animate-in fade-in zoom-in-95 duration-100 z-50 origin-top-right">
          <div className="p-3 border-b">
            <p className="text-sublabel text-muted-foreground uppercase tracking-wider mb-0.5">Session ID</p>
            <p className="text-label font-mono truncate">{user.uid}</p>
          </div>
          <div className="p-1">
              <Link to="/profile" onClick={() => setShowMenu(false)} className="flex items-center gap-2 w-full text-left px-2 py-2 rounded-lg hover:bg-accent transition-colors">
                  <Icons.User className="w-3.5 h-3.5 opacity-70" />
                  <span className="text-detail">My Profile</span>
              </Link>
              
              {user.isAnonymous && (
                  <button onClick={handleGoogleLogin} className="flex items-center gap-2 w-full text-left px-2 py-2 rounded-lg hover:bg-accent transition-colors">
                      <Icons.LogIn className="w-3.5 h-3.5 opacity-70" />
                      <span className="text-detail">Sign In with Google</span>
                  </button>
              )}
          </div>
          <div className="p-1 border-t">
            <button onClick={() => { onLogout(); setShowMenu(false); }} className="w-full flex items-center gap-2 px-2 py-2 text-detail text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
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
