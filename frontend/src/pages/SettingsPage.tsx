import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, User, Users, Save, Plus, Trash2, AlertCircle } from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import { useTeam } from '@/context/TeamContext';
import {
  getUserSettings,
  patchUserSettings,
  removeUserSettingsKey,
  getTeamSettings,
  patchTeamSettings,
  removeTeamSettingsKey,
} from '@/lib/settingsApi';

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
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
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
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={field.value}
                  onChange={(e) => handleFieldChange(type, index, 'value', e.target.value)}
                  disabled={readonly}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                />
              </div>
              {!readonly && (
                <button
                  onClick={() => handleRemoveField(type, index)}
                  disabled={saving}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Remove setting"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!readonly && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => handleAddField(type)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Setting
          </button>
          <button
            onClick={() => handleSave(type)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700
                     disabled:bg-primary-400 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
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
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
            </div>
          </div>
          <UserMenu />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-700 dark:text-green-300">{success}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('user')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'user'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <User className="w-4 h-4" />
                User Settings
              </button>
              {currentTeam && (
                <button
                  onClick={() => setActiveTab('team')}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'team'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
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
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    User Preferences
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Personal settings that only apply to your account.
                  </p>
                </div>
                {renderFieldEditor('user', userFields)}
              </div>
            )}

            {activeTab === 'team' && currentTeam && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Team Settings - {currentTeam.team.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isAdmin
                      ? 'Settings that apply to all team members.'
                      : 'View-only. Only admins can modify team settings.'}
                  </p>
                </div>
                {renderFieldEditor('team', teamFields, !isAdmin)}
              </div>
            )}
          </div>
        </div>

        {/* Settings Info */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            About Settings
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>Settings are stored as key-value pairs.</li>
            <li>Values can be strings, numbers, booleans, or JSON objects.</li>
            <li>Changes are saved when you click "Save Changes".</li>
            <li>Removing a key deletes it immediately.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
