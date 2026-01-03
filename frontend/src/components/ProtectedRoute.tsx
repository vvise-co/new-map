import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  requireTeam?: boolean;
  children?: React.ReactNode;
}

export default function ProtectedRoute({
  requireAdmin,
  requireTeam = true,
  children
}: ProtectedRouteProps) {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { hasTeam, loading: teamLoading } = useTeam();

  if (authLoading || (requireTeam && teamLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If team is required and user has no team, redirect to team registration
  if (requireTeam && !hasTeam) {
    return <Navigate to="/register-team" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
