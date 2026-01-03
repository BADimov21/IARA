import React, { useState, useEffect } from 'react';
import { fishingPermitApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FishingPermitFilter, BaseFilter } from '../../../shared/types';

interface FishingPermitItem {
  id: number;
  vesselId?: string;
  vesselName?: string;
  permitNumber?: string;
  issueDate?: string;
  expiryDate?: string;
}

export const FishingPermitList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [permits, setPermits] = useState<FishingPermitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FishingPermitItem | null>(null);
  const [formData, setFormData] = useState({
    vesselId: '',
    permitNumber: '',
    issueDate: '',
    expiryDate: '',
  });

  useEffect(() => {
    loadPermits();
  }, []);

  const loadPermits = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<FishingPermitFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await fishingPermitApi.getAll(filters);
      setPermits(data);
    } catch (error) {
      console.error('Failed to load fishing permits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ vesselId: '', permitNumber: '', issueDate: '', expiryDate: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: FishingPermitItem) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({
      vesselId: item.vesselId || '',
      permitNumber: item.permitNumber || '',
      issueDate: item.issueDate ? item.issueDate.split('T')[0] : '',
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role)) return;
    
    const confirmed = await confirm({
      title: 'Delete Fishing Permit',
      message: 'Are you sure you want to delete this fishing permit? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await fishingPermitApi.delete(Number(id));
      toast.success('Fishing permit deleted successfully');
      await loadPermits();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete fishing permit');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
    try {
      const payload = {
        vesselId: Number(formData.vesselId),
        permitNumber: formData.permitNumber,
        issueDate: formData.issueDate ? new Date(formData.issueDate).toISOString() : '',
        validFrom: formData.issueDate ? new Date(formData.issueDate).toISOString() : '',
        validUntil: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : '',
      };
      if (editingItem) {
        console.log('Edit not supported - API only has add and revoke');
        toast.warning('Edit not supported for fishing permits');
      } else {
        await fishingPermitApi.add(payload);
        toast.success('Fishing permit added successfully');
      }
      setIsModalOpen(false);
      await loadPermits();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save fishing permit');
    }
  };

  const columns: Column<FishingPermitItem>[] = [
    { key: 'permitNumber', header: 'Permit Number' },
    { key: 'vesselName', header: 'Vessel' },
    { key: 'issueDate', header: 'Issue Date', render: (item) => item.issueDate ? new Date(item.issueDate).toLocaleDateString() : '-' },
    { key: 'expiryDate', header: 'Expiry Date', render: (item) => item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-' },
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
        title="Fishing Permits"
        subtitle="Manage vessel fishing permits and licenses"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Permit</Button> : undefined}
      >
        <Table columns={columns} data={permits} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Permit' : 'Add Permit'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Permit Number" value={formData.permitNumber} onChange={(e) => setFormData({ ...formData, permitNumber: e.target.value })} required fullWidth />
              <Input label="Vessel ID" value={formData.vesselId} onChange={(e) => setFormData({ ...formData, vesselId: e.target.value })} required fullWidth />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Issue Date" type="date" value={formData.issueDate} onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} required fullWidth />
              <Input label="Expiry Date" type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} required fullWidth />
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
