import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Project, ProjectListResponse, CreateProjectRequest, UpdateProjectRequest } from '@/lib/types';
import { useProjectApi } from './ApiContext';
import { useTeam } from './TeamContext';

interface ProjectContextType {
  // State
  projects: ProjectListResponse | null;
  currentProject: Project | null;
  loading: boolean;
  error: string | null;

  // Actions
  refreshProjects: () => Promise<void>;
  selectProject: (projectId: string) => Promise<void>;
  createProject: (data: CreateProjectRequest) => Promise<Project>;
  updateProject: (projectId: string, data: UpdateProjectRequest) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
  toggleStar: (projectId: string) => Promise<void>;
  clearProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const api = useProjectApi();
  const { currentTeam } = useTeam();

  const [projects, setProjects] = useState<ProjectListResponse | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProjects = useCallback(async () => {
    if (!currentTeam) {
      setProjects(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.getTeamProjects(currentTeam.team.id);
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      setProjects(null);
    } finally {
      setLoading(false);
    }
  }, [api, currentTeam]);

  const selectProject = useCallback(
    async (projectId: string) => {
      if (!currentTeam) return;

      setLoading(true);
      setError(null);
      try {
        const project = await api.getProject(currentTeam.team.id, projectId);
        setCurrentProject(project);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    },
    [api, currentTeam]
  );

  const createProject = useCallback(
    async (data: CreateProjectRequest): Promise<Project> => {
      if (!currentTeam) throw new Error('No team selected');

      setLoading(true);
      setError(null);
      try {
        const project = await api.createProject(currentTeam.team.id, data);
        await refreshProjects();
        return project;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create project';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api, currentTeam, refreshProjects]
  );

  const updateProject = useCallback(
    async (projectId: string, data: UpdateProjectRequest): Promise<Project> => {
      if (!currentTeam) throw new Error('No team selected');

      setLoading(true);
      setError(null);
      try {
        const project = await api.updateProject(currentTeam.team.id, projectId, data);
        if (currentProject?.id === projectId) {
          setCurrentProject(project);
        }
        await refreshProjects();
        return project;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update project';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api, currentTeam, currentProject, refreshProjects]
  );

  const deleteProject = useCallback(
    async (projectId: string): Promise<void> => {
      if (!currentTeam) throw new Error('No team selected');

      setLoading(true);
      setError(null);
      try {
        await api.deleteProject(currentTeam.team.id, projectId);
        if (currentProject?.id === projectId) {
          setCurrentProject(null);
        }
        await refreshProjects();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete project';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api, currentTeam, currentProject, refreshProjects]
  );

  const toggleStar = useCallback(
    async (projectId: string): Promise<void> => {
      if (!currentTeam) throw new Error('No team selected');

      try {
        const project = await api.toggleProjectStar(currentTeam.team.id, projectId);
        if (currentProject?.id === projectId) {
          setCurrentProject(project);
        }
        await refreshProjects();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to toggle star';
        setError(message);
        throw err;
      }
    },
    [api, currentTeam, currentProject, refreshProjects]
  );

  const clearProject = useCallback(() => {
    setCurrentProject(null);
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        loading,
        error,
        refreshProjects,
        selectProject,
        createProject,
        updateProject,
        deleteProject,
        toggleStar,
        clearProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
}
