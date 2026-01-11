import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import OAuthButtons from '@/components/OAuthButtons';
import { useAuth } from '@/context/AuthContext';
import { LoadingScreen } from '@/components/feedback';
import { Alert, Card } from '@/components/ui';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const sessionExpired = searchParams.get('session_expired') === 'true';

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="page-container flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-heading-large">Welcome</h1>
          <p className="mt-2 text-body">Sign in to continue</p>
        </div>

        {sessionExpired && (
          <Alert variant="warning">
            Your session has expired. Please sign in again to continue where you left off.
          </Alert>
        )}

        {error && <Alert variant="error">{error}</Alert>}

        <Card padding="lg" className="shadow-lg">
          <OAuthButtons />
        </Card>

        <p className="text-center text-body-sm">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
