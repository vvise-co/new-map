import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size */
  size?: ButtonSize;
  /** Loading state - shows spinner and disables button */
  loading?: boolean;
  /** Icon before text */
  leftIcon?: ReactNode;
  /** Icon after text */
  rightIcon?: ReactNode;
  /** Full width button */
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white',
  secondary:
    'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800',
  ghost:
    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
  danger:
    'bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white',
  link:
    'text-primary-600 dark:text-primary-400 hover:underline p-0',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors',
          'disabled:cursor-not-allowed',
          variantClasses[variant],
          variant !== 'link' && sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <Spinner size="sm" className="border-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
