/**
 * Checkbox Component
 * Checkbox input with label
 */

import React, { type InputHTMLAttributes } from 'react';
import './Checkbox.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  id,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${checkboxId}-error`;

  return (
    <div className="checkbox-wrapper">
      <div className="checkbox-container">
        <input
          type="checkbox"
          id={checkboxId}
          className={`checkbox ${error ? 'error' : ''}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {label && (
          <label htmlFor={checkboxId} className="checkbox-label">
            {label}
          </label>
        )}
      </div>
      {error && (
        <span id={errorId} className="checkbox-error-text">
          {error}
        </span>
      )}
    </div>
  );
};
