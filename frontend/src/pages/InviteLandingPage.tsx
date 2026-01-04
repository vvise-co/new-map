import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext';
import { InvitationInfo } from '@/lib/types';
import { getInvitationInfo, acceptInvitation } from '@/lib/teamApi';
import OAuthButtons from '@/components/OAuthButtons';

export default function InviteLandingPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { refreshTeams } = useTeam();
  const [inviteInfo, setInviteInfo] = useState<InvitationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      loadInviteInfo();
    }
  }, [token]);

  useEffect(() => {
    // Auto-accept if user is logged in and invite is valid
    if (user && inviteInfo?.is_valid && !success && !accepting && !error) {
      handleAccept();
    }
  }, [user, inviteInfo, success, accepting, error]);

  const loadInviteInfo = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const info = await getInvitationInfo(token);
      setInviteInfo(info);
      if (!info) {
        setError('Invitation not found');
      }
    } catch {
      setError('Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!token) return;
    setAccepting(true);
    setError(null);
    try {
      await acceptInvitation(token);
      setSuccess(true);
      await refreshTeams();
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  const storePendingInvite = () => {
    // Store invite token in sessionStorage to process after login
    if (token) {
      sessionStorage.setItem('pending_invite', token);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            You've joined the team!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error && !inviteInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Invalid Invitation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'This invitation link is invalid or has expired.'}
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (inviteInfo && !inviteInfo.is_valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Invitation Expired
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This invitation has expired or has already been used.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            You're invited to join
          </h1>
          <h2 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {inviteInfo?.team_name}
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
          {inviteInfo?.team_description && (
            <p className="text-gray-600 dark:text-gray-400 text-center">
              {inviteInfo.team_description}
            </p>
          )}

          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            <p>Invited by: <span className="font-medium">{inviteInfo?.inviter_name}</span></p>
            <p>Expires: {inviteInfo && new Date(inviteInfo.expires_at).toLocaleDateString()}</p>
          </div>

          {user ? (
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-lg transition-colors"
            >
              {accepting ? 'Joining...' : 'Accept Invitation'}
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Sign in to accept this invitation
              </p>
              <OAuthButtons onBeforeLogin={storePendingInvite} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
