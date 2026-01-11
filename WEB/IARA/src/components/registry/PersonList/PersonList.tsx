import React, { useState, useEffect } from 'react';
import { personApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FilterField } from '../../shared';
import type { PersonFilter, BaseFilter } from '../../../shared/types';

interface PersonItem {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  egn?: string;
  dateOfBirth?: string;
  address?: string;
  phoneNumber?: string;
}

export const PersonList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [persons, setPersons] = useState<PersonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PersonItem | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    egn: '',
    phoneNumber: '',
  });

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Search first name' },
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Search last name' },
    { name: 'egn', label: 'EGN', type: 'text', placeholder: 'Search EGN' },
    { name: 'phoneNumber', label: 'Phone', type: 'text', placeholder: 'Search phone' },
  ];

  useEffect(() => {
    loadPersons();
  }, []);

  const loadPersons = async (customFilters?: PersonFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<PersonFilter> = { page: 1, pageSize: 100, filters: customFilters || {} };
      const data = await personApi.getAll(filters);
      setPersons(data);
    } catch (error) {
      console.error('Failed to load persons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: PersonFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        if (key === 'id') {
          filters[key] = Number(value);
        } else {
          filters[key as keyof PersonFilter] = value as any;
        }
      }
    });
    loadPersons(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadPersons({});
  };

  const handleAdd = () => {
    if (!canCreate(role, 'persons')) return;
    setEditingItem(null);
    setFormData({ firstName: '', middleName: '', lastName: '', egn: '', phoneNumber: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: PersonItem) => {
    if (!canEdit(role, 'persons')) return;
    setEditingItem(item);
    setFormData({
      firstName: item.firstName || '',
      middleName: item.middleName || '',
      lastName: item.lastName || '',
      egn: item.egn || '',
      phoneNumber: item.phoneNumber || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'persons')) return;
    
    const confirmed = await confirm({
      title: 'Delete Person',
      message: 'Are you sure you want to delete this person? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await personApi.delete(Number(id));
      toast.success('Person deleted successfully');
      await loadPersons();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete person');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'persons')) return;
    try {
      if (editingItem) {
        await personApi.edit({ id: editingItem.id, ...formData });
        toast.success('Person updated successfully');
      } else {
        await personApi.add(formData);
        toast.success('Person added successfully');
      }
      setIsModalOpen(false);
      await loadPersons();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save person');
    }
  };

  const columns: Column<PersonItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'firstName', header: 'First Name' },
    { key: 'middleName', header: 'Middle Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'egn', header: 'EGN' },
    { key: 'phoneNumber', header: 'Phone' },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'persons') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'persons') && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'persons') && (
        <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', color: '#0369a1' }}>
          You have view-only access to this page.
        </div>
      )}

      <FilterPanel
        fields={filterFields}
        values={filterValues}
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        isExpanded={isFilterExpanded}
        onToggle={() => setIsFilterExpanded(!isFilterExpanded)}
      />

      <Card
        title="Persons"
        subtitle="Manage person registry"
        actions={canCreate(role, 'persons') ? <Button variant="primary" onClick={handleAdd}>+ Add Person</Button> : undefined}
      >
        <Table columns={columns} data={persons} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Person' : 'Add Person'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#1e40af' }}>
              <strong>ℹ️ Person Registry</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>Register individuals in the system. This includes vessel owners, captains, fishermen, and inspectors. EGN (Unique Citizen Number) is required.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <Input label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required fullWidth helperText="Person's legal first name" />
              <Input label="Middle Name" value={formData.middleName} onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} fullWidth helperText="Middle name (optional)" />
              <Input label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required fullWidth helperText="Person's family name" />
            </div>
            <Input label="EGN" value={formData.egn} onChange={(e) => setFormData({ ...formData, egn: e.target.value })} required fullWidth helperText="Unique Citizen Number (10 digits)" maxLength={10} />
            <Input label="Phone" type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} fullWidth helperText="Contact phone number with country code" placeholder="+359..." />
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
