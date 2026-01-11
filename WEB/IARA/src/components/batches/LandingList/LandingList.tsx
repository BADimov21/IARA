import React, { useState, useEffect } from 'react';
import { landingApi, fishingTripApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel, Select } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { LandingFilter, BaseFilter } from '../../../shared/types';
import type { FilterField } from '../../shared/FilterPanel/FilterPanel';

interface LandingItem {
  id: number;
  tripId?: number;
  fishingTripId?: number | string;
  landingDate?: string;
  landingDateTime?: string;
  port?: string;
  totalWeight?: number;
  totalWeightKg?: number;
}

export const LandingList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [landings, setLandings] = useState<LandingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LandingItem | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [fishingTrips, setFishingTrips] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    fishingTripId: '',
    landingDate: '',
    port: '',
    totalWeight: '',
  });

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'fishingTripId', label: 'Trip ID', type: 'number', placeholder: 'Search by trip' },
    { name: 'landingDateFrom', label: 'Landing Date From', type: 'date' },
    { name: 'landingDateTo', label: 'Landing Date To', type: 'date' },
    { name: 'port', label: 'Port', type: 'text', placeholder: 'Search port' },
    { name: 'minTotalWeight', label: 'Min Weight (kg)', type: 'number', placeholder: 'Min weight' },
    { name: 'maxTotalWeight', label: 'Max Weight (kg)', type: 'number', placeholder: 'Max weight' },
  ];

  useEffect(() => {
    loadLandings();
    loadFishingTrips();
  }, []);

  const loadFishingTrips = async () => {
    try {
      const filters = { page: 1, pageSize: 100, filters: {} };
      const data = await fishingTripApi.getAll(filters);
      setFishingTrips(data);
    } catch (error) {
      console.error('Failed to load fishing trips:', error);
    }
  };

  const loadLandings = async (customFilters?: LandingFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<LandingFilter> = { page: 1, pageSize: 100, filters: customFilters || {} };
      const data = await landingApi.getAll(filters);
      setLandings(data);
    } catch (error) {
      console.error('Failed to load landings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: LandingFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        (filters as any)[key] = ['id', 'fishingTripId', 'minTotalWeight', 'maxTotalWeight'].includes(key) ? Number(value) : value;
      }
    });
    loadLandings(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadLandings({});
  };

  const handleAdd = () => {
    if (!canCreate(role, 'landings')) return;
    setEditingItem(null);
    setFormData({ fishingTripId: '', landingDate: '', port: '', totalWeight: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: LandingItem) => {
    if (!canEdit(role, 'landings')) return;
    setEditingItem(item);
    const date = item.landingDateTime || item.landingDate;
    const weight = item.totalWeightKg || item.totalWeight;
    const tripId = item.tripId || item.fishingTripId;
    setFormData({
      fishingTripId: tripId?.toString() || '',
      landingDate: date ? (typeof date === 'string' ? date.split('T')[0] : new Date(date).toISOString().split('T')[0]) : '',
      port: item.port || '',
      totalWeight: weight?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'landings')) return;
    
    const confirmed = await confirm({
      title: 'Delete Landing',
      message: 'Are you sure you want to delete this landing? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await landingApi.delete(Number(id));
      toast.success('Landing deleted successfully');
      await loadLandings();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete landing');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'landings')) return;
    
    // Validation
    if (!formData.fishingTripId) {
      toast.error('Please select a fishing trip');
      return;
    }
    if (!formData.landingDate) {
      toast.error('Please enter the landing date');
      return;
    }
    if (!formData.port.trim()) {
      toast.error('Please enter the port name');
      return;
    }
    if (!formData.totalWeight || parseFloat(formData.totalWeight) <= 0) {
      toast.error('Please enter a valid total weight');
      return;
    }
    
    try {
      const payload = {
        tripId: Number(formData.fishingTripId),
        landingDateTime: formData.landingDate ? new Date(formData.landingDate).toISOString() : '',
        port: formData.port,
        totalWeightKg: parseFloat(formData.totalWeight),
      };
      if (editingItem) {
        await landingApi.edit({ id: editingItem.id, ...payload });
        toast.success('Landing updated successfully');
      } else {
        await landingApi.add(payload);
        toast.success('Landing recorded successfully');
      }
      setIsModalOpen(false);
      await loadLandings();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error(editingItem ? 'Failed to update landing' : 'Failed to record landing');
    }
  };

  const columns: Column<LandingItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'landingDate', header: 'Date', render: (item) => {
      const date = item.landingDateTime || item.landingDate;
      return date ? new Date(date).toLocaleDateString() : '-';
    }},
    { key: 'port', header: 'Port' },
    { key: 'totalWeight', header: 'Total Weight (kg)', render: (item) => {
      const weight = item.totalWeightKg || item.totalWeight;
      return weight ? `${weight} kg` : '-';
    }},
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'landings') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'landings') && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'landings') && (
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
        title="Landings"
        subtitle="Track fish landings at ports"
        actions={canCreate(role, 'landings') ? <Button variant="primary" onClick={handleAdd}>+ Add Landing</Button> : undefined}
      >
        <Table columns={columns} data={landings} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Landing' : 'Record Landing'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#4338ca' }}>
              <strong>📦 Recording a Landing</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>Record when fish are landed at a port after a fishing trip. This tracks the total weight of fish brought to shore.</p>
            </div>

            <Select
              label="Fishing Trip"
              value={formData.fishingTripId}
              onChange={(e) => setFormData({ ...formData, fishingTripId: e.target.value })}
              required
              fullWidth
              helperText="Select the fishing trip that returned with this catch"
              options={[
                { value: '', label: '-- Select Fishing Trip --' },
                ...fishingTrips.map((trip: any) => ({
                  value: trip.id.toString(),
                  label: `Trip #${trip.id} - ${trip.departureDateTime ? new Date(trip.departureDateTime).toLocaleDateString() : 'N/A'} ${trip.vessel?.vesselName ? `(${trip.vessel.vesselName})` : ''}`
                }))
              ]}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input 
                label="Landing Date" 
                type="date" 
                value={formData.landingDate} 
                onChange={(e) => setFormData({ ...formData, landingDate: e.target.value })} 
                required 
                fullWidth 
                helperText="When the fish were landed"
                max={new Date().toISOString().split('T')[0]}
              />
              <Input 
                label="Port" 
                value={formData.port} 
                onChange={(e) => setFormData({ ...formData, port: e.target.value })} 
                required 
                fullWidth 
                placeholder="e.g., Burgas, Varna"
                helperText="Port where fish were landed"
              />
            </div>

            <Input 
              label="Total Weight (kg)" 
              type="number" 
              step="0.01" 
              value={formData.totalWeight} 
              onChange={(e) => setFormData({ ...formData, totalWeight: e.target.value })} 
              required 
              fullWidth 
              min="0.01"
              placeholder="0.00"
              helperText="Total weight of all fish landed (kg)"
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">{editingItem ? 'Update' : 'Record Landing'}</Button>
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
