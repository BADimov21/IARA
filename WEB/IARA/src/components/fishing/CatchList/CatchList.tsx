import React, { useState, useEffect } from 'react';
import { catchApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import type { Column } from '../../shared/Table/Table';
import type { CatchFilter, BaseFilter } from '../../../shared/types';

interface CatchItem {
  id: number;
  fishingTripId?: string;
  fishSpecyId?: string;
  quantity?: number;
  weight?: number;
}

export const CatchList: React.FC = () => {
  const { role } = useAuth();
  const [catches, setCatches] = useState<CatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatchItem | null>(null);
  const [formData, setFormData] = useState({
    fishingTripId: '',
    fishSpecyId: '',
    quantity: '',
    weight: '',
  });

  useEffect(() => {
    loadCatches();
  }, []);

  const loadCatches = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<CatchFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await catchApi.getAll(filters);
      setCatches(data);
    } catch (error) {
      console.error('Failed to load catches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ fishingTripId: '', fishSpecyId: '', quantity: '', weight: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: CatchItem) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({
      fishingTripId: item.fishingTripId?.toString() || '',
      fishSpecyId: item.fishSpecyId?.toString() || '',
      quantity: item.quantity?.toString() || '',
      weight: item.weight?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role)) return;
    if (!confirm('Are you sure?')) return;
    try {
      await catchApi.delete(Number(id));
      await loadCatches();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
    try {
      const payload = {
        operationId: 1,
        speciesId: Number(formData.fishSpecyId),
        weightKg: formData.weight ? parseFloat(formData.weight) : 0,
        quantity: formData.quantity ? parseInt(formData.quantity) : 0,
      };
      if (editingItem) {
        // TODO: API might not support edit for catches
        console.log('Edit catch:', { id: editingItem.id, ...payload });
      } else {
        await catchApi.add(payload);
      }
      setIsModalOpen(false);
      await loadCatches();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const columns: Column<CatchItem>[] = [
    { key: 'fishSpecyName', header: 'Fish Species' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'weight', header: 'Weight (kg)', render: (item) => item.weight ? `${item.weight} kg` : '-' },
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
        title="Catches"
        subtitle="Manage catch records"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Catch</Button> : undefined}
      >
        <Table columns={columns} data={catches} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Catch' : 'Add Catch'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Fishing Trip ID" value={formData.fishingTripId} onChange={(e) => setFormData({ ...formData, fishingTripId: e.target.value })} required fullWidth />
              <Input label="Fish Species ID" value={formData.fishSpecyId} onChange={(e) => setFormData({ ...formData, fishSpecyId: e.target.value })} required fullWidth />
            </div>
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
    </div>
  );
};
