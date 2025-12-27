/**
 * Fishing Trips List Component
 */

import React, { useState, useEffect } from 'react';
import { fishingTripApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
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
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ vesselId: '', departureDate: '', returnDate: '', departurePort: '', arrivalPort: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: FishingTripItem) => {
    if (!canEdit(role)) return;
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
    if (!canDelete(role)) return;
    if (!confirm('Are you sure?')) return;
    try {
      await fishingTripApi.delete(Number(id));
      await loadTrips();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
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
      } else {
        await fishingTripApi.add(payload);
      }
      setIsModalOpen(false);
      await loadTrips();
    } catch (error) {
      console.error('Failed to save:', error);
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
          {canEdit(role) && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role) && <Button size="small" variant="danger" onClick={() => handleDelete(item.id.toString())}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role) && (
        <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', color: '#0369a1' }}>
          You have view-only access to this page.
        </div>
      )}
      <Card
        title="Fishing Trips"
        subtitle="Track fishing vessel trips"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Trip</Button> : undefined}
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
    </div>
  );
};
