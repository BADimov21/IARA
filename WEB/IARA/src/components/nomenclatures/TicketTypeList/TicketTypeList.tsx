import React, { useState, useEffect } from 'react';
import { ticketTypeApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { TicketTypeResponseDTO, TicketTypeFilter, BaseFilter } from '../../../shared/types';

export const TicketTypeList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [items, setItems] = useState<TicketTypeResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TicketTypeResponseDTO | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', validityDays: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<TicketTypeFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await ticketTypeApi.getAll(filters);
      setItems(data);
    } catch (error) {
      console.error('Failed to load ticket types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ name: '', price: '', validityDays: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: TicketTypeResponseDTO) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      price: item.price?.toString() || '',
      validityDays: item.validityDays?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role)) return;
    
    const confirmed = await confirm({
      title: 'Delete Ticket Type',
      message: 'Are you sure you want to delete this ticket type? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await ticketTypeApi.delete(id);
      toast.success('Ticket type deleted successfully');
      await loadData();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete ticket type');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
    try {
      const payload = {
        name: formData.name,
        price: formData.price ? parseFloat(formData.price) : undefined,
        validityDays: formData.validityDays ? parseInt(formData.validityDays) : undefined,
      };
      if (editingItem) {
        await ticketTypeApi.edit({ id: editingItem.id, ...payload });
        toast.success('Ticket type updated successfully');
      } else {
        await ticketTypeApi.add(payload);
        toast.success('Ticket type added successfully');
      }
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save ticket type');
    }
  };

  const columns: Column<TicketTypeResponseDTO>[] = [
    { key: 'name', header: 'Name' },
    { key: 'price', header: 'Price', render: (item) => item.price ? `${item.price} BGN` : '-' },
    { key: 'validityDays', header: 'Validity', render: (item) => item.validityDays ? `${item.validityDays} days` : '-' },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role) && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role) && <Button size="small" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>}
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
        title="Ticket Types"
        subtitle="Manage recreational fishing ticket types"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Ticket Type</Button> : undefined}
      >
        <Table columns={columns} data={items} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Ticket Type' : 'Add Ticket Type'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required fullWidth />
            <Input label="Price (BGN)" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required fullWidth />
            <Input label="Validity (days)" type="number" value={formData.validityDays} onChange={(e) => setFormData({ ...formData, validityDays: e.target.value })} required fullWidth />
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
