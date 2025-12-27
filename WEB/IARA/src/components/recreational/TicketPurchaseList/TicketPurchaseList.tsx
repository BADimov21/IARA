import React, { useState, useEffect } from 'react';
import { ticketPurchaseApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import type { Column } from '../../shared/Table/Table';
import type { TicketPurchaseFilter, BaseFilter } from '../../../shared/types';

interface TicketPurchaseItem {
  id: number;
  personId?: string;
  ticketTypeId?: string;
  purchaseDate?: string;
  validFrom?: string;
  validTo?: string;
}

export const TicketPurchaseList: React.FC = () => {
  const { role } = useAuth();
  const [purchases, setPurchases] = useState<TicketPurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TicketPurchaseItem | null>(null);
  const [formData, setFormData] = useState({
    personId: '',
    ticketTypeId: '',
    purchaseDate: '',
    validFrom: '',
    validTo: '',
  });

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<TicketPurchaseFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await ticketPurchaseApi.getAll(filters);
      setPurchases(data);
    } catch (error) {
      console.error('Failed to load ticket purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ personId: '', ticketTypeId: '', purchaseDate: '', validFrom: '', validTo: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: TicketPurchaseItem) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({
      personId: item.personId || '',
      ticketTypeId: item.ticketTypeId || '',
      purchaseDate: item.purchaseDate ? item.purchaseDate.split('T')[0] : '',
      validFrom: item.validFrom ? item.validFrom.split('T')[0] : '',
      validTo: item.validTo ? item.validTo.split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role)) return;
    if (!confirm('Are you sure?')) return;
    try {
      await ticketPurchaseApi.delete(Number(id));
      await loadPurchases();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
    try {
      const payload = {
        personId: Number(formData.personId),
        ticketTypeId: Number(formData.ticketTypeId),
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toISOString() : '',
        validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : '',
        validUntil: formData.validTo ? new Date(formData.validTo).toISOString() : '',
        pricePaid: 0,
      };
      if (editingItem) {
        console.log('Edit not supported - API only has add');
        return;
      } else {
        await ticketPurchaseApi.add(payload);
      }
      setIsModalOpen(false);
      await loadPurchases();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const columns: Column<TicketPurchaseItem>[] = [
    { key: 'purchaseDate', header: 'Purchase Date', render: (item) => item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : '-' },
    { key: 'personName', header: 'Person' },
    { key: 'ticketTypeName', header: 'Ticket Type' },
    { key: 'validFrom', header: 'Valid From', render: (item) => item.validFrom ? new Date(item.validFrom).toLocaleDateString() : '-' },
    { key: 'validTo', header: 'Valid To', render: (item) => item.validTo ? new Date(item.validTo).toLocaleDateString() : '-' },
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
        title="Ticket Purchases"
        subtitle="Manage recreational fishing ticket sales"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Purchase</Button> : undefined}
      >
        <Table columns={columns} data={purchases} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Purchase' : 'Add Purchase'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Person ID" value={formData.personId} onChange={(e) => setFormData({ ...formData, personId: e.target.value })} required fullWidth />
              <Input label="Ticket Type ID" value={formData.ticketTypeId} onChange={(e) => setFormData({ ...formData, ticketTypeId: e.target.value })} required fullWidth />
            </div>
            <Input label="Purchase Date" type="date" value={formData.purchaseDate} onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} required fullWidth />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Valid From" type="date" value={formData.validFrom} onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })} required fullWidth />
              <Input label="Valid To" type="date" value={formData.validTo} onChange={(e) => setFormData({ ...formData, validTo: e.target.value })} required fullWidth />
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
