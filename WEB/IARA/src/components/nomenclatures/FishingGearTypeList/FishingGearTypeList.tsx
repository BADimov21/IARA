import React, { useState, useEffect } from 'react';
import { fishingGearTypeApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import type { Column } from '../../shared/Table/Table';
import type { FishingGearTypeResponseDTO, FishingGearTypeFilter, BaseFilter } from '../../../shared/types';

export const FishingGearTypeList: React.FC = () => {
  const { role } = useAuth();
  const [items, setItems] = useState<FishingGearTypeResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FishingGearTypeResponseDTO | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', code: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<FishingGearTypeFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await fishingGearTypeApi.getAll(filters);
      setItems(data);
    } catch (error) {
      console.error('Failed to load fishing gear types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ name: '', description: '', code: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: FishingGearTypeResponseDTO) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({ name: item.name || '', description: item.description || '', code: item.code || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role)) return;
    if (!confirm('Are you sure?')) return;
    try {
      await fishingGearTypeApi.delete(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
    try {
      if (editingItem) {
        await fishingGearTypeApi.edit({ id: editingItem.id, ...formData });
      } else {
        await fishingGearTypeApi.add(formData);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const columns: Column<FishingGearTypeResponseDTO>[] = [
    { key: 'code', header: 'Code', width: '100px' },
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
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
        title="Fishing Gear Types"
        subtitle="Manage fishing gear type nomenclature"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Gear Type</Button> : undefined}
      >
        <Table columns={columns} data={items} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Gear Type' : 'Add Gear Type'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required fullWidth />
            <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required fullWidth />
            <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} fullWidth multiline />
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
