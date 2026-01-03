import React, { useState, useEffect } from 'react';
import { fishingOperationApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FishingOperationFilter, BaseFilter } from '../../../shared/types';

interface FishingOperationItem {
  id: number;
  fishingTripId?: string;
  operationDate?: string;
  latitude?: number;
  longitude?: number;
  depth?: number;
}

export const FishingOperationList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [operations, setOperations] = useState<FishingOperationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FishingOperationItem | null>(null);
  const [formData, setFormData] = useState({
    fishingTripId: '',
    operationDate: '',
    latitude: '',
    longitude: '',
    depth: '',
  });

  useEffect(() => {
    loadOperations();
  }, []);

  const loadOperations = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<FishingOperationFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await fishingOperationApi.getAll(filters);
      setOperations(data);
    } catch (error) {
      console.error('Failed to load fishing operations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ fishingTripId: '', operationDate: '', latitude: '', longitude: '', depth: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: FishingOperationItem) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({
      fishingTripId: item.fishingTripId || '',
      operationDate: item.operationDate ? item.operationDate.split('T')[0] : '',
      latitude: item.latitude?.toString() || '',
      longitude: item.longitude?.toString() || '',
      depth: item.depth?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role)) return;
    
    const confirmed = await confirm({
      title: 'Delete Fishing Operation',
      message: 'Are you sure you want to delete this fishing operation? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await fishingOperationApi.delete(Number(id));
      toast.success('Fishing operation deleted successfully');
      await loadOperations();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete fishing operation');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
    try {
      const payload = {
        tripId: Number(formData.fishingTripId),
        fishingGearId: 1, // Required field - needs proper input
        startDateTime: formData.operationDate ? new Date(formData.operationDate).toISOString() : '',
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        depth: formData.depth ? parseFloat(formData.depth) : undefined,
      };
      if (editingItem) {
        console.log('Edit not supported - only add and complete operations');
        toast.warning('Edit not supported for fishing operations');
      } else {
        await fishingOperationApi.add(payload);
        toast.success('Fishing operation added successfully');
      }
      setIsModalOpen(false);
      await loadOperations();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save fishing operation');
    }
  };

  const columns: Column<FishingOperationItem>[] = [
    { key: 'operationDate', header: 'Date', render: (item) => item.operationDate ? new Date(item.operationDate).toLocaleDateString() : '-' },
    { key: 'latitude', header: 'Latitude', render: (item) => item.latitude?.toFixed(4) || '-' },
    { key: 'longitude', header: 'Longitude', render: (item) => item.longitude?.toFixed(4) || '-' },
    { key: 'depth', header: 'Depth (m)', render: (item) => item.depth ? `${item.depth} m` : '-' },
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
        title="Fishing Operations"
        subtitle="Track fishing operations with GPS coordinates"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Operation</Button> : undefined}
      >
        <Table columns={columns} data={operations} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Operation' : 'Add Operation'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Fishing Trip ID" value={formData.fishingTripId} onChange={(e) => setFormData({ ...formData, fishingTripId: e.target.value })} required fullWidth />
            <Input label="Operation Date" type="date" value={formData.operationDate} onChange={(e) => setFormData({ ...formData, operationDate: e.target.value })} required fullWidth />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <Input label="Latitude" type="number" step="0.000001" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} required fullWidth />
              <Input label="Longitude" type="number" step="0.000001" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} required fullWidth />
              <Input label="Depth (m)" type="number" step="0.1" value={formData.depth} onChange={(e) => setFormData({ ...formData, depth: e.target.value })} fullWidth />
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
