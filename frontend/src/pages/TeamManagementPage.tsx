import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Copy, Trash2, Plus, Check } from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import { useTeam } from '@/context/TeamContext';
import { Invitation, TeamRole } from '@/lib/types';
import { getTeamInvitations, createInvitation, revokeInvitation } from '@/lib/teamApi';

export default function TeamManagementPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { currentTeam, selectTeam, loading: teamLoading } = useTeam();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isAdmin = currentTeam?.team.current_user_role === 'OWNER' ||
                  currentTeam?.team.current_user_role === 'ADMIN';

  useEffect(() => {
    if (teamId && (!currentTeam || currentTeam.team.id !== teamId)) {
      selectTeam(teamId);
    }
  }, [teamId, currentTeam, selectTeam]);

  useEffect(() => {
    if (teamId && isAdmin) {
      loadInvitations();
    }
  }, [teamId, isAdmin]);

  const loadInvitations = async () => {
    if (!teamId) return;
    setLoading(true);
    try {
      const data = await getTeamInvitations(teamId);
      setInvitations(data);
    } catch (error) {
      console.error('Failed to load invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvitation = async () => {
    if (!teamId) return;
    setLoading(true);
    try {
      await createInvitation({ team_id: teamId });
      await loadInvitations();
    } catch (error) {
      console.error('Failed to create invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    if (!confirm('Are you sure you want to revoke this invitation?')) return;
    try {
      await revokeInvitation(invitationId);
      await loadInvitations();
    } catch (error) {
      console.error('Failed to revoke invitation:', error);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRoleBadgeClass = (role: TeamRole) => {
    switch (role) {
      case 'OWNER':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'MEMBER':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (teamLoading || !currentTeam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Team Management</h1>
          </div>
          <UserMenu />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Team Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
              <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {currentTeam.team.name}
              </h2>
              {currentTeam.team.description && (
                <p className="text-gray-600 dark:text-gray-400">{currentTeam.team.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Members ({currentTeam.members.length})
          </h3>
          <div className="space-y-3">
            {currentTeam.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                    {member.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{member.user_name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.user_email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRoleBadgeClass(member.role)}`}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Invitations (Admin only) */}
        {isAdmin && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Invitations</h3>
              <button
                onClick={handleCreateInvitation}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Generate Link
              </button>
            </div>

            {invitations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No invitations yet. Generate a link to invite team members.
              </p>
            ) : (
              <div className="space-y-3">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className={`p-4 rounded-lg border ${
                      invitation.is_used || invitation.is_expired
                        ? 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700'
                        : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          invitation.is_used
                            ? 'text-gray-500'
                            : invitation.is_expired
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {invitation.is_used
                            ? `Used by ${invitation.used_by_name}`
                            : invitation.is_expired
                            ? 'Expired'
                            : 'Active'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Created by {invitation.created_by_name}
                      </span>
                    </div>

                    {!invitation.is_used && !invitation.is_expired && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={invitation.invite_link}
                          className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                        />
                        <button
                          onClick={() => copyToClipboard(invitation.invite_link, invitation.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Copy link"
                        >
                          {copiedId === invitation.id ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <Copy className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        <button
                          onClick={() => handleRevokeInvitation(invitation.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Revoke invitation"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Expires: {new Date(invitation.expires_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
