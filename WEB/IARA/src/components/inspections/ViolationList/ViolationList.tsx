import React, { useState, useEffect } from 'react';
import { violationApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { ViolationFilter, BaseFilter } from '../../../shared/types';

interface ViolationItem {
  id: number;
  inspectionId?: number;
  violationType?: string;
  description?: string;
  fineAmount?: number;
}

export const ViolationList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [violations, setViolations] = useState<ViolationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ViolationItem | null>(null);
  const [formData, setFormData] = useState({
    inspectionId: '',
    violationType: '',
    description: '',
    fineAmount: '',
  });

  useEffect(() => {
    loadViolations();
  }, []);

  const loadViolations = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<ViolationFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await violationApi.getAll(filters);
      setViolations(data);
    } catch (error) {
      console.error('Failed to load violations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ inspectionId: '', violationType: '', description: '', fineAmount: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: ViolationItem) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({
      inspectionId: item.inspectionId?.toString() || '',
      violationType: item.violationType || '',
      description: item.description || '',
      fineAmount: item.fineAmount?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role)) return;
    
    const confirmed = await confirm({
      title: 'Delete Violation',
      message: 'Are you sure you want to delete this violation? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await violationApi.delete(Number(id));
      toast.success('Violation deleted successfully');
      await loadViolations();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete violation');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
    try {
      const payload = {
        inspectionId: Number(formData.inspectionId),
        violationType: formData.violationType,
        description: formData.description,
        fineAmount: formData.fineAmount ? parseFloat(formData.fineAmount) : 0,
      };
      if (editingItem) {
        await violationApi.edit({ id: editingItem.id, ...payload });
        toast.success('Violation updated successfully');
      } else {
        await violationApi.add(payload);
        toast.success('Violation added successfully');
      }
      setIsModalOpen(false);
      await loadViolations();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save violation');
    }
  };

  const columns: Column<ViolationItem>[] = [
    { key: 'violationType', header: 'Type' },
    { key: 'description', header: 'Description' },
    { key: 'fineAmount', header: 'Fine Amount', render: (item) => item.fineAmount ? `${item.fineAmount} BGN` : '-' },
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
        title="Violations"
        subtitle="Track fishing regulation violations"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Violation</Button> : undefined}
      >
        <Table columns={columns} data={violations} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Violation' : 'Add Violation'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Inspection ID" value={formData.inspectionId} onChange={(e) => setFormData({ ...formData, inspectionId: e.target.value })} required fullWidth />
            <Input label="Violation Type" value={formData.violationType} onChange={(e) => setFormData({ ...formData, violationType: e.target.value })} required fullWidth />
            <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required fullWidth />
            <Input label="Fine Amount (BGN)" type="number" step="0.01" value={formData.fineAmount} onChange={(e) => setFormData({ ...formData, fineAmount: e.target.value })} fullWidth />
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
