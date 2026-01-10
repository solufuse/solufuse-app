import { useState, useEffect } from 'react';
import { Icons } from '../icons';
import { listProjects, createProject, inviteMember, removeMember, getProjectMembers } from '../../api/projects'; // Import API functions
import { Project, Member } from '../../types'; // Import types

export function ProjectSwitcher() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [showMembers, setShowMembers] = useState(false);

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
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    // Fetch project members when the current project changes
    const fetchMembers = async () => {
      if (currentProject) {
        try {
          const memberList = await getProjectMembers(currentProject.id);
          setMembers(memberList);
        } catch (error) {
          console.error('Error fetching members:', error);
        }
      }
    };
    fetchMembers();
  }, [currentProject]);

  const handleCreateProject = async () => {
    if (search.trim() !== '') {
      try {
        const newProject = await createProject(search.trim(), search.trim());
        setProjects([...projects, newProject]);
        setCurrentProject(newProject);
        setSearch('');
        setIsOpen(false);
      } catch (error) {
        console.error('Error creating project:', error);
      }
    }
  };

  const handleInviteMember = async (email: string) => {
    if (currentProject) {
      try {
        const newMember = await inviteMember(currentProject.id, email, 'viewer');
        setMembers([...members, newMember]);
      } catch (error) {
        console.error('Error inviting member:', error);
      }
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (currentProject) {
      try {
        await removeMember(currentProject.id, userId);
        setMembers(members.filter((m) => m.uid !== userId));
      } catch (error) {
        console.error('Error removing member:', error);
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
          <div className="border-t p-2">
            <button onClick={handleCreateProject} className="w-full btn-primary text-sm">Create Project</button>
          </div>
          {currentProject && (
            <div className="border-t p-2">
              <button onClick={() => setShowMembers(!showMembers)} className="w-full btn-secondary text-sm">Manage Members</button>
            </div>
          )}
        </div>
      )}

      {showMembers && currentProject && (
        <div className="absolute top-full mt-2 w-72 bg-card border rounded-lg shadow-lg z-10">
          <div className="p-2">
            <h3 className="font-bold">{currentProject.name} Members</h3>
          </div>
          <div className="border-t">
            <ul>
              {members.map(m => (
                <li key={m.uid} className="px-3 py-2 flex justify-between items-center">
                  <span>{m.username} ({m.role})</span>
                  <button onClick={() => handleRemoveMember(m.uid)} className="text-red-500">
                    <Icons.X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t p-2">
            <input
              type="text"
              placeholder="Invite member by email..."
              className="w-full px-2 py-1 border rounded-md mb-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleInviteMember(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
