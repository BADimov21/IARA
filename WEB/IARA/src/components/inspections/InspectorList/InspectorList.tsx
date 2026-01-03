import React, { useState, useEffect } from 'react';
import { inspectorApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { InspectorFilter, BaseFilter } from '../../../shared/types';

interface InspectorItem {
  id: number;
  firstName?: string;
  lastName?: string;
  badgeNumber?: string;
  phone?: string;
  personId?: number;
}

export const InspectorList: React.FC = () => {
  const { role } = useAuth();  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();  const [inspectors, setInspectors] = useState<InspectorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InspectorItem | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    badgeNumber: '',
    phone: '',
  });

  useEffect(() => {
    loadInspectors();
  }, []);

  const loadInspectors = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<InspectorFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await inspectorApi.getAll(filters);
      setInspectors(data);
    } catch (error) {
      console.error('Failed to load inspectors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ firstName: '', lastName: '', badgeNumber: '', phone: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: InspectorItem) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({
      firstName: item.firstName || '',
      lastName: item.lastName || '',
      badgeNumber: item.badgeNumber || '',
      phone: item.phone || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role)) return;
    
    const confirmed = await confirm({
      title: 'Delete Inspector',
      message: 'Are you sure you want to delete this inspector? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await inspectorApi.delete(Number(id));
      toast.success('Inspector deleted successfully');
      await loadInspectors();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete inspector');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
    try {
      if (editingItem) {
        await inspectorApi.edit({ id: editingItem.id, ...formData });
        toast.success('Inspector updated successfully');
      } else {
        // API requires personId which we don't have in form - need to add
        const payload = { ...formData, personId: 1 }; // Placeholder
        await inspectorApi.add(payload);
        toast.success('Inspector added successfully');
      }
      setIsModalOpen(false);
      await loadInspectors();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save inspector');
    }
  };

  const columns: Column<InspectorItem>[] = [
    { key: 'badgeNumber', header: 'Badge Number' },
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'phone', header: 'Phone' },
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
        title="Inspectors"
        subtitle="Manage fisheries inspectors"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Inspector</Button> : undefined}
      >
        <Table columns={columns} data={inspectors} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Inspector' : 'Add Inspector'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required fullWidth />
              <Input label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required fullWidth />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Badge Number" value={formData.badgeNumber} onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })} required fullWidth />
              <Input label="Phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required fullWidth />
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
