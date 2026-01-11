import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Star, Clock, FolderOpen } from 'lucide-react';
import { useTeam } from '@/context/TeamContext';
import { getTeamProjects, toggleProjectStar } from '@/lib/projectApi';
import { Project } from '@/lib/types';
import { PageHeader, SectionHeader } from '@/components/layout';
import { LoadingScreen, EmptyState } from '@/components/feedback';
import { Alert, Button } from '@/components/ui';
import { ProjectCard } from '@/components/cards';

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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Projects"
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
        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        {/* Recent Projects Section */}
        <section className="mb-10">
          <SectionHeader
            title="Recent Projects"
            icon={<Clock className="w-5 h-5" />}
          />

          {recentProjects.length === 0 ? (
            <EmptyState
              icon={<FolderOpen className="w-12 h-12" />}
              title="No projects yet"
              description="Create your first project to get started"
              action={
                <Button
                  onClick={() => navigate('/projects/new')}
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  Create Project
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recentProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onToggleStar={handleToggleStar}
                />
              ))}
            </div>
          )}
        </section>

        {/* Starred Projects Section */}
        <section>
          <SectionHeader
            title="Starred Projects"
            icon={<Star className="w-5 h-5 text-yellow-500" />}
          />

          {starredProjects.length === 0 ? (
            <EmptyState
              icon={<Star className="w-12 h-12" />}
              title="No starred projects"
              description="Star your favorite projects for quick access"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {starredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onToggleStar={handleToggleStar}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
