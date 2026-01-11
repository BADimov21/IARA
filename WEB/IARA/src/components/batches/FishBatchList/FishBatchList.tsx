import React, { useState, useEffect } from 'react';
import { fishBatchApi, landingApi, fishSpecyApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel, Select } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FishBatchFilter, BaseFilter } from '../../../shared/types';
import type { FilterField } from '../../shared/FilterPanel/FilterPanel';

interface FishBatchItem {
  id: number;
  landingId?: number;
  fishSpecyId?: string;
  speciesId?: number;
  fishSpecyName?: string;
  species?: { name?: string };
  quantity?: number;
  weight?: number;
  weightKg?: number;
  batchNumber?: string;
  batchCode?: string;
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
  const [fishSpecies, setFishSpecies] = useState<any[]>([]);
  const [landings, setLandings] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    landingId: '',
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
    loadFishSpecies();
    loadLandings();
  }, []);

  const loadFishSpecies = async () => {
    try {
      const filters = { page: 1, pageSize: 100, filters: {} };
      const data = await fishSpecyApi.getAll(filters);
      setFishSpecies(data);
    } catch (error) {
      console.error('Failed to load fish species:', error);
    }
  };

  const loadLandings = async () => {
    try {
      const filters = { page: 1, pageSize: 100, filters: {} };
      const data = await landingApi.getAll(filters);
      setLandings(data);
    } catch (error) {
      console.error('Failed to load landings:', error);
    }
  };

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
    if (landings.length === 0) {
      toast.error('Please create at least one landing before creating a fish batch');
      return;
    }
    setEditingItem(null);
    setFormData({ landingId: '', fishSpecyId: '', quantity: '', weight: '', batchNumber: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: FishBatchItem) => {
    if (!canEdit(role, 'fishBatches')) return;
    setEditingItem(item);
    const weight = item.weightKg || item.weight;
    const batchCode = item.batchCode || item.batchNumber;
    const speciesId = item.speciesId || item.fishSpecyId;
    setFormData({
      landingId: item.landingId?.toString() || '',
      fishSpecyId: speciesId?.toString() || '',
      quantity: item.quantity?.toString() || '',
      weight: weight?.toString() || '',
      batchNumber: batchCode || '',
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
    
    // Validation
    if (!formData.landingId) {
      toast.error('Please select a landing');
      return;
    }
    if (!formData.fishSpecyId) {
      toast.error('Please select a fish species');
      return;
    }
    if (!formData.batchNumber.trim()) {
      toast.error('Please enter a batch number');
      return;
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }
    
    try {
      const payload = {
        landingId: Number(formData.landingId),
        speciesId: Number(formData.fishSpecyId),
        batchCode: formData.batchNumber,
        weightKg: parseFloat(formData.weight),
        quantity: parseInt(formData.quantity),
      };
      if (editingItem) {
        await fishBatchApi.edit({ id: editingItem.id, ...payload });
        toast.success('Fish batch updated successfully');
      } else {
        await fishBatchApi.add(payload);
        toast.success('Fish batch created successfully');
      }
      setIsModalOpen(false);
      await loadBatches();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error(editingItem ? 'Failed to update fish batch' : 'Failed to create fish batch');
    }
  };

  const columns: Column<FishBatchItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'batchNumber', header: 'Batch Number', render: (item) => item.batchCode || item.batchNumber || '-' },
    { key: 'fishSpecyName', header: 'Fish Species', render: (item) => item.species?.name || item.fishSpecyName || '-' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'weight', header: 'Weight (kg)', render: (item) => {
      const weight = item.weightKg || item.weight;
      return weight ? `${weight} kg` : '-';
    }},
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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Batch' : 'Create Fish Batch'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#4338ca' }}>
              <strong>🐟 Creating a Fish Batch</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>A fish batch represents a specific quantity and species of fish from a landing, identified by a unique batch code for tracking through processing and distribution.</p>
            </div>

            <Input 
              label="Batch Number" 
              value={formData.batchNumber} 
              onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })} 
              required 
              fullWidth 
              placeholder="e.g., BATCH-2026-001"
              helperText="Unique identifier for this batch"
            />

            <Select
              label="Landing"
              value={formData.landingId}
              onChange={(e) => setFormData({ ...formData, landingId: e.target.value })}
              required
              fullWidth
              helperText="Select the landing this batch comes from"
              options={[
                { value: '', label: '-- Select Landing --' },
                ...landings.map((landing: any) => ({
                  value: landing.id.toString(),
                  label: `Landing #${landing.id} - ${landing.landingDateTime || landing.landingDate ? new Date(landing.landingDateTime || landing.landingDate).toLocaleDateString() : 'N/A'} at ${landing.port || 'Unknown Port'}`
                }))
              ]}
            />

            <Select
              label="Fish Species"
              value={formData.fishSpecyId}
              onChange={(e) => setFormData({ ...formData, fishSpecyId: e.target.value })}
              required
              fullWidth
              helperText="Select the species of fish in this batch"
              options={[
                { value: '', label: '-- Select Fish Species --' },
                ...fishSpecies.map((species: any) => ({
                  value: species.id.toString(),
                  label: species.name || species.speciesName || 'Unknown'
                }))
              ]}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input 
                label="Quantity" 
                type="number" 
                value={formData.quantity} 
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} 
                required 
                fullWidth 
                min="1"
                placeholder="Number of fish"
                helperText="Total number of fish in batch"
              />
              <Input 
                label="Weight (kg)" 
                type="number" 
                step="0.01" 
                value={formData.weight} 
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })} 
                required 
                fullWidth 
                min="0.01"
                placeholder="0.00"
                helperText="Total weight in kilograms"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">{editingItem ? 'Update' : 'Create Batch'}</Button>
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
