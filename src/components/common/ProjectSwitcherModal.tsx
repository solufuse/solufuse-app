
import { useState } from 'react';
import { Icons } from '../icons';
import { Project } from '../../types';
import { useAuthContext } from '../../context/AuthContext';
import { CollapsibleSection } from './CollapsibleSection';

interface ProjectSwitcherModalProps {
    projects: Project[];
    activeProjectId: string | null;
    onProjectSelect: (projectId: string) => void;
    onClose: () => void;
    onCreateProject: (projectName: string) => Promise<void>;
    onManageMembers: () => void; // New prop
    notify: (msg: string, type?: 'success' | 'error') => void;
}

export const ProjectSwitcherModal = ({ projects, activeProjectId, onProjectSelect, onClose, onCreateProject, onManageMembers, notify }: ProjectSwitcherModalProps) => {
    const { user } = useAuthContext();
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");

    const handleCreateProject = async () => {
        if (newProjectName.trim() === '') {
            notify("Project name cannot be empty", "error");
            return;
        }
        await onCreateProject(newProjectName);
        setNewProjectName("");
        setIsCreatingProject(false);
    };

    const myProjects = projects.filter(p => ['owner', 'admin', 'editor', 'viewer'].includes(p.role));

    return (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <div className="card w-[450px] max-h-[600px] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-3 border-b flex justify-between items-center bg-muted/50">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                        <Icons.Folder className="w-4 h-4 text-primary" /> Switch or Create Project
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-secondary rounded text-muted-foreground"><Icons.X className="w-4 h-4"/></button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-2">
                    <CollapsibleSection
                        title="My Projects"
                        icon={<Icons.Folder className="w-4 h-4 text-muted-foreground" />}
                        defaultOpen={true}
                        action={
                            !user?.isAnonymous && (
                                <button onClick={(e) => { e.stopPropagation(); setIsCreatingProject(!isCreatingProject); }} className="text-primary hover:text-primary/80 font-bold text-lg p-1 leading-none">{isCreatingProject ? '×' : '+'}</button>
                            )
                        }
                    >
                        {isCreatingProject && (
                            <div className="flex gap-1 my-2 p-1">
                                <input 
                                    type="text" 
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    placeholder="New Project Name..." 
                                    className="flex-grow bg-transparent border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                                />
                                <button onClick={handleCreateProject} className="btn-primary rounded-md px-3 py-1 font-bold">OK</button>
                            </div>
                        )}
                        <div className="space-y-1 mt-1">
                            {myProjects.map(p => (
                                <div key={p.id} onClick={() => onProjectSelect(p.id)} className={`group flex justify-between items-center w-full text-left gap-2 pl-3 pr-1 py-1.5 rounded-md cursor-pointer transition-colors font-semibold ${activeProjectId === p.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}>
                                    <span className="truncate">{p.name}</span>
                                    {activeProjectId === p.id && <Icons.Check className="w-4 h-4" />}
                                </div>
                            ))}
                            {myProjects.length === 0 && !isCreatingProject && <p className='text-muted-foreground pl-3 py-1 text-sm'>No projects found.</p>}
                        </div>
                    </CollapsibleSection>
                </div>
                
                {/* Footer */}
                {user && (
                    <div className="p-2 border-t bg-muted/50">
                        <button
                            onClick={onManageMembers}
                            disabled={!activeProjectId}
                            className="w-full btn-secondary text-sm disabled:opacity-50"
                        >
                            Manage Members
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
