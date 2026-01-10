import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  /** Icon to display */
  icon: ReactNode;
  /** Main heading */
  title: string;
  /** Description text */
  description: string;
  /** Action element (usually a Button) */
  action?: ReactNode;
  /** Visual variant */
  variant?: 'card' | 'subtle';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

const sizeConfig = {
  sm: {
    container: 'p-6',
    icon: '[&>svg]:w-8 [&>svg]:h-8',
    title: 'text-base',
    description: 'text-sm',
    iconMargin: 'mb-2',
  },
  md: {
    container: 'p-8',
    icon: '[&>svg]:w-12 [&>svg]:h-12',
    title: 'text-lg',
    description: 'text-base',
    iconMargin: 'mb-4',
  },
  lg: {
    container: 'p-12',
    icon: '[&>svg]:w-16 [&>svg]:h-16',
    title: 'text-xl',
    description: 'text-base',
    iconMargin: 'mb-6',
  },
};

const variantClasses = {
  card: 'surface-card',
  subtle: 'bg-gray-50 dark:bg-gray-800/50 rounded-xl',
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'card',
  size = 'md',
  className,
}: EmptyStateProps) {
  const sizes = sizeConfig[size];

  return (
    <div
      className={cn(
        variantClasses[variant],
        sizes.container,
        'text-center',
        className
      )}
    >
      <div className={cn('text-gray-400 mx-auto', sizes.icon, sizes.iconMargin)}>
        {icon}
      </div>
      <h3 className={cn('font-medium text-gray-900 dark:text-gray-100 mb-2', sizes.title)}>
        {title}
      </h3>
      <p className={cn('text-gray-500 dark:text-gray-400 mb-4', sizes.description)}>
        {description}
      </p>
      {action}
    </div>
  );
}
