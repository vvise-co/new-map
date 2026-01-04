import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderPlus, FileText, Layout, Sparkles } from 'lucide-react';
import { createProject } from '@/lib/projectApi';
import { useTeam } from '@/context/TeamContext';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

const templates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Project',
    description: 'Start from scratch with an empty project',
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: 'roadmap',
    name: 'Roadmap',
    description: 'Plan and visualize your product roadmap',
    icon: <Layout className="w-6 h-6" />,
    comingSoon: true,
  },
  {
    id: 'ai-assisted',
    name: 'AI Assisted',
    description: 'Let AI help structure your project',
    icon: <Sparkles className="w-6 h-6" />,
    comingSoon: true,
  },
];

export default function ProjectCreationPage() {
  const navigate = useNavigate();
  const { currentTeam } = useTeam();
  const [step, setStep] = useState<'template' | 'details'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('blank');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.comingSoon) return;

    setSelectedTemplate(templateId);
    setStep('details');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentTeam?.team.id) return;

    setError(null);
    setLoading(true);

    try {
      const project = await createProject(currentTeam.team.id, {
        name,
        description: description || undefined,
      });
      navigate(`/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'details') {
      setStep('template');
    } else {
      navigate('/projects');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 'details' ? 'Back to templates' : 'Back to projects'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step: Template Selection */}
        {step === 'template' && (
          <div>
            <div className="text-center mb-10">
              <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <FolderPlus className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Create New Project
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Choose a template to get started
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  disabled={template.comingSoon}
                  className={`relative text-left p-6 rounded-xl border-2 transition-all ${
                    template.comingSoon
                      ? 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-60'
                      : selectedTemplate === template.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                  }`}
                >
                  {template.comingSoon && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                      Coming Soon
                    </span>
                  )}
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      template.comingSoon
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    }`}
                  >
                    {template.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Quick create button for blank */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Or quickly create a blank project
              </p>
              <button
                onClick={() => handleTemplateSelect('blank')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
              >
                <FolderPlus className="w-5 h-5" />
                Create Blank Project
              </button>
            </div>
          </div>
        )}

        {/* Step: Project Details */}
        {step === 'details' && (
          <div>
            <div className="text-center mb-10">
              <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <FolderPlus className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Project Details
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Give your project a name and description
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="My awesome project"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="What is this project about?"
                />
              </div>

              {/* Template indicator */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Template:{' '}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {templates.find((t) => t.id === selectedTemplate)?.name}
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('template')}
                  className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Change Template
                </button>
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-lg transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
