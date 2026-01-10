import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'purple'
  | 'blue'
  | 'green';

interface BadgeProps {
  children: ReactNode;
  /** Color variant */
  variant?: BadgeVariant;
  /** Size */
  size?: 'sm' | 'md';
  /** Additional className */
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// Convenience component for team roles
type TeamRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

const roleVariantMap: Record<TeamRole, BadgeVariant> = {
  OWNER: 'purple',
  ADMIN: 'blue',
  MEMBER: 'green',
  VIEWER: 'default',
};

export function RoleBadge({ role }: { role: string }) {
  const variant = roleVariantMap[role as TeamRole] || 'default';
  return <Badge variant={variant}>{role}</Badge>;
}
