import { Navigate } from 'react-router-dom';
import { useTeam } from '@/context/TeamContext';

export default function TeamRedirect() {
  const { currentTeam, teams, loading } = useTeam();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  // Redirect to current team if available, otherwise first team, otherwise dashboard
  const teamId = currentTeam?.team.id || teams[0]?.id;

  if (teamId) {
    return <Navigate to={`/team/${teamId}`} replace />;
  }

  return <Navigate to="/dashboard" replace />;
}
