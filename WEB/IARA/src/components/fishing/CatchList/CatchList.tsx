import React, { useState, useEffect } from 'react';
import { catchApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { CatchFilter, BaseFilter } from '../../../shared/types';
import type { FilterField } from '../../shared/FilterPanel/FilterPanel';

interface CatchItem {
  id: number;
  fishingTripId?: string;
  fishSpecyId?: string;
  quantity?: number;
  weight?: number;
}

export const CatchList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [catches, setCatches] = useState<CatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatchItem | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    fishingTripId: '',
    fishSpecyId: '',
    quantity: '',
    weight: '',
  });

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'fishingTripId', label: 'Trip ID', type: 'number', placeholder: 'Search by trip' },
    { name: 'fishSpecyId', label: 'Species ID', type: 'number', placeholder: 'Search by species' },
    { name: 'minQuantity', label: 'Min Quantity', type: 'number', placeholder: 'Min quantity' },
    { name: 'maxQuantity', label: 'Max Quantity', type: 'number', placeholder: 'Max quantity' },
    { name: 'minWeight', label: 'Min Weight (kg)', type: 'number', placeholder: 'Min weight' },
    { name: 'maxWeight', label: 'Max Weight (kg)', type: 'number', placeholder: 'Max weight' },
  ];

  useEffect(() => {
    loadCatches();
  }, []);

  const loadCatches = async (customFilters?: CatchFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<CatchFilter> = { page: 1, pageSize: 100, filters: customFilters || {} };
      const data = await catchApi.getAll(filters);
      setCatches(data);
    } catch (error) {
      console.error('Failed to load catches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: CatchFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        filters[key as keyof CatchFilter] = Number(value);
      }
    });
    loadCatches(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadCatches({});
  };

  const handleAdd = () => {
    if (!canCreate(role, 'catches')) return;
    setEditingItem(null);
    setFormData({ fishingTripId: '', fishSpecyId: '', quantity: '', weight: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: CatchItem) => {
    if (!canEdit(role, 'catches')) return;
    setEditingItem(item);
    setFormData({
      fishingTripId: item.fishingTripId?.toString() || '',
      fishSpecyId: item.fishSpecyId?.toString() || '',
      quantity: item.quantity?.toString() || '',
      weight: item.weight?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'catches')) return;
    
    const confirmed = await confirm({
      title: 'Delete Catch',
      message: 'Are you sure you want to delete this catch record? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await catchApi.delete(Number(id));
      toast.success('Catch deleted successfully');
      await loadCatches();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete catch');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'catches')) return;
    try {
      const payload = {
        operationId: 1,
        speciesId: Number(formData.fishSpecyId),
        weightKg: formData.weight ? parseFloat(formData.weight) : 0,
        quantity: formData.quantity ? parseInt(formData.quantity) : 0,
      };
      if (editingItem) {
        // TODO: API might not support edit for catches
        console.log('Edit catch:', { id: editingItem.id, ...payload });
        toast.warning('Edit not supported for catches');
      } else {
        await catchApi.add(payload);
        toast.success('Catch added successfully');
      }
      setIsModalOpen(false);
      await loadCatches();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save catch');
    }
  };

  const columns: Column<CatchItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'fishSpecyName', header: 'Fish Species' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'weight', header: 'Weight (kg)', render: (item) => item.weight ? `${item.weight} kg` : '-' },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'catches') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'catches') && <Button size="small" variant="danger" onClick={() => handleDelete(item.id.toString())}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'catches') && (
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
      <Card
        title="Catches"
        subtitle="Manage catch records"
        actions={canCreate(role, 'catches') ? <Button variant="primary" onClick={handleAdd}>+ Add Catch</Button> : undefined}
      >
        <Table columns={columns} data={catches} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Catch' : 'Add Catch'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Fishing Trip ID" value={formData.fishingTripId} onChange={(e) => setFormData({ ...formData, fishingTripId: e.target.value })} required fullWidth />
              <Input label="Fish Species ID" value={formData.fishSpecyId} onChange={(e) => setFormData({ ...formData, fishSpecyId: e.target.value })} required fullWidth />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required fullWidth />
              <Input label="Weight (kg)" type="number" step="0.01" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} required fullWidth />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">{editingItem ? 'Update' : 'Create'}</Button>
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
