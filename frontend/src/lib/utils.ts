/**
 * Utility functions for the design system
 */

/**
 * Combine class names, filtering out falsy values
 * Similar to clsx/classnames but lightweight
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format date as relative time (Today, Yesterday, X days ago, or full date)
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

/**
 * Format date as a short date string
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}
