import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Clock, Star, FolderOpen, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext';
import { getTeamProjects } from '@/lib/projectApi';
import { Project } from '@/lib/types';
import { PageHeader, SectionHeader } from '@/components/layout';
import { EmptyState } from '@/components/feedback';
import { Button, Spinner } from '@/components/ui';
import { ProjectCard } from '@/components/cards';

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

  return (
    <div className="page-container">
      <PageHeader
        title="Dashboard"
        containerClass="content-container-wide"
        actions={
          <Button
            onClick={() => navigate('/projects/new')}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            New Project
          </Button>
        }
      />

      <main className="content-container-wide py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-body">
            Here's what's happening with your projects.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Recent Projects Section */}
            <section className="mb-8">
              <SectionHeader
                title="Recent Projects"
                icon={<Clock className="w-5 h-5" />}
                action={
                  recentProjects.length > 0 && (
                    <Link
                      to="/projects"
                      className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      View all
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )
                }
              />

              {recentProjects.length === 0 ? (
                <EmptyState
                  variant="subtle"
                  size="sm"
                  icon={<FolderOpen className="w-8 h-8" />}
                  title="No projects yet"
                  description="Create your first project to get started."
                  action={
                    <Button
                      size="sm"
                      onClick={() => navigate('/projects/new')}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Create Project
                    </Button>
                  }
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {recentProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} variant="compact" />
                  ))}
                </div>
              )}
            </section>

            {/* Starred Projects Section */}
            <section>
              <SectionHeader
                title="Starred Projects"
                icon={<Star className="w-5 h-5 text-yellow-500" />}
                action={
                  starredProjects.length > 0 && (
                    <Link
                      to="/projects"
                      className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      View all
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )
                }
              />

              {starredProjects.length === 0 ? (
                <EmptyState
                  variant="subtle"
                  size="sm"
                  icon={<Star className="w-8 h-8" />}
                  title="No starred projects"
                  description="Star your favorite projects for quick access."
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {starredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} variant="compact" />
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
