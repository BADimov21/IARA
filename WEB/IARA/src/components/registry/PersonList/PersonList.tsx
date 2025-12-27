import React, { useState, useEffect } from 'react';
import { personApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import type { Column } from '../../shared/Table/Table';
import type { PersonResponseDTO, PersonFilter, BaseFilter } from '../../../shared/types';

export const PersonList: React.FC = () => {
  const { role } = useAuth();
  const [persons, setPersons] = useState<PersonResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PersonResponseDTO | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    egn: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    loadPersons();
  }, []);

  const loadPersons = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<PersonFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await personApi.getAll(filters);
      setPersons(data);
    } catch (error) {
      console.error('Failed to load persons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ firstName: '', middleName: '', lastName: '', egn: '', email: '', phone: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: PersonResponseDTO) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({
      firstName: item.firstName || '',
      middleName: item.middleName || '',
      lastName: item.lastName || '',
      egn: item.egn || '',
      email: item.email || '',
      phone: item.phone || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role)) return;
    if (!confirm('Are you sure?')) return;
    try {
      await personApi.delete(id);
      await loadPersons();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
    try {
      if (editingItem) {
        await personApi.edit({ id: editingItem.id, ...formData });
      } else {
        await personApi.add(formData);
      }
      setIsModalOpen(false);
      await loadPersons();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const columns: Column<PersonResponseDTO>[] = [
    { key: 'firstName', header: 'First Name' },
    { key: 'middleName', header: 'Middle Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'egn', header: 'EGN' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
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
        title="Persons"
        subtitle="Manage person registry"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Person</Button> : undefined}
      >
        <Table columns={columns} data={persons} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Person' : 'Add Person'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <Input label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required fullWidth />
              <Input label="Middle Name" value={formData.middleName} onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} fullWidth />
              <Input label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required fullWidth />
            </div>
            <Input label="EGN" value={formData.egn} onChange={(e) => setFormData({ ...formData, egn: e.target.value })} required fullWidth />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} fullWidth />
              <Input label="Phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} fullWidth />
            </div>
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
