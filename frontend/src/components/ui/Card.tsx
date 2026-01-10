import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  /** Add hover shadow effect for clickable cards */
  interactive?: boolean;
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

interface CardHeaderProps {
  children: ReactNode;
  /** Add bottom border */
  bordered?: boolean;
  /** Additional className */
  className?: string;
}

interface CardBodyProps {
  children: ReactNode;
  /** Additional className */
  className?: string;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  interactive = false,
  padding = 'none',
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        'surface-card',
        interactive && 'hover:shadow-md transition-shadow cursor-pointer',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  bordered = true,
  className,
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'p-6',
        bordered && 'border-b border-subtle',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn('p-6', className)}>{children}</div>;
}
