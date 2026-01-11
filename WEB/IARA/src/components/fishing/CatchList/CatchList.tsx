import React, { useState, useEffect } from 'react';
import { catchApi, fishSpecyApi, fishingOperationApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel, Select } from '../../shared';
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
  const [fishSpecies, setFishSpecies] = useState<any[]>([]);
  const [operations, setOperations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    operationId: '',
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
    loadFishSpecies();
    loadOperations();
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

  const loadOperations = async () => {
    try {
      const filters = { page: 1, pageSize: 100, filters: {} };
      const data = await fishingOperationApi.getAll(filters);
      setOperations(data);
    } catch (error) {
      console.error('Failed to load fishing operations:', error);
    }
  };

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
    setFormData({ operationId: '', fishSpecyId: '', quantity: '', weight: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: CatchItem) => {
    if (!canEdit(role, 'catches')) return;
    setEditingItem(item);
    setFormData({
      operationId: item.fishingTripId?.toString() || '',
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
    
    // Validation
    if (!formData.operationId) {
      toast.error('Please select a fishing operation');
      return;
    }
    if (!formData.fishSpecyId) {
      toast.error('Please select a fish species');
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
        operationId: Number(formData.operationId),
        speciesId: Number(formData.fishSpecyId),
        weightKg: parseFloat(formData.weight),
        quantity: parseInt(formData.quantity),
      };
      if (editingItem) {
        await catchApi.edit({ id: editingItem.id, ...payload });
        toast.success('Catch updated successfully');
      } else {
        await catchApi.add(payload);
        toast.success('Catch recorded successfully');
      }
      setIsModalOpen(false);
      await loadCatches();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error(editingItem ? 'Failed to update catch' : 'Failed to record catch');
    }
  };

  const columns: Column<CatchItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { 
      key: 'fishSpecyName', 
      header: 'Fish Species',
      render: (item: any) => item.species?.name || item.speciesName || item.fishSpecyName || '-'
    },
    { 
      key: 'quantity', 
      header: 'Quantity',
      render: (item: any) => item.quantity || '-'
    },
    { 
      key: 'weight', 
      header: 'Weight (kg)', 
      render: (item: any) => {
        const weight = item.weightKg ?? item.weight;
        return weight ? `${weight} kg` : '-';
      }
    },
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
      {!canCreate(role, 'catches') && (
        <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', color: '#0369a1' }}>
          <strong>ℹ️ Commercial Catches</strong>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            This page is for commercial fishing catches linked to vessel trips. If you're a recreational fisher, 
            please use the <a href="/recreational/catches" style={{ color: '#0284c7', textDecoration: 'underline' }}>Recreational Catches</a> page to record your catches with your fishing ticket.
          </p>
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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Catch' : 'Record Catch'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#4338ca' }}>
              <strong>📝 Recording a Catch</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>Select the fishing operation where this catch was made, then specify the species and amount caught.</p>
            </div>

            <Select
              label="Fishing Operation"
              value={formData.operationId}
              onChange={(e) => setFormData({ ...formData, operationId: e.target.value })}
              required
              fullWidth
              helperText="Select the operation during which this catch was made"
              options={[
                { value: '', label: '-- Select Fishing Operation --' },
                ...operations.map((op: any) => ({
                  value: op.id.toString(),
                  label: `Operation #${op.id} - ${op.startDateTime ? new Date(op.startDateTime).toLocaleDateString() : 'N/A'} ${op.fishingGear?.name ? `(${op.fishingGear.name})` : ''}`
                }))
              ]}
            />

            <Select
              label="Fish Species"
              value={formData.fishSpecyId}
              onChange={(e) => setFormData({ ...formData, fishSpecyId: e.target.value })}
              required
              fullWidth
              helperText="Select the species of fish caught"
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
                helperText="Total number of fish caught"
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
              <Button type="submit" variant="primary">{editingItem ? 'Update' : 'Record Catch'}</Button>
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
