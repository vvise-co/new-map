import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, ArrowLeft } from 'lucide-react';
import { createTeam } from '@/lib/teamApi';
import { useTeam } from '@/context/TeamContext';
import { LoadingScreen } from '@/components/feedback';
import { Alert, Button, Card, Input, Textarea } from '@/components/ui';

export default function TeamRegistrationPage() {
  const navigate = useNavigate();
  const { refreshTeams, hasTeam, loading: teamsLoading } = useTeam();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await createTeam({ name, description: description || undefined });
      await refreshTeams();
      navigate(`/team/${response.team.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  if (teamsLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="page-container flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Back button - only show if user has teams */}
        {hasTeam && (
          <Link
            to="/team"
            className="inline-flex items-center gap-2 text-body hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Teams
          </Link>
        )}

        <div className="text-center">
          <div className="icon-container-primary-lg mx-auto mb-4">
            <Users className="w-8 h-8 icon-primary" />
          </div>
          <h1 className="text-heading-large">
            {hasTeam ? 'Create New Team' : 'Create Your Team'}
          </h1>
          <p className="mt-2 text-body">
            {hasTeam ? 'Add another team to your account' : 'Set up your team to get started'}
          </p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <Card padding="lg" className="shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Team Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter team name"
            />

            <Textarea
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe your team"
            />

            <Button
              type="submit"
              loading={loading}
              disabled={!name.trim()}
              fullWidth
              size="lg"
            >
              Create Team
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
