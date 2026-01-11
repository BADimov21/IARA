import React, { useState, useEffect } from 'react';
import { fishingOperationApi, fishingTripApi, fishingGearApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Select, Loading, Card, ConfirmDialog, useToast, FilterPanel } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FishingOperationFilter, BaseFilter } from '../../../shared/types';
import type { FilterField } from '../../shared/FilterPanel/FilterPanel';

interface FishingOperationItem {
  id: number;
  fishingTripId?: string;
  operationDate?: string;
  latitude?: number;
  longitude?: number;
  depth?: number;
}

export const FishingOperationList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [operations, setOperations] = useState<FishingOperationItem[]>([]);
  const [fishingTrips, setFishingTrips] = useState<Array<{ id: number; departureDate: string; vesselName?: string; departurePort?: string }>>([]);
  const [fishingGears, setFishingGears] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FishingOperationItem | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    fishingTripId: '',
    fishingGearId: '',
    operationDate: '',
    latitude: '',
    longitude: '',
    depth: '',
  });

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'fishingTripId', label: 'Trip ID', type: 'number', placeholder: 'Search by trip' },
    { name: 'operationDateFrom', label: 'Date From', type: 'date' },
    { name: 'operationDateTo', label: 'Date To', type: 'date' },
    { name: 'minDepth', label: 'Min Depth (m)', type: 'number', placeholder: 'Min depth' },
    { name: 'maxDepth', label: 'Max Depth (m)', type: 'number', placeholder: 'Max depth' },
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadOperations(),
      loadFishingTrips(),
      loadFishingGears(),
    ]);
  };

  const loadFishingTrips = async () => {
    try {
      const data = await fishingTripApi.getAll({ page: 1, pageSize: 100, filters: {} });
      console.log('🚢 Loaded fishing trips:', data);
      if (data && data.length > 0) {
        console.log('📅 First trip date fields:', {
          departureDate: data[0].departureDate,
          departureDateTime: data[0].departureDateTime
        });
      }
      setFishingTrips((data || []).map((trip: any) => ({
        id: trip.id,
        departureDate: trip.departureDate || trip.departureDateTime,
        vesselName: trip.vesselName || trip.vessel?.name || trip.vessel?.vesselName,
        departurePort: trip.departurePort,
      })));
    } catch (error) {
      console.error('Failed to load fishing trips:', error);
    }
  };

  const loadFishingGears = async () => {
    try {
      const data = await fishingGearApi.getAll({ page: 1, pageSize: 100, filters: {} });
      console.log('Loaded fishing gears:', data);
      setFishingGears((data || []).map((gear: any) => ({
        id: gear.id,
        name: gear.type?.typeName || gear.typeName || `Gear ${gear.id}`,
      })));
    } catch (error) {
      console.error('Failed to load fishing gears:', error);
    }
  };

  const loadOperations = async (customFilters?: FishingOperationFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<FishingOperationFilter> = { page: 1, pageSize: 100, filters: customFilters || {} };
      const data = await fishingOperationApi.getAll(filters);
      console.log('🎣 Loaded fishing operations:', data);
      if (data && data.length > 0) {
        console.log('📦 First operation structure:', data[0]);
      }
      setOperations(data);
    } catch (error) {
      console.error('Failed to load fishing operations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: FishingOperationFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        (filters as any)[key] = ['id', 'fishingTripId', 'minDepth', 'maxDepth'].includes(key) ? Number(value) : value;
      }
    });
    loadOperations(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadOperations({});
  };

  const handleAdd = () => {
    if (!canCreate(role, 'fishingOperations')) return;
    if (fishingTrips.length === 0) {
      toast.error('You need to create a fishing trip first before recording operations');
      return;
    }
    if (fishingGears.length === 0) {
      toast.error('You need to have fishing gear registered before recording operations');
      return;
    }
    setEditingItem(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({ fishingTripId: '', fishingGearId: '', operationDate: today, latitude: '', longitude: '', depth: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: FishingOperationItem) => {
    if (!canEdit(role, 'fishingOperations')) return;
    setEditingItem(item);
    setFormData({
      fishingTripId: item.fishingTripId || '',
      fishingGearId: '',
      operationDate: item.operationDate ? item.operationDate.split('T')[0] : '',
      latitude: item.latitude?.toString() || '',
      longitude: item.longitude?.toString() || '',
      depth: item.depth?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'fishingOperations')) return;
    
    const confirmed = await confirm({
      title: 'Delete Fishing Operation',
      message: 'Are you sure you want to delete this fishing operation? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await fishingOperationApi.delete(Number(id));
      toast.success('Fishing operation deleted successfully');
      await loadOperations();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete fishing operation');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'fishingOperations')) return;
    
    // Validation
    if (!formData.fishingTripId) {
      toast.error('Please select a fishing trip');
      return;
    }
    if (!formData.fishingGearId) {
      toast.error('Please select fishing gear');
      return;
    }
    if (!formData.operationDate) {
      toast.error('Please enter the operation date');
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      toast.error('Please enter GPS coordinates (latitude and longitude)');
      return;
    }
    
    try {
      // Format location as a string with GPS coordinates
      const lat = formData.latitude ? parseFloat(formData.latitude) : 0;
      const lon = formData.longitude ? parseFloat(formData.longitude) : 0;
      const depth = formData.depth ? parseFloat(formData.depth) : null;
      
      let locationStr = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
      if (depth !== null) {
        locationStr += `, Depth: ${depth}m`;
      }
      
      const payload = {
        tripId: Number(formData.fishingTripId),
        fishingGearId: Number(formData.fishingGearId),
        startDateTime: formData.operationDate ? new Date(formData.operationDate).toISOString() : '',
        location: locationStr,
      };
      if (editingItem) {
        toast.info('To modify a fishing operation, use the Complete button to finalize it with end date/time.');
        setIsModalOpen(false);
        return;
      } else {
        await fishingOperationApi.add(payload);
        toast.success('Fishing operation recorded successfully');
      }
      setIsModalOpen(false);
      await loadOperations();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to record fishing operation');
    }
  };

  const columns: Column<FishingOperationItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { 
      key: 'operationDate', 
      header: 'Date', 
      render: (item: any) => {
        const date = item.startDateTime || item.operationDate || item.operationDateTime;
        if (!date) return '-';
        const d = new Date(date);
        return !isNaN(d.getTime()) ? d.toLocaleDateString() : '-';
      }
    },
    { 
      key: 'fishingGear', 
      header: 'Fishing Gear', 
      render: (item: any) => {
        const gear = item.fishingGear?.name || item.fishingGear?.typeName || item.gearName || item.gear;
        return gear || '-';
      }
    },
    { 
      key: 'latitude', 
      header: 'Latitude', 
      render: (item: any) => {
        // Parse from location string format "Lat: 42.1234, Lon: 27.5678, Depth: 10m"
        if (item.location && typeof item.location === 'string') {
          const latMatch = item.location.match(/Lat:\s*([\d.-]+)/);
          if (latMatch) return parseFloat(latMatch[1]).toFixed(4);
        }
        // Fallback to direct fields
        const lat = item.location?.latitude ?? item.latitude ?? item.lat ?? item.gpsLatitude;
        return lat != null ? lat.toFixed(4) : '-';
      }
    },
    { 
      key: 'longitude', 
      header: 'Longitude', 
      render: (item: any) => {
        // Parse from location string format "Lat: 42.1234, Lon: 27.5678, Depth: 10m"
        if (item.location && typeof item.location === 'string') {
          const lonMatch = item.location.match(/Lon:\s*([\d.-]+)/);
          if (lonMatch) return parseFloat(lonMatch[1]).toFixed(4);
        }
        // Fallback to direct fields
        const lon = item.location?.longitude ?? item.longitude ?? item.lon ?? item.gpsLongitude;
        return lon != null ? lon.toFixed(4) : '-';
      }
    },
    { 
      key: 'depth', 
      header: 'Depth (m)', 
      render: (item: any) => {
        // Parse from location string format "Lat: 42.1234, Lon: 27.5678, Depth: 10m"
        if (item.location && typeof item.location === 'string') {
          const depthMatch = item.location.match(/Depth:\s*([\d.]+)m/);
          if (depthMatch) return `${depthMatch[1]} m`;
        }
        // Fallback to direct fields
        const depth = item.location?.depth ?? item.depth;
        return depth ? `${depth} m` : '-';
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'fishingOperations') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'fishingOperations') && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canCreate(role, 'fishingOperations') && (
        <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', color: '#0369a1' }}>
          <strong>ℹ️ Commercial Fishing Operations</strong>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            This page is for commercial fishing operations. If you're a recreational fisher, 
            please use the <a href="/recreational/catches" style={{ color: '#0284c7', textDecoration: 'underline' }}>Recreational Catches</a> page to record your catches.
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
        title="Fishing Operations"
        subtitle="Record your fishing operations with GPS coordinates and gear details"
        actions={canCreate(role, 'fishingOperations') ? <Button variant="primary" onClick={handleAdd}>📍 Record Operation</Button> : undefined}
      >
        {fishingTrips.length === 0 && canCreate(role, 'fishingOperations') && (
          <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#92400e' }}>
            <strong>⚠️ No Fishing Trips Found</strong>
            <p style={{ margin: '0.5rem 0 0 0' }}>
              You need to create a fishing trip before you can record operations. Please go to the Fishing Trips page to create one.
            </p>
          </div>
        )}
        <Table columns={columns} data={operations} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Operation' : '📍 Record Fishing Operation'} size="large">
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#4338ca' }}>
            <strong>ℹ️ About Fishing Operations</strong>
            <p style={{ margin: '0.5rem 0 0 0' }}>
              Record details about your fishing operation including the trip, gear used, GPS coordinates, and water depth. 
              This information helps track fishing activities and maintain compliance with regulations.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Select
              label="Fishing Trip"
              value={formData.fishingTripId}
              onChange={(e) => setFormData({ ...formData, fishingTripId: e.target.value })}
              options={[
                { value: '', label: '-- Select Fishing Trip --' },
                ...fishingTrips.map((trip) => {
                  const date = trip.departureDate ? new Date(trip.departureDate) : null;
                  const dateStr = date && !isNaN(date.getTime()) ? date.toLocaleDateString() : 'No date';
                  return {
                    value: trip.id,
                    label: `Trip #${trip.id} - ${dateStr}${trip.vesselName ? ` (${trip.vesselName})` : ''}${trip.departurePort ? ` from ${trip.departurePort}` : ''}`
                  };
                })
              ]}
              required
              fullWidth
            />
            
            <Select
              label="Fishing Gear"
              value={formData.fishingGearId}
              onChange={(e) => setFormData({ ...formData, fishingGearId: e.target.value })}
              options={[
                { value: '', label: '-- Select Fishing Gear --' },
                ...fishingGears.map((gear) => ({
                  value: gear.id,
                  label: gear.name
                }))
              ]}
              required
              fullWidth
            />
            
            <Input
              label="Operation Date"
              type="date"
              value={formData.operationDate}
              onChange={(e) => setFormData({ ...formData, operationDate: e.target.value })}
              required
              fullWidth
              helperText="Date when the fishing operation took place"
              max={new Date().toISOString().split('T')[0]}
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Latitude"
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                required
                fullWidth
                placeholder="e.g., 42.698334"
                helperText="GPS latitude coordinate"
              />
              <Input
                label="Longitude"
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                required
                fullWidth
                placeholder="e.g., 27.714699"
                helperText="GPS longitude coordinate"
              />
            </div>
            
            <Input
              label="Water Depth (meters)"
              type="number"
              step="0.1"
              value={formData.depth}
              onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
              fullWidth
              placeholder="e.g., 25.5"
              helperText="Optional: depth of water at fishing location"
            />
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">{editingItem ? 'Update Operation' : '✓ Record Operation'}</Button>
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
