import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { setTokens, getReturnUrl, clearReturnUrl } from '@/lib/api';
import { LoadingScreen } from '@/components/feedback';
import { Button } from '@/components/ui';

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(errorParam);
      return;
    }

    // Get tokens from URL (sent by auth server for cross-domain auth)
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');

    const handleCallback = async () => {
      try {
        // Store tokens if provided in URL
        if (token) {
          setTokens(token, refreshToken || undefined);
        }

        // Refresh user data
        await refreshUser();

        // Check for pending invite
        const pendingInvite = sessionStorage.getItem('pending_invite');
        if (pendingInvite) {
          sessionStorage.removeItem('pending_invite');
          navigate(`/invite/${pendingInvite}`, { replace: true });
          return;
        }

        // Check for return URL (from session expiration redirect)
        const returnUrl = getReturnUrl();
        if (returnUrl) {
          clearReturnUrl();
          navigate(returnUrl, { replace: true });
          return;
        }

        // Clean URL by removing tokens
        navigate('/dashboard', { replace: true });
      } catch {
        setError('Failed to complete authentication');
      }
    };

    handleCallback();
  }, [searchParams, navigate, refreshUser]);

  if (error) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600">Authentication Error</h2>
          <p className="text-body">{error}</p>
          <Link to="/login">
            <Button>Back to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <LoadingScreen message="Completing sign in..." />;
}
