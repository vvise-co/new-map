import { useState, useEffect } from 'react';
import { Settings, User, Users, Save, Plus, Trash2 } from 'lucide-react';
import { useTeam } from '@/context/TeamContext';
import {
  getUserSettings,
  patchUserSettings,
  removeUserSettingsKey,
  getTeamSettings,
  patchTeamSettings,
  removeTeamSettingsKey,
} from '@/lib/settingsApi';
import { PageHeader } from '@/components/layout';
import { LoadingScreen } from '@/components/feedback';
import { Alert, Button, Card, IconButton } from '@/components/ui';
import { cn } from '@/lib/utils';

type SettingsTab = 'user' | 'team';

interface SettingField {
  key: string;
  value: string;
  isNew?: boolean;
}

export default function SettingsPage() {
  const { currentTeam } = useTeam();
  const [activeTab, setActiveTab] = useState<SettingsTab>('user');
  const [userFields, setUserFields] = useState<SettingField[]>([]);
  const [teamFields, setTeamFields] = useState<SettingField[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isAdmin = currentTeam?.team.current_user_role === 'OWNER' ||
                  currentTeam?.team.current_user_role === 'ADMIN';

  useEffect(() => {
    loadSettings();
  }, [currentTeam]);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const userSettingsData = await getUserSettings();
      setUserFields(dataToFields(userSettingsData.data));

      if (currentTeam) {
        const teamSettingsData = await getTeamSettings(currentTeam.team.id);
        setTeamFields(dataToFields(teamSettingsData.data));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const dataToFields = (data: Record<string, unknown>): SettingField[] => {
    return Object.entries(data).map(([key, value]) => ({
      key,
      value: typeof value === 'string' ? value : JSON.stringify(value),
    }));
  };

  const fieldsToData = (fields: SettingField[]): Record<string, unknown> => {
    const data: Record<string, unknown> = {};
    fields.forEach(field => {
      if (field.key.trim()) {
        try {
          data[field.key] = JSON.parse(field.value);
        } catch {
          data[field.key] = field.value;
        }
      }
    });
    return data;
  };

  const handleAddField = (type: 'user' | 'team') => {
    const newField: SettingField = { key: '', value: '', isNew: true };
    if (type === 'user') {
      setUserFields([...userFields, newField]);
    } else {
      setTeamFields([...teamFields, newField]);
    }
  };

  const handleRemoveField = async (type: 'user' | 'team', index: number) => {
    const fields = type === 'user' ? userFields : teamFields;
    const field = fields[index];

    if (field.isNew) {
      const newFields = fields.filter((_, i) => i !== index);
      if (type === 'user') {
        setUserFields(newFields);
      } else {
        setTeamFields(newFields);
      }
      return;
    }

    if (!field.key) return;

    try {
      setSaving(true);
      setError(null);

      if (type === 'user') {
        const updated = await removeUserSettingsKey(field.key);
        setUserFields(dataToFields(updated.data));
      } else if (currentTeam) {
        const updated = await removeTeamSettingsKey(currentTeam.team.id, field.key);
        setTeamFields(dataToFields(updated.data));
      }

      setSuccess(`Removed "${field.key}" successfully`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to remove setting:', err);
      setError('Failed to remove setting');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (
    type: 'user' | 'team',
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    if (type === 'user') {
      const newFields = [...userFields];
      newFields[index] = { ...newFields[index], [field]: value };
      setUserFields(newFields);
    } else {
      const newFields = [...teamFields];
      newFields[index] = { ...newFields[index], [field]: value };
      setTeamFields(newFields);
    }
  };

  const handleSave = async (type: 'user' | 'team') => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const fields = type === 'user' ? userFields : teamFields;
      const data = fieldsToData(fields);

      if (type === 'user') {
        const updated = await patchUserSettings(data);
        setUserFields(dataToFields(updated.data));
      } else if (currentTeam) {
        const updated = await patchTeamSettings(currentTeam.team.id, data);
        setTeamFields(dataToFields(updated.data));
      }

      setSuccess(`${type === 'user' ? 'User' : 'Team'} settings saved successfully`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const renderFieldEditor = (
    type: 'user' | 'team',
    fields: SettingField[],
    readonly: boolean = false
  ) => (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <p className="text-body-sm text-center py-4">
          No settings configured yet. Add a new setting to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Key"
                  value={field.key}
                  onChange={(e) => handleFieldChange(type, index, 'key', e.target.value)}
                  disabled={readonly || (!field.isNew && !!field.key)}
                  className="input-base"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={field.value}
                  onChange={(e) => handleFieldChange(type, index, 'value', e.target.value)}
                  disabled={readonly}
                  className="input-base"
                />
              </div>
              {!readonly && (
                <IconButton
                  icon={<Trash2 className="w-5 h-5" />}
                  variant="danger"
                  onClick={() => handleRemoveField(type, index)}
                  disabled={saving}
                  label="Remove setting"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {!readonly && (
        <div className="flex items-center justify-between pt-4 border-t border-subtle">
          <Button
            variant="ghost"
            onClick={() => handleAddField(type)}
            disabled={saving}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Setting
          </Button>
          <Button
            onClick={() => handleSave(type)}
            loading={saving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Settings"
        icon={<Settings className="w-6 h-6" />}
        backTo="/dashboard"
      />

      <main className="content-container-narrow py-8">
        {error && <Alert variant="error" className="mb-6">{error}</Alert>}
        {success && <Alert variant="success" className="mb-6">{success}</Alert>}

        <Card>
          {/* Tabs */}
          <div className="border-b border-subtle">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('user')}
                className={cn(
                  'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'user'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-body hover:text-gray-700 dark:hover:text-gray-200'
                )}
              >
                <User className="w-4 h-4" />
                User Settings
              </button>
              {currentTeam && (
                <button
                  onClick={() => setActiveTab('team')}
                  className={cn(
                    'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                    activeTab === 'team'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-body hover:text-gray-700 dark:hover:text-gray-200'
                  )}
                >
                  <Users className="w-4 h-4" />
                  Team Settings
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'user' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-heading-section">User Preferences</h2>
                  <p className="text-body-sm">
                    Personal settings that only apply to your account.
                  </p>
                </div>
                {renderFieldEditor('user', userFields)}
              </div>
            )}

            {activeTab === 'team' && currentTeam && (
              <div>
                <div className="mb-6">
                  <h2 className="text-heading-section">
                    Team Settings - {currentTeam.team.name}
                  </h2>
                  <p className="text-body-sm">
                    {isAdmin
                      ? 'Settings that apply to all team members.'
                      : 'View-only. Only admins can modify team settings.'}
                  </p>
                </div>
                {renderFieldEditor('team', teamFields, !isAdmin)}
              </div>
            )}
          </div>
        </Card>

        <Alert variant="info" className="mt-6">
          <strong className="block mb-1">About Settings</strong>
          <ul className="text-sm space-y-1">
            <li>Settings are stored as key-value pairs.</li>
            <li>Values can be strings, numbers, booleans, or JSON objects.</li>
            <li>Changes are saved when you click "Save Changes".</li>
            <li>Removing a key deletes it immediately.</li>
          </ul>
        </Alert>
      </main>
    </div>
  );
}
