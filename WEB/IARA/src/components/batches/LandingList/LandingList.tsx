import React, { useState, useEffect } from 'react';
import { landingApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import type { Column } from '../../shared/Table/Table';
import type { LandingFilter, BaseFilter } from '../../../shared/types';

interface LandingItem {
  id: number;
  fishingTripId?: string;
  landingDate?: string;
  port?: string;
  totalWeight?: number;
}

export const LandingList: React.FC = () => {
  const { role } = useAuth();
  const [landings, setLandings] = useState<LandingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LandingItem | null>(null);
  const [formData, setFormData] = useState({
    fishingTripId: '',
    landingDate: '',
    port: '',
    totalWeight: '',
  });

  useEffect(() => {
    loadLandings();
  }, []);

  const loadLandings = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<LandingFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await landingApi.getAll(filters);
      setLandings(data);
    } catch (error) {
      console.error('Failed to load landings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ fishingTripId: '', landingDate: '', port: '', totalWeight: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: LandingItem) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({
      fishingTripId: item.fishingTripId || '',
      landingDate: item.landingDate ? item.landingDate.split('T')[0] : '',
      port: item.port || '',
      totalWeight: item.totalWeight?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role)) return;
    if (!confirm('Are you sure?')) return;
    try {
      await landingApi.delete(Number(id));
      await loadLandings();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
    try {
      const payload = {
        tripId: Number(formData.fishingTripId),
        landingDateTime: formData.landingDate ? new Date(formData.landingDate).toISOString() : '',
        port: formData.port,
        totalWeight: formData.totalWeight ? parseFloat(formData.totalWeight) : 0,
      };
      if (editingItem) {
        await landingApi.edit({ id: editingItem.id, ...payload });
      } else {
        await landingApi.add(payload);
      }
      setIsModalOpen(false);
      await loadLandings();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const columns: Column<LandingItem>[] = [
    { key: 'landingDate', header: 'Date', render: (item) => item.landingDate ? new Date(item.landingDate).toLocaleDateString() : '-' },
    { key: 'port', header: 'Port' },
    { key: 'totalWeight', header: 'Total Weight (kg)', render: (item) => item.totalWeight ? `${item.totalWeight} kg` : '-' },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role) && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role) && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
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
        title="Landings"
        subtitle="Track fish landings at ports"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Landing</Button> : undefined}
      >
        <Table columns={columns} data={landings} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Landing' : 'Add Landing'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Fishing Trip ID" value={formData.fishingTripId} onChange={(e) => setFormData({ ...formData, fishingTripId: e.target.value })} required fullWidth />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Landing Date" type="date" value={formData.landingDate} onChange={(e) => setFormData({ ...formData, landingDate: e.target.value })} required fullWidth />
              <Input label="Port" value={formData.port} onChange={(e) => setFormData({ ...formData, port: e.target.value })} required fullWidth />
            </div>
            <Input label="Total Weight (kg)" type="number" step="0.01" value={formData.totalWeight} onChange={(e) => setFormData({ ...formData, totalWeight: e.target.value })} required fullWidth />
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
