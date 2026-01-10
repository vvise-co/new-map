import { cn } from '../../lib/utils';

interface SpinnerProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

const sizeClasses = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-2 border-b-2 border-primary-600',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
