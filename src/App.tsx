
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Config from './pages/Config';
import DiagramEditor from './pages/DiagramEditor';
import Login from './pages/Login';
import Profile from './pages/Profile'; 
import FileManager from './components/files/FileManager';
import { ReactFlowProvider } from 'reactflow';
import { X } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed:", error);
          setUser(null);
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen w-full">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className={`flex h-screen w-full font-sans`}>
        {user && (
          <Sidebar 
            user={user} 
            onLogout={() => auth.signOut()} 
            isDarkMode={theme === 'dark'} 
            toggleTheme={toggleTheme} 
            onToggleFileManager={() => setIsFileManagerOpen(!isFileManagerOpen)}
            isFileManagerOpen={isFileManagerOpen}
            isSidebarExpanded={isSidebarExpanded}
            setIsSidebarExpanded={setIsSidebarExpanded}
          />
        )}
        
        <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
            <Route path="/config" element={user ? <Config user={user} /> : <Navigate to="/login" />} />
            <Route path="/diagram" element={user ? <ReactFlowProvider><DiagramEditor user={user} /></ReactFlowProvider> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {isFileManagerOpen && user && (
          <div className="absolute inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <div className="card w-[95%] h-[95%] flex flex-col overflow-hidden relative">
              <button onClick={() => setIsFileManagerOpen(false)} className="absolute top-3 right-3 z-10 btn-secondary p-2 rounded-full">
                <X size={20} />
              </button>
              <FileManager user={user} />
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}
