import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/layout';
import { Card, Badge } from '@/components/ui';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <PageHeader title="Profile" backTo="/dashboard" containerClass="content-container-narrow" />

      <main className="content-container-narrow py-8">
        <Card>
          {/* Profile header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
            <div className="flex items-center gap-4">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-primary-600 text-2xl font-bold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="text-white">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="opacity-90">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Profile details */}
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-heading-section mb-4">Account Details</h3>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="surface-subtle p-4">
                  <dt className="text-body-sm">Full Name</dt>
                  <dd className="mt-1 text-heading-card">{user?.name}</dd>
                </div>
                <div className="surface-subtle p-4">
                  <dt className="text-body-sm">Email Address</dt>
                  <dd className="mt-1 text-heading-card">{user?.email}</dd>
                </div>
                <div className="surface-subtle p-4">
                  <dt className="text-body-sm">Auth Provider</dt>
                  <dd className="mt-1 text-heading-card capitalize">
                    {user?.provider?.toLowerCase()}
                  </dd>
                </div>
                <div className="surface-subtle p-4">
                  <dt className="text-body-sm">Email Verified</dt>
                  <dd className="mt-1 text-heading-card">
                    {user?.email_verified ? 'Yes' : 'No'}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-heading-section mb-4">Roles</h3>
              <div className="flex flex-wrap gap-2">
                {user?.roles?.map((role) => (
                  <Badge
                    key={role}
                    variant={role === 'ADMIN' ? 'purple' : 'blue'}
                    size="md"
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
