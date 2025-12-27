import React, { useState, useEffect } from 'react';
import { inspectionApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import type { Column } from '../../shared/Table/Table';
import type { InspectionResponseDTO, InspectionFilter, BaseFilter } from '../../../shared/types';

export const InspectionList: React.FC = () => {
  const { role } = useAuth();
  const [inspections, setInspections] = useState<InspectionResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InspectionResponseDTO | null>(null);
  const [formData, setFormData] = useState({
    inspectorId: '',
    vesselId: '',
    inspectionDate: '',
    location: '',
    observations: '',
  });

  useEffect(() => {
    loadInspections();
  }, []);

  const loadInspections = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<InspectionFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await inspectionApi.getAll(filters);
      setInspections(data);
    } catch (error) {
      console.error('Failed to load inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ inspectorId: '', vesselId: '', inspectionDate: '', location: '', observations: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: InspectionResponseDTO) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({
      inspectorId: item.inspectorId || '',
      vesselId: item.vesselId || '',
      inspectionDate: item.inspectionDate ? item.inspectionDate.split('T')[0] : '',
      location: item.location || '',
      observations: item.observations || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role)) return;
    if (!confirm('Are you sure?')) return;
    try {
      await inspectionApi.delete(id);
      await loadInspections();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
    try {
      const payload = {
        ...formData,
        inspectionDate: formData.inspectionDate ? new Date(formData.inspectionDate).toISOString() : '',
      };
      if (editingItem) {
        await inspectionApi.edit({ id: editingItem.id, ...payload });
      } else {
        await inspectionApi.add(payload);
      }
      setIsModalOpen(false);
      await loadInspections();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const columns: Column<InspectionResponseDTO>[] = [
    { key: 'inspectionDate', header: 'Date', render: (item) => item.inspectionDate ? new Date(item.inspectionDate).toLocaleDateString() : '-' },
    { key: 'inspectorName', header: 'Inspector' },
    { key: 'vesselName', header: 'Vessel' },
    { key: 'location', header: 'Location' },
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
        title="Inspections"
        subtitle="Track vessel inspections"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Inspection</Button> : undefined}
      >
        <Table columns={columns} data={inspections} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Inspection' : 'Add Inspection'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Inspector ID" value={formData.inspectorId} onChange={(e) => setFormData({ ...formData, inspectorId: e.target.value })} required fullWidth />
              <Input label="Vessel ID" value={formData.vesselId} onChange={(e) => setFormData({ ...formData, vesselId: e.target.value })} required fullWidth />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Inspection Date" type="date" value={formData.inspectionDate} onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })} required fullWidth />
              <Input label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required fullWidth />
            </div>
            <Input label="Observations" value={formData.observations} onChange={(e) => setFormData({ ...formData, observations: e.target.value })} fullWidth multiline />
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
