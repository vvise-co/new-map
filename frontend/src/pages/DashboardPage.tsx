import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Clock, Star, FolderOpen, ChevronRight } from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext';
import { getTeamProjects } from '@/lib/projectApi';
import { Project } from '@/lib/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentTeam } = useTeam();
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [starredProjects, setStarredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentTeam?.team.id) {
      loadProjects();
    }
  }, [currentTeam?.team.id]);

  const loadProjects = async () => {
    if (!currentTeam?.team.id) return;

    setLoading(true);
    try {
      const response = await getTeamProjects(currentTeam.team.id);
      setRecentProjects(response.recent.slice(0, 4));
      setStarredProjects(response.starred.slice(0, 4));
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
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
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-all group flex items-center gap-4"
    >
      <div className="bg-primary-100 dark:bg-primary-900/30 p-2.5 rounded-lg flex-shrink-0">
        <FolderOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
          {project.name}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(project.updated_at)}
        </p>
      </div>
      {project.starred && (
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
      )}
    </Link>
  );

  const EmptyState = ({ message, showCreate }: { message: string; showCreate?: boolean }) => (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center">
      <FolderOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{message}</p>
      {showCreate && (
        <button
          onClick={() => navigate('/projects/new')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your projects.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600" />
          </div>
        ) : (
          <>
            {/* Recent Projects Section */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Recent Projects
                  </h3>
                </div>
                {recentProjects.length > 0 && (
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {recentProjects.length === 0 ? (
                <EmptyState message="No projects yet. Create your first project to get started." showCreate />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {recentProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </section>

            {/* Starred Projects Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Starred Projects
                  </h3>
                </div>
                {starredProjects.length > 0 && (
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {starredProjects.length === 0 ? (
                <EmptyState message="No starred projects. Star your favorite projects for quick access." />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {starredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
