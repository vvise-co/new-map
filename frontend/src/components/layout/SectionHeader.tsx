import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  /** Section title */
  title: string;
  /** Optional icon before title */
  icon?: ReactNode;
  /** Action element (button, link, etc.) */
  action?: ReactNode;
  /** Optional description text */
  description?: string;
  /** Additional className */
  className?: string;
}

export function SectionHeader({
  title,
  icon,
  action,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div>
        <div className="flex items-center gap-2">
          {icon && <span className="icon-muted">{icon}</span>}
          <h3 className="text-heading-section">{title}</h3>
        </div>
        {description && <p className="text-body-sm mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
