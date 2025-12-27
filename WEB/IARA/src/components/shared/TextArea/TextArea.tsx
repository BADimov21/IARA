/**
 * TextArea Component
 * Multi-line text input component
 */

import React, { type TextareaHTMLAttributes } from 'react';
import './TextArea.css';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  required,
  id,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;

  return (
    <div className={`textarea-wrapper ${fullWidth ? 'full-width' : ''}`}>
      {label && (
        <label htmlFor={textareaId} className="textarea-label">
          {label}
          {required && <span className="textarea-required">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`textarea ${error ? 'error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        {...props}
      />
      {error && (
        <span id={errorId} className="textarea-error-text">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={helperId} className="textarea-helper-text">
          {helperText}
        </span>
      )}
    </div>
  );
};
