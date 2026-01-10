import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Field label */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text shown below input */
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className, disabled, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="label-base">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            'input-base',
            error && 'input-error',
            disabled && 'input-disabled',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-body-sm">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
