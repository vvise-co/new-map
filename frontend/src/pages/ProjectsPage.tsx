import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Star, Clock, FolderOpen, StarOff } from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import { useTeam } from '@/context/TeamContext';
import { getTeamProjects, toggleProjectStar } from '@/lib/projectApi';
import { Project } from '@/lib/types';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { currentTeam } = useTeam();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [starredProjects, setStarredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentTeam?.team.id) {
      loadProjects();
    }
  }, [currentTeam?.team.id]);

  const loadProjects = async () => {
    if (!currentTeam?.team.id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getTeamProjects(currentTeam.team.id);
      setRecentProjects(response.recent);
      setStarredProjects(response.starred);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStar = async (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentTeam?.team.id) return;

    try {
      const updated = await toggleProjectStar(currentTeam.team.id, project.id);

      if (updated.starred) {
        setStarredProjects(prev => [updated, ...prev.filter(p => p.id !== updated.id)]);
      } else {
        setStarredProjects(prev => prev.filter(p => p.id !== updated.id));
      }

      setRecentProjects(prev =>
        prev.map(p => p.id === updated.id ? updated : p)
      );
    } catch (err) {
      console.error('Failed to toggle star:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <Link
      to={`/projects/${project.id}`}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all group relative"
    >
      <button
        onClick={(e) => handleToggleStar(e, project)}
        className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={project.starred ? 'Remove from favorites' : 'Add to favorites'}
      >
        {project.starred ? (
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        ) : (
          <StarOff className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
        )}
      </button>

      <div className="flex items-start gap-4">
        <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
          <FolderOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="flex-1 min-w-0 pr-8">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {project.description}
            </p>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Updated {formatDate(project.updated_at)}
          </p>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Projects</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/projects/new')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Recent Projects Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Projects
            </h2>
          </div>

          {recentProjects.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No projects yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Create your first project to get started
              </p>
              <button
                onClick={() => navigate('/projects/new')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>

        {/* Starred Projects Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Starred Projects
            </h2>
          </div>

          {starredProjects.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No starred projects
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Star your favorite projects for quick access
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {starredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
