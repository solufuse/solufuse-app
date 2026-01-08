
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Login from './pages/Login';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/layout/Header';
import ActivityBar from './components/layout/ActivityBar';
import Explorer from './components/layout/Explorer';
import Diagram from './components/diagram/Diagram';

const SearchPanel = () => <div className="p-4 bg-card h-full"><h2 className="font-bold text-lg">Search</h2></div>;
const SourceControlPanel = () => <div className="p-4 bg-card h-full"><h2 className="font-bold text-lg">Source Control</h2></div>;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [activePanel, setActivePanel] = useState('explorer');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'explorer':
        return <Explorer />;
      case 'search':
        return <SearchPanel />;
      case 'version':
        return <SourceControlPanel />;
      default:
        return <div className="p-4 bg-card h-full"><h2 className="font-bold text-lg">Panel</h2></div>;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {user ? (
        <div className={`app-shell ${theme}`}>
          <Header theme={theme} toggleTheme={toggleTheme} />
          <div className="main-layout">
            <ActivityBar setActivePanel={setActivePanel} />
            <aside className="w-1/5 min-w-[200px] border-r bg-card">
              {renderActivePanel()}
            </aside>
            <main className="main-content">
              <Diagram />
            </main>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </Router>
  );
}

export default App;
