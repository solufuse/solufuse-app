
import { useState, useEffect } from 'react';
import { Icons } from '../icons';
import { listProjects, createProject } from '../../api/projects';
import { Project } from '../../types';
import { useAuthContext } from '../../context/AuthContext';
import { ProjectSwitcherModal } from './ProjectSwitcherModal';
import MembersModal from './MembersModal';

export function ProjectSwitcher() {
  const { user } = useAuthContext();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    console.log(`[${type}] ${msg}`);
    // Replace with a real toast notification library if available
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectList = await listProjects();
        setProjects(projectList);
        if (projectList.length > 0 && !currentProject) {
          setCurrentProject(projectList[0]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        notify('Failed to fetch projects', 'error');
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async (projectName: string) => {
    try {
      const newProject = await createProject(projectName, projectName);
      setProjects([...projects, newProject]);
      setCurrentProject(newProject);
      setShowProjectModal(false);
      notify(`Project "${newProject.name}" created successfully!`);
    } catch (error) {
      console.error('Error creating project:', error);
      notify('Failed to create project', 'error');
      throw error; // Re-throw to inform the modal if needed
    }
  };

  const handleSelectProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        setCurrentProject(project);
    }
    setShowProjectModal(false);
  };

  const handleManageMembers = () => {
      setShowProjectModal(false);
      setShowMembersModal(true);
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">
          {currentProject ? currentProject.name : 'No Project'}
        </div>
        <button onClick={() => setShowProjectModal(true)} className="btn-secondary p-2 rounded-full">
          <Icons.ChevronDown size={16} />
        </button>
      </div>

      {showProjectModal && (
        <ProjectSwitcherModal 
            projects={projects}
            activeProjectId={currentProject?.id || null}
            onProjectSelect={handleSelectProject}
            onClose={() => setShowProjectModal(false)}
            onCreateProject={handleCreateProject}
            onManageMembers={handleManageMembers}
            notify={notify}
        />
      )}

      {showMembersModal && currentProject && user && (
        <MembersModal 
          projectId={currentProject.id} 
          currentUserUID={user.uid}
          onClose={() => setShowMembersModal(false)} 
          notify={notify} 
        />
      )}
    </div>
  );
}
