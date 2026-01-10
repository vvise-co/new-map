import { Spinner } from '../ui/Spinner';
import { cn } from '../../lib/utils';

interface LoadingScreenProps {
  /** Optional message to display below spinner */
  message?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Full screen or inline container */
  fullScreen?: boolean;
  /** Additional className */
  className?: string;
}

export function LoadingScreen({
  message,
  size = 'lg',
  fullScreen = true,
  className,
}: LoadingScreenProps) {
  const content = (
    <div className="text-center">
      <Spinner size={size} className="mx-auto" />
      {message && <p className="mt-4 text-body">{message}</p>}
    </div>
  );

  if (!fullScreen) {
    return <div className={cn('flex items-center justify-center py-12', className)}>{content}</div>;
  }

  return (
    <div className={cn('page-container flex items-center justify-center', className)}>
      {content}
    </div>
  );
}
