import React, { useState, useEffect } from 'react';
import { engineTypeApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { EngineTypeResponseDTO, EngineTypeFilter, BaseFilter } from '../../../shared/types';

export const EngineTypeList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [items, setItems] = useState<EngineTypeResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EngineTypeResponseDTO | null>(null);
  const [formData, setFormData] = useState({ typeName: '', averageFuelConsumption: '', fuelUnit: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<EngineTypeFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await engineTypeApi.getAll(filters);
      setItems(data);
    } catch (error) {
      console.error('Failed to load engine types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ typeName: '', averageFuelConsumption: '', fuelUnit: 'L/h' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: EngineTypeResponseDTO) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({ 
      typeName: item.typeName || '', 
      averageFuelConsumption: item.averageFuelConsumption?.toString() || '', 
      fuelUnit: item.fuelUnit || 'L/h' 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!canDelete(role)) return;
    
    const confirmed = await confirm({
      title: 'Delete Engine Type',
      message: 'Are you sure you want to delete this engine type? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await engineTypeApi.delete(id);
      toast.success('Engine type deleted successfully');
      await loadData();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete engine type');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
    try {
      const payload = {
        typeName: formData.typeName,
        averageFuelConsumption: parseFloat(formData.averageFuelConsumption) || 0,
        fuelUnit: formData.fuelUnit,
      };
      if (editingItem) {
        await engineTypeApi.edit({ id: editingItem.id, ...payload });
        toast.success('Engine type updated successfully');
      } else {
        await engineTypeApi.add(payload);
        toast.success('Engine type added successfully');
      }
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save engine type');
    }
  };

  const columns: Column<EngineTypeResponseDTO>[] = [
    { key: 'typeName', header: 'Type Name' },
    { key: 'averageFuelConsumption', header: 'Avg. Fuel Consumption', render: (item) => `${item.averageFuelConsumption} ${item.fuelUnit}` },
    { key: 'fuelUnit', header: 'Fuel Unit' },
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
        title="Engine Types"
        subtitle="Manage engine type nomenclature"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Engine Type</Button> : undefined}
      >
        <Table columns={columns} data={items} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Engine Type' : 'Add Engine Type'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Type Name" value={formData.typeName} onChange={(e) => setFormData({ ...formData, typeName: e.target.value })} required fullWidth />
            <Input label="Average Fuel Consumption" type="number" step="0.01" value={formData.averageFuelConsumption} onChange={(e) => setFormData({ ...formData, averageFuelConsumption: e.target.value })} required fullWidth />
            <Input label="Fuel Unit" value={formData.fuelUnit} onChange={(e) => setFormData({ ...formData, fuelUnit: e.target.value })} placeholder="L/h" required fullWidth />
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
