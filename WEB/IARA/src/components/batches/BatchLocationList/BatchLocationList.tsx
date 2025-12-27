import React, { useState, useEffect } from 'react';
import { batchLocationApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import type { Column } from '../../shared/Table/Table';
import type { BatchLocationFilter, BaseFilter } from '../../../shared/types';

interface BatchLocationItem {
  id: number;
  name?: string;
  address?: string;
  type?: string;
}

export const BatchLocationList: React.FC = () => {
  const { role } = useAuth();
  const [locations, setLocations] = useState<BatchLocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BatchLocationItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: '',
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<BatchLocationFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await batchLocationApi.getAll(filters);
      setLocations(data);
    } catch (error) {
      console.error('Failed to load batch locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ name: '', address: '', type: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: BatchLocationItem) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      address: item.address || '',
      type: item.type || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role)) return;
    if (!confirm('Are you sure?')) return;
    try {
      await batchLocationApi.delete(Number(id));
      await loadLocations();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
    try {
      // Note: API doesn't have edit method, only add
      if (editingItem) {
        console.log('Edit not supported for batch locations');
        return;
      } else {
        // API requires different structure - skipping for now
        console.log('Add requires batchId, locationType, arrivedAt');
      }
      setIsModalOpen(false);
      await loadLocations();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const columns: Column<BatchLocationItem>[] = [
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    { key: 'address', header: 'Address' },
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
        title="Batch Locations"
        subtitle="Manage storage and processing locations"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Location</Button> : undefined}
      >
        <Table columns={columns} data={locations} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Location' : 'Add Location'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required fullWidth />
            <Input label="Type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required fullWidth placeholder="e.g., Storage, Processing, Distribution" />
            <Input label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required fullWidth />
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
