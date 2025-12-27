/**
 * FishSpecyList Component
 * Displays list of fish species with role-based access
 */

import React, { useState, useEffect } from 'react';
import { fishSpecyApi } from '../../../shared/api';
import { Table, Button, Card, Loading, Modal, Input } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import type { Column } from '../../shared/Table/Table';
import type { FishSpecyFilter, BaseFilter } from '../../../shared/types';

interface FishSpecyItem {
  id: number;
  speciesName: string;
}

export const FishSpecyList: React.FC = () => {
  const { role } = useAuth();
  const [fishSpecies, setFishSpecies] = useState<FishSpecyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FishSpecyItem | null>(null);
  const [formData, setFormData] = useState({ speciesName: '' });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const filters: BaseFilter<FishSpecyFilter> = {
        page: 1,
        pageSize: 100,
        filters: {},
      };
      const response = await fishSpecyApi.getAll(filters);
      if (response && Array.isArray(response)) {
        setFishSpecies(response);
      }
    } catch (error: any) {
      console.error('Failed to load fish species:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ speciesName: '' });
    setShowModal(true);
  };

  const handleEdit = (item: FishSpecyItem) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({ speciesName: item.speciesName });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role)) return;
    if (!confirm('Are you sure you want to delete this fish species?')) return;

    try {
      await fishSpecyApi.delete(Number(id));
      await loadData();
    } catch (error: any) {
      console.error('Failed to delete fish species:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;

    try {
      if (editingItem) {
        await fishSpecyApi.edit({ id: editingItem.id, speciesName: formData.speciesName });
      } else {
        await fishSpecyApi.add({ speciesName: formData.speciesName });
      }
      setShowModal(false);
      await loadData();
    } catch (error: any) {
      console.error('Failed to save fish species:', error);
    }
  };

  const columns: Column<FishSpecyItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'speciesName', header: 'Species Name', sortable: true },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role) && (
            <Button size="small" variant="primary" onClick={() => handleEdit(item)}>
              Edit
            </Button>
          )}
          {canDelete(role) && (
            <Button size="small" variant="danger" onClick={() => handleDelete(item.id.toString())}>
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loading text="Loading fish species..." />;
  }

  return (
    <div>
      {!canEdit(role) && (
        <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', color: '#0369a1' }}>
          You have view-only access to this page.
        </div>
      )}

      <Card
        title="Fish Species"
        subtitle="Manage fish species nomenclature"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>Add Fish Species</Button> : undefined}
      >
        <Table columns={columns} data={fishSpecies} />
      </Card>

      {showModal && (
        <Modal
          title={editingItem ? 'Edit Fish Species' : 'Add Fish Species'}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          size="medium"
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Input
              label="Species Name"
              value={formData.speciesName}
              onChange={(e) => setFormData({ ...formData, speciesName: e.target.value })}
              required
              fullWidth
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
