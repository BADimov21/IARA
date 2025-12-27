/**
 * FishSpecyForm Component
 * Form for creating/editing fish species
 */

import React, { useState } from 'react';
import { fishSpecyApi } from '../../../shared/api';
import { Button, Input } from '../../shared';
import { useToast } from '../../shared/Toast';

interface FishSpecy {
  id: number;
  speciesName: string;
  latinName?: string;
  code?: string;
}

interface FishSpecyFormProps {
  initialData?: FishSpecy;
  onSuccess: () => void;
  onCancel: () => void;
}

export const FishSpecyForm: React.FC<FishSpecyFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    speciesName: initialData?.speciesName || '',
    latinName: initialData?.latinName || '',
    code: initialData?.code || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.speciesName.trim()) {
      newErrors.speciesName = 'Species name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      if (initialData) {
        await fishSpecyApi.edit({
          id: initialData.id,
          speciesName: formData.speciesName,
        });
        toast.success('Fish species updated successfully');
      } else {
        await fishSpecyApi.add({
          speciesName: formData.speciesName,
        });
        toast.success('Fish species created successfully');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save fish species');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input
        label="Species Name"
        name="speciesName"
        value={formData.speciesName}
        onChange={handleChange}
        error={errors.speciesName}
        fullWidth
        required
      />

      <Input
        label="Latin Name"
        name="latinName"
        value={formData.latinName}
        onChange={handleChange}
        error={errors.latinName}
        fullWidth
      />

      <Input
        label="Code"
        name="code"
        value={formData.code}
        onChange={handleChange}
        error={errors.code}
        fullWidth
      />

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
          {initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};
