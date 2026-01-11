import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderPlus, FileText, Layout, Sparkles } from 'lucide-react';
import { createProject } from '@/lib/projectApi';
import { useTeam } from '@/context/TeamContext';
import { Alert, Button, Card, Input, Textarea, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

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
    <div className="page-container">
      {/* Header */}
      <header className="surface-header">
        <div className="content-container-narrow py-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-body hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 'details' ? 'Back to templates' : 'Back to projects'}
          </button>
        </div>
      </header>

      <main className="content-container-narrow py-12">
        {/* Step: Template Selection */}
        {step === 'template' && (
          <div>
            <div className="text-center mb-10">
              <div className="icon-container-primary-lg mx-auto mb-4">
                <FolderPlus className="w-8 h-8 icon-primary" />
              </div>
              <h1 className="text-heading-large">Create New Project</h1>
              <p className="mt-2 text-body">Choose a template to get started</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  disabled={template.comingSoon}
                  className={cn(
                    'relative text-left p-6 rounded-xl border-2 transition-all',
                    template.comingSoon
                      ? 'bg-gray-100 dark:bg-gray-800/50 border-subtle cursor-not-allowed opacity-60'
                      : selectedTemplate === template.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                      : 'surface-card border-subtle hover:border-primary-300 dark:hover:border-primary-600'
                  )}
                >
                  {template.comingSoon && (
                    <Badge className="absolute top-3 right-3">Coming Soon</Badge>
                  )}
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
                      template.comingSoon
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        : 'icon-container-primary'
                    )}
                  >
                    <span className={template.comingSoon ? '' : 'icon-primary'}>
                      {template.icon}
                    </span>
                  </div>
                  <h3 className="text-heading-card mb-1">{template.name}</h3>
                  <p className="text-body-sm">{template.description}</p>
                </button>
              ))}
            </div>

            {/* Quick create button for blank */}
            <div className="mt-8 text-center">
              <p className="text-body-sm mb-3">Or quickly create a blank project</p>
              <Button
                onClick={() => handleTemplateSelect('blank')}
                leftIcon={<FolderPlus className="w-5 h-5" />}
                size="lg"
              >
                Create Blank Project
              </Button>
            </div>
          </div>
        )}

        {/* Step: Project Details */}
        {step === 'details' && (
          <div>
            <div className="text-center mb-10">
              <div className="icon-container-primary-lg mx-auto mb-4">
                <FolderPlus className="w-8 h-8 icon-primary" />
              </div>
              <h1 className="text-heading-large">Project Details</h1>
              <p className="mt-2 text-body">Give your project a name and description</p>
            </div>

            {error && <Alert variant="error" className="mb-6">{error}</Alert>}

            <Card padding="lg" className="max-w-lg mx-auto shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Project Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  placeholder="My awesome project"
                />

                <Textarea
                  label="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="What is this project about?"
                />

                {/* Template indicator */}
                <div className="pt-4 border-t border-subtle">
                  <p className="text-body-sm">
                    Template:{' '}
                    <span className="text-heading-card">
                      {templates.find((t) => t.id === selectedTemplate)?.name}
                    </span>
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep('template')}
                    fullWidth
                    size="lg"
                  >
                    Change Template
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={!name.trim()}
                    fullWidth
                    size="lg"
                  >
                    Create Project
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
