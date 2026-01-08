
import { NavLink } from 'react-router-dom';
import { Icons } from './icons';

const NavItem = ({ to, icon, children }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary-color text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`
    }
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);

const Sidebar = ({ user, onLogout, isDarkMode, toggleTheme, onToggleFileManager, isSidebarExpanded, setIsSidebarExpanded }) => {
  return (
    <div className={`sidebar flex flex-col p-3 transition-all duration-300 ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between mb-6">
        {isSidebarExpanded && <h1 className="text-xl font-bold">Studio</h1>}
        <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full">
          {isSidebarExpanded ? <Icons.ChevronLeft /> : <Icons.ChevronRight />}
        </button>
      </div>
      
      <nav className="flex-1 flex flex-col gap-2">
        <NavItem to="/" icon={<Icons.Dashboard />}>{isSidebarExpanded && "Dashboard"}</NavItem>
        <NavItem to="/diagram" icon={<Icons.GitHub />}>{isSidebarExpanded && "Diagram"}</NavItem>
        <NavItem to="/config" icon={<Icons.Settings />}>{isSidebarExpanded && "Settings"}</NavItem>
      </nav>

      <div className="flex flex-col gap-2">
        <button onClick={onToggleFileManager} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700">
          <Icons.Archive />
          {isSidebarExpanded && "File Manager"}
        </button>
        <NavItem to="/profile" icon={<Icons.Profile />}>{isSidebarExpanded && user.displayName || "Profile"}</NavItem>
        <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700">
          {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
          {isSidebarExpanded && (isDarkMode ? "Light Mode" : "Dark Mode")}
        </button>
        <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-500 hover:text-white dark:hover:bg-red-600">
          <Icons.Logout />
          {isSidebarExpanded && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
