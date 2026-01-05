import React from 'react';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import './FilterPanel.css';

export interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  placeholder?: string;
  options?: { value: string | number; label: string }[];
}

interface FilterPanelProps {
  fields: FilterField[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onApply: () => void;
  onClear: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  fields,
  values,
  onChange,
  onApply,
  onClear,
  isExpanded,
  onToggle,
}) => {
  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <button
          type="button"
          className="filter-panel-toggle"
          onClick={onToggle}
          aria-expanded={isExpanded}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{isExpanded ? 'Hide' : 'Show'} Filters</span>
        </button>
      </div>

      {isExpanded && (
        <div className="filter-panel-content">
          <div className="filter-panel-fields">
            {fields.map((field) => (
              <div key={field.name} className="filter-field">
                {field.type === 'select' ? (
                  <div>
                    <label className="filter-label">{field.label}</label>
                    <select
                      className="filter-select"
                      value={values[field.name] || ''}
                      onChange={(e) => onChange(field.name, e.target.value)}
                    >
                      <option value="">All</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <Input
                    label={field.label}
                    type={field.type}
                    value={values[field.name] || ''}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    fullWidth
                  />
                )}
              </div>
            ))}
          </div>

          <div className="filter-panel-actions">
            <Button variant="secondary" onClick={onClear} size="small">
              Clear Filters
            </Button>
            <Button variant="primary" onClick={onApply} size="small">
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
