/**
 * Fishing Trips List Component
 */

import React, { useState, useEffect } from 'react';
import { fishingTripApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FishingTripFilter, BaseFilter } from '../../../shared/types';

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
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FishingTripItem | null>(null);
  const [formData, setFormData] = useState({
    vesselId: '',
    departureDate: '',
    returnDate: '',
    departurePort: '',
    arrivalPort: '',
  });

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<FishingTripFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await fishingTripApi.getAll(filters);
      setTrips(data);
    } catch (error) {
      console.error('Failed to load fishing trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canCreate(role, 'fishingTrips')) return;
    setEditingItem(null);
    setFormData({ vesselId: '', departureDate: '', returnDate: '', departurePort: '', arrivalPort: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: FishingTripItem) => {
    if (!canEdit(role, 'fishingTrips')) return;
    setEditingItem(item);
    setFormData({
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
    try {
      const payload = {
        permitId: 1, // TODO: Get from form
        vesselId: Number(formData.vesselId || 0),
        departureDateTime: formData.departureDate ? new Date(formData.departureDate).toISOString() : '',
        returnDateTime: formData.returnDate ? new Date(formData.returnDate).toISOString() : '',
        departurePort: formData.departurePort,
        arrivalPort: formData.arrivalPort,
      };
      if (editingItem) {
        console.log('Edit not supported - API only has add and complete');
        await fishingTripApi.add(payload);
        toast.warning('Edit not supported - created new trip instead');
      } else {
        await fishingTripApi.add(payload);
        toast.success('Fishing trip added successfully');
      }
      setIsModalOpen(false);
      await loadTrips();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save fishing trip');
    }
  };

  const columns: Column<FishingTripItem>[] = [
    { key: 'vesselName', header: 'Vessel' },
    { key: 'departureDate', header: 'Departure', render: (item) => item.departureDate ? new Date(item.departureDate).toLocaleDateString() : '-' },
    { key: 'departurePort', header: 'From' },
    { key: 'arrivalPort', header: 'To' },
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
      {!canEdit(role, 'fishingTrips') && (
        <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', color: '#0369a1' }}>
          You have view-only access to this page.
        </div>
      )}
      <Card
        title="Fishing Trips"
        subtitle="Track fishing vessel trips"
        actions={canCreate(role, 'fishingTrips') ? <Button variant="primary" onClick={handleAdd}>+ Add Trip</Button> : undefined}
      >
        <Table columns={columns} data={trips} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Trip' : 'Add Trip'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Vessel ID" value={formData.vesselId} onChange={(e) => setFormData({ ...formData, vesselId: e.target.value })} required fullWidth />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Departure Date" type="date" value={formData.departureDate} onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })} required fullWidth />
              <Input label="Return Date" type="date" value={formData.returnDate} onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })} fullWidth />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Departure Port" value={formData.departurePort} onChange={(e) => setFormData({ ...formData, departurePort: e.target.value })} required fullWidth />
              <Input label="Arrival Port" value={formData.arrivalPort} onChange={(e) => setFormData({ ...formData, arrivalPort: e.target.value })} fullWidth />
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
