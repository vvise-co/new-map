import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, StarOff, Settings, MoreHorizontal } from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import { useTeam } from '@/context/TeamContext';
import { getProject, toggleProjectStar } from '@/lib/projectApi';
import { Project } from '@/lib/types';

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentTeam } = useTeam();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentTeam?.team.id && projectId) {
      loadProject();
    }
  }, [currentTeam?.team.id, projectId]);

  const loadProject = async () => {
    if (!currentTeam?.team.id || !projectId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getProject(currentTeam.team.id, projectId);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStar = async () => {
    if (!currentTeam?.team.id || !projectId) return;

    try {
      const updated = await toggleProjectStar(currentTeam.team.id, projectId);
      setProject(updated);
    } catch (err) {
      console.error('Failed to toggle star:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to projects
            </Link>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">
              {error || 'Project not found'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {project.name}
                </h1>
                {project.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {project.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleStar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={project.starred ? 'Remove from favorites' : 'Add to favorites'}
              >
                {project.starred ? (
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ) : (
                  <StarOff className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main content - Empty state for now */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
            <Settings className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Project workspace
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            This is your project workspace. Content and features will be added here as the application grows.
          </p>
        </div>
      </main>
    </div>
  );
}
