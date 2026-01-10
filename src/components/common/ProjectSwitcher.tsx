
import { useState, useEffect } from 'react';
import { Icons } from '../icons';
import { listProjects, createProject } from '../../api/projects'; // Import API functions
import { Project } from '../../types'; // Import types
import MembersModal from './MembersModal'; // Import the new MembersModal
import { useAuthContext } from '../../context/AuthContext'; // Import the Auth Context hook

export function ProjectSwitcher() {
  const { user } = useAuthContext(); // Get the current user from the context
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [showMembers, setShowMembers] = useState(false);

  // A simple notify function. You can replace this with a more robust solution.
  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    console.log(`[${type}] ${msg}`);
    // In a real app, you might use a library like react-toastify
    // toast(msg, { type });
  };

  useEffect(() => {
    // Fetch projects when the component mounts
    const fetchProjects = async () => {
      try {
        const projectList = await listProjects();
        setProjects(projectList);
        if (projectList.length > 0) {
          setCurrentProject(projectList[0]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        notify('Failed to fetch projects', 'error');
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    if (search.trim() !== '') {
      try {
        const newProject = await createProject(search.trim(), search.trim());
        setProjects([...projects, newProject]);
        setCurrentProject(newProject);
        setSearch('');
        setIsOpen(false);
        notify(`Project "${newProject.name}" created successfully!`);
      } catch (error) {
        console.error('Error creating project:', error);
        notify('Failed to create project', 'error');
      }
    }
  };

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">
          {currentProject ? currentProject.name : 'No Project'}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="btn-secondary p-2 rounded-full">
          <Icons.ChevronDown size={16} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-72 bg-card border rounded-lg shadow-lg z-10">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search or create project..."
              className="w-full px-2 py-1 border rounded-md"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="border-t">
            <ul>
              {filteredProjects.map(p => (
                <li key={p.id} className="px-3 py-2 hover:bg-muted cursor-pointer" onClick={() => {
                  setCurrentProject(p);
                  setIsOpen(false);
                }}>
                  {p.name}
                </li>
              ))}
            </ul>
          </div>
          {/* Only show create project if user is logged in */}
          {user && (
            <div className="border-t p-2">
                <button onClick={handleCreateProject} className="w-full btn-primary text-sm">Create Project</button>
            </div>
          )}
          {/* Only show manage members if there is a project and a user */}
          {currentProject && user && (
            <div className="border-t p-2">
              <button onClick={() => setShowMembers(true)} className="w-full btn-secondary text-sm">Manage Members</button>
            </div>
          )}
        </div>
      )}

      {/* Only render modal if we have the required props */}
      {showMembers && currentProject && user && (
        <MembersModal 
          projectId={currentProject.id} 
          currentUserUID={user.uid} // Pass the dynamic user UID
          onClose={() => setShowMembers(false)} 
          notify={notify} 
        />
      )}
    </div>
  );
}
