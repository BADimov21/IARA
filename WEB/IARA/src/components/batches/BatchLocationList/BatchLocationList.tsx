import React, { useState, useEffect } from 'react';
import { batchLocationApi, fishBatchApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel, Select } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { BatchLocationFilter, BaseFilter } from '../../../shared/types';
import type { FilterField } from '../../shared/FilterPanel/FilterPanel';

interface BatchLocationItem {
  id: number;
  batchId?: number;
  locationType?: string;
  locationName?: string;
  arrivedAt?: string;
  name?: string;  // Keep for backward compatibility
  address?: string;  // Keep for backward compatibility
  type?: string;  // Keep for backward compatibility
}

export const BatchLocationList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [locations, setLocations] = useState<BatchLocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BatchLocationItem | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [batches, setBatches] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    batchId: '',
    locationType: '',
    locationName: '',
    arrivedAt: '',
  });

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Search name' },
    { name: 'address', label: 'Address', type: 'text', placeholder: 'Search address' },
    { name: 'type', label: 'Type', type: 'text', placeholder: 'Search type' },
  ];

  useEffect(() => {
    loadLocations();
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const filters = { page: 1, pageSize: 100, filters: {} };
      const data = await fishBatchApi.getAll(filters);
      setBatches(data);
    } catch (error) {
      console.error('Failed to load fish batches:', error);
    }
  };

  const loadLocations = async (customFilters?: BatchLocationFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<BatchLocationFilter> = { page: 1, pageSize: 100, filters: customFilters || {} };
      const data = await batchLocationApi.getAll(filters);
      setLocations(data);
    } catch (error) {
      console.error('Failed to load batch locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: BatchLocationFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        if (key === 'id') {
          filters[key] = Number(value);
        } else {
          filters[key as keyof BatchLocationFilter] = value as any;
        }
      }
    });
    loadLocations(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadLocations({});
  };

  const handleAdd = () => {
    if (!canCreate(role, 'batchLocations')) return;
    if (batches.length === 0) {
      toast.error('Please create at least one fish batch before recording a batch location');
      return;
    }
    setEditingItem(null);
    setFormData({ batchId: '', locationType: '', locationName: '', arrivedAt: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: BatchLocationItem) => {
    if (!canEdit(role, 'batchLocations')) return;
    setEditingItem(item);
    setFormData({
      batchId: item.batchId?.toString() || '',
      locationType: item.locationType || '',
      locationName: item.locationName || '',
      arrivedAt: item.arrivedAt || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'batchLocations')) return;
    
    const confirmed = await confirm({
      title: 'Delete Batch Location',
      message: 'Are you sure you want to delete this batch location? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await batchLocationApi.delete(Number(id));
      toast.success('Batch location deleted successfully');
      await loadLocations();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete batch location');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'batchLocations')) return;
    
    // Validation
    if (!formData.batchId) {
      toast.error('Please select a fish batch');
      return;
    }
    if (!formData.locationType.trim()) {
      toast.error('Please select a location type');
      return;
    }
    if (!formData.locationName.trim()) {
      toast.error('Please enter the location name');
      return;
    }
    if (!formData.arrivedAt) {
      toast.error('Please enter the arrival date and time');
      return;
    }
    
    try {
      const payload = {
        batchId: Number(formData.batchId),
        locationType: formData.locationType,
        locationName: formData.locationName,
        arrivedAt: formData.arrivedAt ? new Date(formData.arrivedAt).toISOString() : '',
      };
      if (editingItem) {
        toast.info('Batch location movements cannot be edited once recorded.');
        setIsModalOpen(false);
        return;
      } else {
        await batchLocationApi.add(payload);
        toast.success('Batch location recorded successfully');
      }
      setIsModalOpen(false);
      await loadLocations();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to record batch location');
    }
  };

  const columns: Column<BatchLocationItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'batchId', header: 'Batch ID', render: (item) => item.batchId || '-' },
    { key: 'locationName', header: 'Location', render: (item) => item.locationName || item.name || '-' },
    { key: 'locationType', header: 'Type', render: (item) => item.locationType || item.type || '-' },
    { key: 'arrivedAt', header: 'Arrived At', render: (item) => {
      const date = item.arrivedAt;
      return date ? new Date(date).toLocaleString() : '-';
    }},
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'batchLocations') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'batchLocations') && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'batchLocations') && (
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
        title="Batch Locations"
        subtitle="Manage storage and processing locations"
        actions={canCreate(role, 'batchLocations') ? <Button variant="primary" onClick={handleAdd}>+ Add Location</Button> : undefined}
      >
        <Table columns={columns} data={locations} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'View Location' : 'Record Batch Movement'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#4338ca' }}>
              <strong>📦 Tracking Batch Movement</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>Record when a fish batch arrives at a storage, processing, or distribution location for traceability throughout the supply chain.</p>
            </div>

            <Select
              label="Fish Batch"
              value={formData.batchId}
              onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
              required
              fullWidth
              helperText="Select the batch being moved"
              options={[
                { value: '', label: '-- Select Fish Batch --' },
                ...batches.map((batch: any) => ({
                  value: batch.id.toString(),
                  label: `${batch.batchCode || batch.batchNumber || `Batch #${batch.id}`} - ${batch.species?.name || batch.fishSpecyName || 'Unknown Species'}`
                }))
              ]}
            />

            <Select
              label="Location Type"
              value={formData.locationType}
              onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
              required
              fullWidth
              helperText="Type of location the batch is moving to"
              options={[
                { value: '', label: '-- Select Location Type --' },
                { value: 'Storage', label: 'Storage Facility' },
                { value: 'Processing', label: 'Processing Plant' },
                { value: 'Distribution', label: 'Distribution Center' },
                { value: 'Retail', label: 'Retail Market' },
                { value: 'Export', label: 'Export Terminal' },
                { value: 'Other', label: 'Other Location' },
              ]}
            />

            <Input 
              label="Location Name" 
              value={formData.locationName} 
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })} 
              required 
              fullWidth 
              placeholder="e.g., Cold Storage Warehouse A"
              helperText="Name or identifier of the location"
              maxLength={200}
            />

            <Input 
              label="Arrival Date & Time" 
              type="datetime-local" 
              value={formData.arrivedAt} 
              onChange={(e) => setFormData({ ...formData, arrivedAt: e.target.value })} 
              required 
              fullWidth 
              helperText="When the batch arrived at this location"
              max={new Date().toISOString().slice(0, 16)}
            />
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
