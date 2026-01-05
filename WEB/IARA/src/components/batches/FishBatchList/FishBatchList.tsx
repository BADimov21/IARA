import React, { useState, useEffect } from 'react';
import { fishBatchApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FishBatchFilter, BaseFilter } from '../../../shared/types';
import type { FilterField } from '../../shared/FilterPanel/FilterPanel';

interface FishBatchItem {
  id: number;
  fishSpecyId?: string;
  fishSpecyName?: string;
  quantity?: number;
  weight?: number;
  batchNumber?: string;
}

export const FishBatchList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [batches, setBatches] = useState<FishBatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FishBatchItem | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    fishSpecyId: '',
    quantity: '',
    weight: '',
    batchNumber: '',
  });

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'batchNumber', label: 'Batch Number', type: 'text', placeholder: 'Search batch number' },
    { name: 'fishSpecyId', label: 'Species ID', type: 'number', placeholder: 'Search by species' },
    { name: 'minQuantity', label: 'Min Quantity', type: 'number', placeholder: 'Min quantity' },
    { name: 'maxQuantity', label: 'Max Quantity', type: 'number', placeholder: 'Max quantity' },
    { name: 'minWeight', label: 'Min Weight (kg)', type: 'number', placeholder: 'Min weight' },
    { name: 'maxWeight', label: 'Max Weight (kg)', type: 'number', placeholder: 'Max weight' },
  ];

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async (customFilters?: FishBatchFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<FishBatchFilter> = { page: 1, pageSize: 100, filters: customFilters || {} };
      const data = await fishBatchApi.getAll(filters);
      setBatches(data);
    } catch (error) {
      console.error('Failed to load fish batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: FishBatchFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        (filters as any)[key] = key === 'batchNumber' ? value : Number(value);
      }
    });
    loadBatches(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadBatches({});
  };

  const handleAdd = () => {
    if (!canCreate(role, 'fishBatches')) return;
    setEditingItem(null);
    setFormData({ fishSpecyId: '', quantity: '', weight: '', batchNumber: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: FishBatchItem) => {
    if (!canEdit(role, 'fishBatches')) return;
    setEditingItem(item);
    setFormData({
      fishSpecyId: item.fishSpecyId || '',
      quantity: item.quantity?.toString() || '',
      weight: item.weight?.toString() || '',
      batchNumber: item.batchNumber || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'fishBatches')) return;
    
    const confirmed = await confirm({
      title: 'Delete Fish Batch',
      message: 'Are you sure you want to delete this fish batch? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await fishBatchApi.delete(Number(id));
      toast.success('Fish batch deleted successfully');
      await loadBatches();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete fish batch');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'fishBatches')) return;
    try {
      const payload = {
        landingId: 1,
        speciesId: Number(formData.fishSpecyId),
        batchCode: formData.batchNumber,
        weightKg: formData.weight ? parseFloat(formData.weight) : 0,
        quantity: formData.quantity ? parseInt(formData.quantity) : 0,
      };
      if (editingItem) {
        await fishBatchApi.edit({ id: editingItem.id, ...payload });
        toast.success('Fish batch updated successfully');
      } else {
        await fishBatchApi.add(payload);
        toast.success('Fish batch added successfully');
      }
      setIsModalOpen(false);
      await loadBatches();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save fish batch');
    }
  };

  const columns: Column<FishBatchItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'batchNumber', header: 'Batch Number' },
    { key: 'fishSpecyName', header: 'Fish Species' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'weight', header: 'Weight (kg)', render: (item) => item.weight ? `${item.weight} kg` : '-' },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'fishBatches') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'fishBatches') && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'fishBatches') && (
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
        title="Fish Batches"
        subtitle="Manage fish batch inventory"
        actions={canCreate(role, 'fishBatches') ? <Button variant="primary" onClick={handleAdd}>+ Add Batch</Button> : undefined}
      >
        <Table columns={columns} data={batches} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Batch' : 'Add Batch'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Batch Number" value={formData.batchNumber} onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })} required fullWidth />
            <Input label="Fish Species ID" value={formData.fishSpecyId} onChange={(e) => setFormData({ ...formData, fishSpecyId: e.target.value })} required fullWidth />
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
