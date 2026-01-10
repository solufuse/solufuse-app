
import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Project } from '../types';

// 1. Define the shape of the context data
interface ProjectContextType {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
}

// 2. Create the context with a default value
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// 3. Create a provider component
interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ currentProject, setCurrentProject }), [currentProject]);

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

// 4. Create a custom hook for easy consumption
export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
