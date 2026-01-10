import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

type AlertVariant = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  /** Alert type determines colors and default icon */
  variant: AlertVariant;
  /** Alert content */
  children: ReactNode;
  /** Show icon (default: true) */
  showIcon?: boolean;
  /** Custom icon override */
  icon?: ReactNode;
  /** Additional className */
  className?: string;
  /** Optional title */
  title?: string;
  /** Dismissible callback */
  onDismiss?: () => void;
}

const variantConfig = {
  error: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    icon: AlertCircle,
    iconColor: 'text-red-600 dark:text-red-400',
  },
  success: {
    container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
    icon: CheckCircle,
    iconColor: 'text-green-600 dark:text-green-400',
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-700 dark:text-yellow-300',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
};

export function Alert({
  variant,
  children,
  showIcon = true,
  icon,
  className,
  title,
  onDismiss,
}: AlertProps) {
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'p-4 rounded-lg border',
        config.container,
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <span className={cn('flex-shrink-0', config.iconColor)}>
            {icon || <IconComponent className="w-5 h-5" />}
          </span>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <p className={cn('font-medium mb-1', config.text)}>{title}</p>
          )}
          <div className={cn('text-sm', config.text)}>{children}</div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded hover:opacity-70 transition-opacity',
              config.iconColor
            )}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
