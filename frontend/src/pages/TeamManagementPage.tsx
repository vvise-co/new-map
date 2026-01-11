import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Copy, Trash2, Plus, Check } from 'lucide-react';
import { useTeam } from '@/context/TeamContext';
import { Invitation } from '@/lib/types';
import { getTeamInvitations, createInvitation, revokeInvitation } from '@/lib/teamApi';
import { PageHeader, SectionHeader } from '@/components/layout';
import { LoadingScreen } from '@/components/feedback';
import { Button, Card, RoleBadge, IconButton } from '@/components/ui';
import { cn } from '@/lib/utils';

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

  if (teamLoading || !currentTeam) {
    return <LoadingScreen />;
  }

  return (
    <div className="page-container">
      <PageHeader title="Team Management" backTo="/dashboard" containerClass="content-container-narrow" />

      <main className="content-container-narrow py-8 space-y-8">
        {/* Team Info */}
        <Card padding="md">
          <div className="flex items-center gap-4">
            <div className="icon-container-primary p-3">
              <Users className="w-6 h-6 icon-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {currentTeam.team.name}
              </h2>
              {currentTeam.team.description && (
                <p className="text-body">{currentTeam.team.description}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Members */}
        <Card padding="md">
          <SectionHeader
            title={`Members (${currentTeam.members.length})`}
            className="mb-4"
          />
          <div className="space-y-3">
            {currentTeam.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 surface-subtle"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                    {member.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-heading-card">{member.user_name}</p>
                    <p className="text-body-sm">{member.user_email}</p>
                  </div>
                </div>
                <RoleBadge role={member.role} />
              </div>
            ))}
          </div>
        </Card>

        {/* Invitations (Admin only) */}
        {isAdmin && (
          <Card padding="md">
            <SectionHeader
              title="Invitations"
              action={
                <Button
                  onClick={handleCreateInvitation}
                  loading={loading}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Generate Link
                </Button>
              }
              className="mb-4"
            />

            {invitations.length === 0 ? (
              <p className="text-body-sm text-center py-4">
                No invitations yet. Generate a link to invite team members.
              </p>
            ) : (
              <div className="space-y-3">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className={cn(
                      'p-4 rounded-lg border',
                      invitation.is_used || invitation.is_expired
                        ? 'bg-gray-50 dark:bg-gray-700/30 border-subtle'
                        : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        'text-sm font-medium',
                        invitation.is_used
                          ? 'text-gray-500'
                          : invitation.is_expired
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-green-600 dark:text-green-400'
                      )}>
                        {invitation.is_used
                          ? `Used by ${invitation.used_by_name}`
                          : invitation.is_expired
                          ? 'Expired'
                          : 'Active'}
                      </span>
                      <span className="text-muted">
                        Created by {invitation.created_by_name}
                      </span>
                    </div>

                    {!invitation.is_used && !invitation.is_expired && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={invitation.invite_link}
                          className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-subtle rounded-lg text-gray-700 dark:text-gray-300"
                        />
                        <IconButton
                          icon={
                            copiedId === invitation.id ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )
                          }
                          onClick={() => copyToClipboard(invitation.invite_link, invitation.id)}
                          label="Copy link"
                        />
                        <IconButton
                          icon={<Trash2 className="w-5 h-5" />}
                          variant="danger"
                          onClick={() => handleRevokeInvitation(invitation.id)}
                          label="Revoke invitation"
                        />
                      </div>
                    )}

                    <p className="text-muted mt-2">
                      Expires: {new Date(invitation.expires_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </main>
    </div>
  );
}
