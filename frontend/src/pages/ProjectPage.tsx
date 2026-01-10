import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, StarOff, Settings, MoreHorizontal } from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import { useTeam } from '@/context/TeamContext';
import { getProject, toggleProjectStar } from '@/lib/projectApi';
import { Project } from '@/lib/types';
import { LoadingScreen, EmptyState } from '@/components/feedback';
import { Alert, Card, IconButton } from '@/components/ui';

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
    return <LoadingScreen />;
  }

  if (error || !project) {
    return (
      <div className="page-container">
        <header className="surface-header">
          <div className="content-container py-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-body hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to projects
            </Link>
          </div>
        </header>
        <main className="content-container py-8">
          <Alert variant="error">{error || 'Project not found'}</Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <header className="surface-header">
        <div className="content-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-body hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-heading-page">{project.name}</h1>
                {project.description && (
                  <p className="text-body-sm">{project.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <IconButton
                icon={
                  project.starred ? (
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <StarOff className="w-5 h-5" />
                  )
                }
                onClick={handleToggleStar}
                label={project.starred ? 'Remove from favorites' : 'Add to favorites'}
              />
              <IconButton
                icon={<Settings className="w-5 h-5" />}
                label="Project settings"
              />
              <IconButton
                icon={<MoreHorizontal className="w-5 h-5" />}
                label="More options"
              />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main content - Empty state for now */}
      <main className="content-container py-12">
        <Card padding="lg" className="text-center">
          <EmptyState
            variant="subtle"
            size="lg"
            icon={<Settings className="w-16 h-16" />}
            title="Project workspace"
            description="This is your project workspace. Content and features will be added here as the application grows."
          />
        </Card>
      </main>
    </div>
  );
}
