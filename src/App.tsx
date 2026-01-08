
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Header from './components/layout/Header';
import ActivityBar from './components/layout/ActivityBar';
import Explorer from './components/layout/Explorer';
import Diagram from './components/diagram/Diagram';
import { Panel, Group, Separator } from 'react-resizable-panels';
import CookieConsent from './components/CookieConsent';

const SearchPanel = () => <div className="p-4 bg-card h-full"><h2 className="font-bold text-lg">Search</h2></div>;
const SourceControlPanel = () => <div className="p-4 bg-card h-full"><h2 className="font-bold text-lg">Source Control</h2></div>;

function App() {
  const { user, loading } = useAuthContext();
  const [theme, setTheme] = useState('dark');
  const [activePanel, setActivePanel] = useState('explorer');

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
      <CookieConsent />
      {user ? (
        <div className={`app-shell ${theme}`}>
          <Header theme={theme} toggleTheme={toggleTheme} />
          <div className="main-layout">
            <ActivityBar setActivePanel={setActivePanel} />
            <Routes>
              <Route path="/" element={
                <Group orientation="horizontal" className="flex-1">
                  <Panel defaultSize={300} minSize={100}>
                    <aside className="h-full bg-card">
                      {renderActivePanel()}
                    </aside>
                  </Panel>
                  <Separator className="w-px bg-border hover:bg-primary transition-colors" />
                  <Panel>
                    <main className="main-content">
                      <Diagram />
                    </main>
                  </Panel>
                </Group>
              } />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </Router>
  );
}

export default App;
