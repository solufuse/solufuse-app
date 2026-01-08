
import { FileCode, Layout, Settings, Code, GitBranch, Search } from 'lucide-react';

const ActivityBar = ({ setActivePanel }) => {
  return (
    <nav className="flex flex-col items-center space-y-2 p-2 bg-card border-r">
      <button onClick={() => setActivePanel('explorer')} className="p-3 rounded-lg hover:bg-secondary">
        <FileCode size={24} />
      </button>
      <button onClick={() => setActivePanel('search')} className="p-3 rounded-lg hover:bg-secondary">
        <Search size={24} />
      </button>
      <button onClick={() => setActivePanel('diagram')} className="p-3 rounded-lg hover:bg-secondary">
        <Layout size={24} />
      </button>
      <button onClick={() => setActivePanel('functions')} className="p-3 rounded-lg hover:bg-secondary">
        <Code size={24} />
      </button>
        <button onClick={() => setActivePanel('version')} className="p-3 rounded-lg hover:bg-secondary">
        <GitBranch size={24} />
      </button>
      <div className="flex-grow"></div>
      <button onClick={() => setActivePanel('settings')} className="p-3 rounded-lg hover:bg-secondary">
        <Settings size={24} />
      </button>
    </nav>
  );
};

export default ActivityBar;
