import { Link } from 'react-router-dom';
import { FolderOpen, Star, StarOff } from 'lucide-react';
import { Project } from '../../lib/types';
import { formatRelativeDate, cn } from '../../lib/utils';

interface ProjectCardProps {
  /** Project data */
  project: Project;
  /** Compact variant for dashboard recent projects */
  variant?: 'default' | 'compact';
  /** Star toggle handler - if provided, shows star toggle button */
  onToggleStar?: (e: React.MouseEvent, project: Project) => void;
  /** Additional className */
  className?: string;
}

export function ProjectCard({
  project,
  variant = 'default',
  onToggleStar,
  className,
}: ProjectCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        to={`/projects/${project.id}`}
        className={cn('surface-card-interactive p-4 flex items-center gap-4', className)}
      >
        <div className="icon-container-primary p-2.5">
          <FolderOpen className="w-5 h-5 icon-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-heading-card truncate">{project.name}</h4>
          <p className="text-muted">{formatRelativeDate(project.updated_at)}</p>
        </div>
        {project.starred && (
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
        )}
      </Link>
    );
  }

  return (
    <Link
      to={`/projects/${project.id}`}
      className={cn('surface-card-interactive p-6 group relative block', className)}
    >
      {onToggleStar && (
        <button
          onClick={(e) => onToggleStar(e, project)}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover-surface z-10"
          aria-label={project.starred ? 'Remove from favorites' : 'Add to favorites'}
        >
          {project.starred ? (
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          ) : (
            <StarOff className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          )}
        </button>
      )}
      <div className="flex items-start gap-4">
        <div className="icon-container-primary p-3">
          <FolderOpen className="w-6 h-6 icon-primary" />
        </div>
        <div className="flex-1 min-w-0 pr-8">
          <h3 className="text-heading-card truncate">{project.name}</h3>
          {project.description && (
            <p className="text-body-sm mt-1 line-clamp-2">{project.description}</p>
          )}
          <p className="text-muted mt-2">Updated {formatRelativeDate(project.updated_at)}</p>
        </div>
      </div>
    </Link>
  );
}
