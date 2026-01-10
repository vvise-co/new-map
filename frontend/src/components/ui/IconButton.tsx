import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon element to display */
  icon: ReactNode;
  /** Visual variant */
  variant?: 'ghost' | 'subtle' | 'danger';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label (required for icon-only buttons) */
  label: string;
}

const variantClasses = {
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400',
  subtle: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400',
  danger: 'hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400',
};

const sizeClasses = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'ghost', size = 'md', label, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'rounded-lg transition-colors inline-flex items-center justify-center',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        aria-label={label}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
