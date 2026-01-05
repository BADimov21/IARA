/**
 * FishSpecyList Component
 * Displays list of fish species with role-based access
 */

import React, { useState, useEffect } from 'react';
import { fishSpecyApi } from '../../../shared/api';
import { Table, Button, Card, Loading, Modal, Input, ConfirmDialog, useToast, FilterPanel } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FilterField } from '../../shared';
import type { FishSpecyFilter, BaseFilter } from '../../../shared/types';

interface FishSpecyItem {
  id: number;
  speciesName: string;
}

export const FishSpecyList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [fishSpecies, setFishSpecies] = useState<FishSpecyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FishSpecyItem | null>(null);
  const [formData, setFormData] = useState({ speciesName: '' });
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'speciesName', label: 'Species Name', type: 'text', placeholder: 'Search species name' },
  ];

  const loadData = async (customFilters?: FishSpecyFilter) => {
    setIsLoading(true);
    try {
      const filters: BaseFilter<FishSpecyFilter> = {
        page: 1,
        pageSize: 100,
        filters: customFilters || {},
      };
      const response = await fishSpecyApi.getAll(filters);
      if (response && Array.isArray(response)) {
        setFishSpecies(response);
      }
    } catch (error: any) {
      console.error('Failed to load fish species:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: FishSpecyFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        if (key === 'id') {
          filters[key] = Number(value);
        } else {
          filters[key as keyof FishSpecyFilter] = value as any;
        }
      }
    });
    loadData(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadData({});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    if (!canCreate(role, 'fishSpecies')) return;
    setEditingItem(null);
    setFormData({ speciesName: '' });
    setShowModal(true);
  };

  const handleEdit = (item: FishSpecyItem) => {
    if (!canEdit(role, 'fishSpecies')) return;
    setEditingItem(item);
    setFormData({ speciesName: item.speciesName });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'fishSpecies')) return;
    
    const confirmed = await confirm({
      title: 'Delete Fish Species',
      message: 'Are you sure you want to delete this fish species? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await fishSpecyApi.delete(Number(id));
      toast.success('Fish species deleted successfully');
      await loadData();
    } catch (error: any) {
      console.error('Failed to delete fish species:', error);
      toast.error('Failed to delete fish species');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'fishSpecies')) return;

    try {
      console.log('Submitting fish species:', editingItem ? 'EDIT' : 'ADD');
      console.log('Form data:', formData);
      console.log('Editing item:', editingItem);
      
      if (editingItem) {
        const payload = { id: editingItem.id, speciesName: formData.speciesName };
        console.log('Edit payload:', payload);
        await fishSpecyApi.edit(payload);
        console.log('Edit successful');
        toast.success('Fish species updated successfully');
      } else {
        const payload = { speciesName: formData.speciesName };
        console.log('Add payload:', payload);
        await fishSpecyApi.add(payload);
        console.log('Add successful');
        toast.success('Fish species added successfully');
      }
      setShowModal(false);
      await loadData();
    } catch (error: any) {
      console.error('Failed to save fish species - Full error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      const errorMsg = error.message || error.statusCode || 'Unknown error';
      toast.error(`Failed to save: ${errorMsg}`);
    }
  };

  const columns: Column<FishSpecyItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'speciesName', header: 'Species Name', sortable: true },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'fishSpecies') && (
            <Button size="small" variant="primary" onClick={() => handleEdit(item)}>
              Edit
            </Button>
          )}
          {canDelete(role, 'fishSpecies') && (
            <Button size="small" variant="danger" onClick={() => handleDelete(item.id.toString())}>
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loading text="Loading fish species..." />;
  }

  return (
    <div>
      {!canCreate(role, 'fishSpecies') && (
        <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', color: '#0369a1' }}>
          You have view-only access to this page.
        </div>
      )}

      <FilterPanel
        fields={filterFields}
        values={filterValues}
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        isExpanded={isFilterExpanded}
        onToggle={() => setIsFilterExpanded(!isFilterExpanded)}
      />

      <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', borderLeft: '4px solid rgb(99, 102, 241)' }}>
        <strong>🐟 Fish Species Management</strong>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
          Manage the database of fish species that can be caught. This nomenclature is used throughout the system for catch recording and reporting.
        </p>
      </div>

      <Card
        title="Fish Species"
        subtitle="Manage fish species nomenclature"
        actions={canCreate(role, 'fishSpecies') ? <Button variant="primary" onClick={handleAdd}>+ Add Fish Species</Button> : undefined}
      >
        <Table columns={columns} data={fishSpecies} />
      </Card>

      {showModal && (
        <Modal
          title={editingItem ? 'Edit Fish Species' : 'Add Fish Species'}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          size="medium"
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Input
              label="Species Name"
              value={formData.speciesName}
              onChange={(e) => setFormData({ ...formData, speciesName: e.target.value })}
              required
              fullWidth
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title || 'Confirm'}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};
