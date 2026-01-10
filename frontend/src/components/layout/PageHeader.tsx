import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import UserMenu from '../UserMenu';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional icon next to title */
  icon?: ReactNode;
  /** Back link URL - if provided, shows back button */
  backTo?: string;
  /** Custom back label for accessibility */
  backLabel?: string;
  /** Action button(s) between title and UserMenu */
  actions?: ReactNode;
  /** Show UserMenu (default: true) */
  showUserMenu?: boolean;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Additional className for header */
  className?: string;
}

export function PageHeader({
  title,
  icon,
  backTo,
  backLabel = 'Go back',
  actions,
  showUserMenu = true,
  subtitle,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('surface-header', className)}>
      <div className="content-container py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {backTo && (
            <Link
              to={backTo}
              className="p-2 hover-surface rounded-lg"
              aria-label={backLabel}
            >
              <ArrowLeft className="w-5 h-5 icon-muted" />
            </Link>
          )}
          <div className="flex items-center gap-2">
            {icon && <span className="icon-primary">{icon}</span>}
            <div>
              <h1 className="text-heading-page">{title}</h1>
              {subtitle && <p className="text-body-sm">{subtitle}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {actions}
          {showUserMenu && <UserMenu />}
        </div>
      </div>
    </header>
  );
}
