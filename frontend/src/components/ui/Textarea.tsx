import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Field label */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text shown below textarea */
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, id, className, disabled, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={textareaId} className="label-base">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          className={cn(
            'input-base min-h-[100px] resize-y',
            error && 'input-error',
            disabled && 'input-disabled',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="text-body-sm">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
