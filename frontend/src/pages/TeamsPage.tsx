import { Link } from 'react-router-dom';
import { Users, Plus, ChevronRight } from 'lucide-react';
import { useTeam } from '@/context/TeamContext';
import { PageHeader } from '@/components/layout';
import { LoadingScreen, EmptyState } from '@/components/feedback';
import { Card, CardHeader, Badge, Button } from '@/components/ui';

export default function TeamsPage() {
  const { teams, currentTeam, loading } = useTeam();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Teams"
        icon={<Users className="w-6 h-6" />}
        backTo="/dashboard"
      />

      <main className="content-container-narrow py-8">
        <Card>
          <CardHeader>
            <h2 className="text-heading-section">Your Teams</h2>
            <p className="text-body-sm">
              Select a team to manage or view its details.
            </p>
          </CardHeader>

          {teams.length === 0 ? (
            <div className="p-6">
              <EmptyState
                variant="subtle"
                icon={<Users className="w-12 h-12" />}
                title="No teams yet"
                description="You don't have any teams yet."
                action={
                  <Link to="/register-team">
                    <Button leftIcon={<Plus className="w-4 h-4" />}>
                      Create Team
                    </Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="divide-subtle divide-y">
              {teams.map((team) => (
                <Link
                  key={team.id}
                  to={`/team/${team.id}`}
                  className="flex items-center justify-between p-4 hover-surface-subtle"
                >
                  <div className="flex items-center gap-4">
                    <div className="icon-container-primary w-12 h-12">
                      <Users className="w-6 h-6 icon-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-heading-card">{team.name}</p>
                        {currentTeam?.team.id === team.id && (
                          <Badge variant="primary">Current</Badge>
                        )}
                      </div>
                      {team.description && (
                        <p className="text-body-sm">{team.description}</p>
                      )}
                      <p className="text-muted mt-1">
                        {team.member_count} {team.member_count === 1 ? 'member' : 'members'}
                        {team.current_user_role && (
                          <span className="ml-2">• {team.current_user_role}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 icon-subtle" />
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Create New Team */}
        {teams.length > 0 && (
          <div className="mt-6">
            <Link
              to="/register-team"
              className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-subtle rounded-xl text-body hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New Team
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
