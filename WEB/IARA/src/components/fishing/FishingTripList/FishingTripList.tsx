/**
 * Fishing Trips List Component
 */

import React, { useState, useEffect } from 'react';
import { fishingTripApi, vesselApi, fishingPermitApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Select, Loading, Card, ConfirmDialog, useToast, FilterPanel } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FishingTripFilter, BaseFilter } from '../../../shared/types';
import type { FilterField } from '../../shared/FilterPanel/FilterPanel';

interface FishingTripItem {
  id: number;
  vesselId?: string;
  departureDate?: string;
  returnDate?: string;
  departurePort?: string;
  arrivalPort?: string;
}

export const FishingTripList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [trips, setTrips] = useState<FishingTripItem[]>([]);
  const [vessels, setVessels] = useState<Array<{ id: number; name: string; cfr?: string }>>([]);
  const [permits, setPermits] = useState<Array<{ id: number; number: string; validFrom?: string; validUntil?: string; isRevoked?: boolean }>>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FishingTripItem | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    permitId: '',
    vesselId: '',
    departureDate: '',
    returnDate: '',
    departurePort: '',
    arrivalPort: '',
  });

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'vesselId', label: 'Vessel ID', type: 'number', placeholder: 'Search by vessel' },
    { name: 'departureDateFrom', label: 'Departure From', type: 'date' },
    { name: 'departureDateTo', label: 'Departure To', type: 'date' },
    { name: 'departurePort', label: 'Departure Port', type: 'text', placeholder: 'Search port' },
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadTrips(),
      loadVessels(),
      loadPermits(),
    ]);
  };

  const loadVessels = async () => {
    try {
      const data = await vesselApi.getAll({ page: 1, pageSize: 100, filters: {} });
      console.log('Loaded vessels:', data);
      setVessels((data || []).map((vessel: any) => ({
        id: vessel.id,
        name: vessel.name || vessel.vesselName || `Vessel ${vessel.id}`,
        cfr: vessel.cfr,
      })));
    } catch (error) {
      console.error('Failed to load vessels:', error);
    }
  };

  const loadPermits = async () => {
    try {
      const data = await fishingPermitApi.getAll({ page: 1, pageSize: 100, filters: {} });
      console.log('Loaded permits:', data);
      
      // Map all permits - be more permissive for admins
      const allPermits = (data || []).map((permit: any) => ({
        id: permit.id,
        number: permit.permitNumber || permit.number || `Permit #${permit.id}`,
        validFrom: permit.validFrom,
        validUntil: permit.validUntil,
        isRevoked: permit.isRevoked,
      }));
      
      console.log('Mapped permits:', allPermits);
      setPermits(allPermits);
    } catch (error) {
      console.error('Failed to load permits:', error);
    }
  };

  const loadTrips = async (customFilters?: FishingTripFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<FishingTripFilter> = { page: 1, pageSize: 100, filters: customFilters || {} };
      const data = await fishingTripApi.getAll(filters);
      console.log('🚢 Fishing Trips API Response:', data);
      if (data && data.length > 0) {
        console.log('📦 First trip data structure:', data[0]);
        console.log('🏴 arrivalPort field:', data[0].arrivalPort);
        console.log('🏴 returnPort field:', data[0].returnPort);
      }
      setTrips(data);
    } catch (error) {
      console.error('Failed to load fishing trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: FishingTripFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        if (key === 'id' || key === 'vesselId') {
          filters[key] = Number(value);
        } else {
          filters[key as keyof FishingTripFilter] = value as any;
        }
      }
    });
    loadTrips(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadTrips({});
  };

  const handleAdd = () => {
    if (!canCreate(role, 'fishingTrips')) return;
    if (vessels.length === 0) {
      toast.error('You need to register a vessel first before creating a fishing trip');
      return;
    }
    if (permits.length === 0) {
      toast.error('You need to have a valid fishing permit before creating a trip');
      return;
    }
    setEditingItem(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({ permitId: '', vesselId: '', departureDate: today, returnDate: '', departurePort: '', arrivalPort: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: FishingTripItem) => {
    if (!canEdit(role, 'fishingTrips')) return;
    setEditingItem(item);
    setFormData({
      permitId: '',
      vesselId: String(item.vesselId || ''),
      departureDate: item.departureDate ? item.departureDate.split('T')[0] : '',
      returnDate: item.returnDate ? item.returnDate.split('T')[0] : '',
      departurePort: item.departurePort || '',
      arrivalPort: item.arrivalPort || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'fishingTrips')) return;
    
    const confirmed = await confirm({
      title: 'Delete Fishing Trip',
      message: 'Are you sure you want to delete this fishing trip? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await fishingTripApi.delete(Number(id));
      toast.success('Fishing trip deleted successfully');
      await loadTrips();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete fishing trip');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'fishingTrips')) return;
    
    // Validation
    if (!formData.permitId) {
      toast.error('Please select a fishing permit');
      return;
    }
    if (!formData.vesselId) {
      toast.error('Please select a vessel');
      return;
    }
    if (!formData.departureDate) {
      toast.error('Please enter the departure date');
      return;
    }
    if (!formData.departurePort) {
      toast.error('Please enter the departure port');
      return;
    }
    
    try {
      const payload = {
        permitId: Number(formData.permitId),
        vesselId: Number(formData.vesselId || 0),
        departureDateTime: formData.departureDate ? new Date(formData.departureDate).toISOString() : '',
        returnDateTime: formData.returnDate ? new Date(formData.returnDate).toISOString() : null,
        departurePort: formData.departurePort,
        arrivalPort: formData.arrivalPort || null,
      };
      
      if (editingItem) {
        toast.info('Fishing trips cannot be edited once started. Use the Complete button to finalize the trip with return information.');
        setIsModalOpen(false);
        return;
      } else {
        await fishingTripApi.add(payload);
        toast.success('Fishing trip created successfully');
      }
      setIsModalOpen(false);
      await loadTrips();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to create fishing trip');
    }
  };

  const columns: Column<FishingTripItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { 
      key: 'vesselName', 
      header: 'Vessel',
      render: (item: any) => item.vesselName || item.vessel?.name || item.vessel?.vesselName || `Vessel ${item.vesselId || ''}` || '-'
    },
    { 
      key: 'departureDate', 
      header: 'Departure', 
      render: (item: any) => {
        const date = item.departureDate || item.departureDateTime;
        return date ? new Date(date).toLocaleDateString() : '-';
      }
    },
    { 
      key: 'departurePort', 
      header: 'From',
      render: (item: any) => item.departurePort || '-'
    },
    { 
      key: 'arrivalPort', 
      header: 'To',
      render: (item: any) => {
        const port = item.arrivalPort || item.returnPort;
        return port ? port : '-';
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'fishingTrips') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'fishingTrips') && <Button size="small" variant="danger" onClick={() => handleDelete(item.id.toString())}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canCreate(role, 'fishingTrips') && (
        <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', color: '#0369a1' }}>
          <strong>ℹ️ Commercial Fishing Trips</strong>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            This page is for commercial fishing vessel trips. If you're a recreational fisher, 
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
        title="Fishing Trips"
        subtitle="Manage your fishing vessel trips and track operations"
        actions={canCreate(role, 'fishingTrips') ? <Button variant="primary" onClick={handleAdd}>🚢 Create Trip</Button> : undefined}
      >
        {(vessels.length === 0 || permits.length === 0) && canCreate(role, 'fishingTrips') && (
          <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#92400e' }}>
            <strong>⚠️ Prerequisites Required</strong>
            <p style={{ margin: '0.5rem 0 0 0' }}>
              {vessels.length === 0 && 'You need to register a vessel first. '}
              {permits.length === 0 && 'You need to have a valid fishing permit. '}
              Please complete these steps before creating a fishing trip.
            </p>
          </div>
        )}
        <Table columns={columns} data={trips} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Trip' : '🚢 Create Fishing Trip'} size="large">
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#4338ca' }}>
            <strong>ℹ️ About Fishing Trips</strong>
            <p style={{ margin: '0.5rem 0 0 0' }}>
              A fishing trip represents a vessel's journey for commercial fishing. You'll need to specify the permit, 
              vessel, departure/arrival details, and ports. Operations and catches will be linked to this trip.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Select
              label="Fishing Permit"
              value={formData.permitId}
              onChange={(e) => setFormData({ ...formData, permitId: e.target.value })}
              options={permits.map((permit) => {
                let statusLabel = '';
                if (permit.isRevoked) {
                  statusLabel = ' [REVOKED]';
                } else if (permit.validUntil) {
                  const validUntil = new Date(permit.validUntil);
                  const isExpired = validUntil < new Date();
                  statusLabel = isExpired ? ' [EXPIRED]' : '';
                }
                return {
                  value: permit.id,
                  label: `${permit.number}${permit.validFrom && permit.validUntil ? ` (${new Date(permit.validFrom).toLocaleDateString()} - ${new Date(permit.validUntil).toLocaleDateString()})` : ''}${statusLabel}`
                };
              })}
              required
              fullWidth
            />
            
            <Select
              label="Vessel"
              value={formData.vesselId}
              onChange={(e) => setFormData({ ...formData, vesselId: e.target.value })}
              options={vessels.map((vessel) => ({
                value: vessel.id,
                label: `${vessel.name}${vessel.cfr ? ` (CFR: ${vessel.cfr})` : ''}`
              }))}
              required
              fullWidth
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Departure Date"
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                required
                fullWidth
                helperText="When the vessel departs"
                max={new Date().toISOString().split('T')[0]}
              />
              <Input
                label="Expected Return Date"
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                fullWidth
                helperText="Optional: expected return date"
                min={formData.departureDate}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Departure Port"
                value={formData.departurePort}
                onChange={(e) => setFormData({ ...formData, departurePort: e.target.value })}
                required
                fullWidth
                placeholder="e.g., Burgas, Varna"
                helperText="Port where vessel departs from"
              />
              <Input
                label="Arrival Port"
                value={formData.arrivalPort}
                onChange={(e) => setFormData({ ...formData, arrivalPort: e.target.value })}
                fullWidth
                placeholder="e.g., Burgas, Varna"
                helperText="Optional: expected arrival port"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">{editingItem ? 'Update Trip' : '✓ Create Trip'}</Button>
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
