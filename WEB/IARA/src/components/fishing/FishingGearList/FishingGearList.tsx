import React, { useState, useEffect } from 'react';
import { fishingGearApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FishingGearFilter, BaseFilter } from '../../../shared/types';

interface FishingGearItem {
  id: number;
  gearTypeId?: number;
  gearTypeName?: string;
  vesselId?: number;
  vesselName?: string;
  meshSize?: number;
  length?: number;
}

export const FishingGearList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [gears, setGears] = useState<FishingGearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FishingGearItem | null>(null);
  const [formData, setFormData] = useState({
    gearTypeId: '',
    vesselId: '',
    meshSize: '',
    length: '',
  });

  useEffect(() => {
    loadGears();
  }, []);

  const loadGears = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<FishingGearFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await fishingGearApi.getAll(filters);
      setGears(data);
    } catch (error) {
      console.error('Failed to load fishing gears:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canCreate(role, 'fishingGear')) return;
    setEditingItem(null);
    setFormData({ gearTypeId: '', vesselId: '', meshSize: '', length: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: FishingGearItem) => {
    if (!canEdit(role, 'fishingGear')) return;
    setEditingItem(item);
    setFormData({
      gearTypeId: item.gearTypeId?.toString() || '',
      vesselId: item.vesselId?.toString() || '',
      meshSize: item.meshSize?.toString() || '',
      length: item.length?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'fishingGear')) return;
    
    const confirmed = await confirm({
      title: 'Delete Fishing Gear',
      message: 'Are you sure you want to delete this fishing gear? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await fishingGearApi.delete(Number(id));
      toast.success('Fishing gear deleted successfully');
      await loadGears();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete fishing gear');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'fishingGear')) return;
    try {
      const payload = {
        gearTypeId: Number(formData.gearTypeId),
        vesselId: Number(formData.vesselId),
        meshSize: formData.meshSize ? parseFloat(formData.meshSize) : undefined,
        length: formData.length ? parseFloat(formData.length) : undefined,
      };
      if (editingItem) {
        await fishingGearApi.edit({ id: editingItem.id, ...payload });
        toast.success('Fishing gear updated successfully');
      } else {
        await fishingGearApi.add(payload);
        toast.success('Fishing gear added successfully');
      }
      setIsModalOpen(false);
      await loadGears();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save fishing gear');
    }
  };

  const columns: Column<FishingGearItem>[] = [
    { key: 'gearTypeName', header: 'Gear Type' },
    { key: 'vesselName', header: 'Vessel' },
    { key: 'meshSize', header: 'Mesh Size (mm)', render: (item) => item.meshSize ? `${item.meshSize} mm` : '-' },
    { key: 'length', header: 'Length (m)', render: (item) => item.length ? `${item.length} m` : '-' },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'fishingGear') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'fishingGear') && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'fishingGear') && (
        <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', color: '#0369a1' }}>
          You have view-only access to this page.
        </div>
      )}
      <Card
        title="Fishing Gear"
        subtitle="Manage vessel fishing gear inventory"
        actions={canCreate(role, 'fishingGear') ? <Button variant="primary" onClick={handleAdd}>+ Add Gear</Button> : undefined}
      >
        <Table columns={columns} data={gears} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Gear' : 'Add Gear'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Gear Type ID" value={formData.gearTypeId} onChange={(e) => setFormData({ ...formData, gearTypeId: e.target.value })} required fullWidth />
              <Input label="Vessel ID" value={formData.vesselId} onChange={(e) => setFormData({ ...formData, vesselId: e.target.value })} required fullWidth />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Mesh Size (mm)" type="number" step="0.1" value={formData.meshSize} onChange={(e) => setFormData({ ...formData, meshSize: e.target.value })} fullWidth />
              <Input label="Length (m)" type="number" step="0.1" value={formData.length} onChange={(e) => setFormData({ ...formData, length: e.target.value })} fullWidth />
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
