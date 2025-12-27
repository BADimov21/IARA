import React, { useState, useEffect } from 'react';
import { recreationalCatchApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import type { Column } from '../../shared/Table/Table';
import type { RecreationalCatchFilter, BaseFilter } from '../../../shared/types';

interface RecreationalCatchItem {
  id: number;
  ticketPurchaseId?: string;
  fishSpecyId?: string;
  fishSpecyName?: string;
  quantity?: number;
  catchDate?: string;
}

export const RecreationalCatchList: React.FC = () => {
  const { role } = useAuth();
  const [catches, setCatches] = useState<RecreationalCatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecreationalCatchItem | null>(null);
  const [formData, setFormData] = useState({
    ticketPurchaseId: '',
    fishSpecyId: '',
    quantity: '',
    catchDate: '',
  });

  useEffect(() => {
    loadCatches();
  }, []);

  const loadCatches = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<RecreationalCatchFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await recreationalCatchApi.getAll(filters);
      setCatches(data);
    } catch (error) {
      console.error('Failed to load recreational catches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ ticketPurchaseId: '', fishSpecyId: '', quantity: '', catchDate: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: RecreationalCatchItem) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({
      ticketPurchaseId: item.ticketPurchaseId || '',
      fishSpecyId: item.fishSpecyId || '',
      quantity: item.quantity?.toString() || '',
      catchDate: item.catchDate ? item.catchDate.split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role)) return;
    if (!confirm('Are you sure?')) return;
    try {
      await recreationalCatchApi.delete(Number(id));
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
        ticketPurchaseId: Number(formData.ticketPurchaseId),
        personId: Number(formData.ticketPurchaseId),
        speciesId: Number(formData.fishSpecyId),
        quantity: formData.quantity ? parseInt(formData.quantity) : 0,
        weightKg: 0,
        catchDateTime: formData.catchDate ? new Date(formData.catchDate).toISOString() : '',
      };
      if (editingItem) {
        console.log('Edit not supported - API only has add');
        return;
      } else {
        await recreationalCatchApi.add(payload);
      }
      setIsModalOpen(false);
      await loadCatches();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const columns: Column<RecreationalCatchItem>[] = [
    { key: 'catchDate', header: 'Date', render: (item) => item.catchDate ? new Date(item.catchDate).toLocaleDateString() : '-' },
    { key: 'fishSpecyName', header: 'Fish Species' },
    { key: 'quantity', header: 'Quantity' },
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
        title="Recreational Catches"
        subtitle="Track recreational fishing catches"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Catch</Button> : undefined}
      >
        <Table columns={columns} data={catches} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Catch' : 'Add Catch'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Ticket Purchase ID" value={formData.ticketPurchaseId} onChange={(e) => setFormData({ ...formData, ticketPurchaseId: e.target.value })} required fullWidth />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Fish Species ID" value={formData.fishSpecyId} onChange={(e) => setFormData({ ...formData, fishSpecyId: e.target.value })} required fullWidth />
              <Input label="Quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required fullWidth />
            </div>
            <Input label="Catch Date" type="date" value={formData.catchDate} onChange={(e) => setFormData({ ...formData, catchDate: e.target.value })} required fullWidth />
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
