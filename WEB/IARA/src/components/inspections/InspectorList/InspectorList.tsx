import React, { useState, useEffect } from 'react';
import { inspectorApi, personApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel, Select } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FilterField } from '../../shared';
import type { InspectorFilter, BaseFilter } from '../../../shared/types';

interface InspectorItem {
  id: number;
  firstName?: string;
  lastName?: string;
  badgeNumber?: string;
  phone?: string;
  personId?: number;
  person?: { id: number; firstName?: string; lastName?: string; egn?: string; phone?: string; phoneNumber?: string };
}

export const InspectorList: React.FC = () => {
  const { role } = useAuth();  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();  const [inspectors, setInspectors] = useState<InspectorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InspectorItem | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [persons, setPersons] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    personId: '',
    firstName: '',
    lastName: '',
    badgeNumber: '',
    phone: '',
  });

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Search first name' },
    { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Search last name' },
    { name: 'badgeNumber', label: 'Badge Number', type: 'text', placeholder: 'Search badge' },
  ];

  useEffect(() => {
    loadInspectors();
    loadPersons();
  }, []);

  const loadPersons = async () => {
    try {
      const filters = { page: 1, pageSize: 100, filters: {} };
      const data = await personApi.getAll(filters);
      setPersons(data);
    } catch (error) {
      console.error('Failed to load persons:', error);
    }
  };

  const loadInspectors = async (customFilters?: InspectorFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<InspectorFilter> = { page: 1, pageSize: 100, filters: customFilters || {} };
      const data = await inspectorApi.getAll(filters);
      setInspectors(data);
    } catch (error) {
      console.error('Failed to load inspectors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: InspectorFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        if (key === 'id' || key === 'personId') {
          filters[key as keyof InspectorFilter] = Number(value) as any;
        } else {
          filters[key as keyof InspectorFilter] = value as any;
        }
      }
    });
    loadInspectors(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadInspectors({});
  };

  const handleAdd = () => {
    if (!canCreate(role, 'inspectors')) return;
    setEditingItem(null);
    setFormData({ personId: '', firstName: '', lastName: '', badgeNumber: '', phone: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: InspectorItem) => {
    if (!canEdit(role, 'inspectors')) return;
    setEditingItem(item);
    setFormData({
      personId: item.personId?.toString() || '',
      firstName: item.firstName || '',
      lastName: item.lastName || '',
      badgeNumber: item.badgeNumber || '',
      phone: item.phone || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'inspectors')) return;
    
    const confirmed = await confirm({
      title: 'Delete Inspector',
      message: 'Are you sure you want to delete this inspector? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await inspectorApi.delete(Number(id));
      toast.success('Inspector deleted successfully');
      await loadInspectors();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete inspector');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'inspectors')) return;
    
    // Validation
    if (!formData.personId && !editingItem) {
      toast.error('Please select a person');
      return;
    }
    if (!formData.badgeNumber.trim()) {
      toast.error('Please enter a badge number');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter a phone number');
      return;
    }
    
    try {
      const payload = {
        personId: Number(formData.personId),
        badgeNumber: formData.badgeNumber,
        phone: formData.phone,
      };
      if (editingItem) {
        await inspectorApi.edit({ id: editingItem.id, ...payload });
        toast.success('Inspector updated successfully');
      } else {
        await inspectorApi.add(payload);
        toast.success('Inspector added successfully');
      }
      setIsModalOpen(false);
      await loadInspectors();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error(editingItem ? 'Failed to update inspector' : 'Failed to add inspector');
    }
  };

  const columns: Column<InspectorItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'badgeNumber', header: 'Badge Number' },
    { key: 'firstName', header: 'First Name', render: (item) => {
      return item.person?.firstName || item.firstName || '-';
    }},
    { key: 'lastName', header: 'Last Name', render: (item) => {
      return item.person?.lastName || item.lastName || '-';
    }},
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'inspectors') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'inspectors') && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'inspectors') && (
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
        title="Inspectors"
        subtitle="Manage fisheries inspectors"
        actions={canCreate(role, 'inspectors') ? <Button variant="primary" onClick={handleAdd}>+ Add Inspector</Button> : undefined}
      >
        <Table columns={columns} data={inspectors} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Inspector' : 'Add Inspector'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#4338ca' }}>
              <strong>👮 Register an Inspector</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>Add authorized fisheries inspectors who conduct vessel inspections and enforce fishing regulations.</p>
            </div>

            {!editingItem && (
              <Select
                label="Person"
                value={formData.personId}
                onChange={(e) => {
                  const person = persons.find(p => p.id === Number(e.target.value));
                  setFormData({ 
                    ...formData, 
                    personId: e.target.value,
                    firstName: person?.firstName || '',
                    lastName: person?.lastName || '',
                    phone: person?.phone || formData.phone
                  });
                }}
                required
                fullWidth
                helperText="Select the person to designate as an inspector"
                options={[
                  { value: '', label: '-- Select Person --' },
                  ...persons.map((person: any) => ({
                    value: person.id.toString(),
                    label: `${person.firstName || ''} ${person.lastName || ''} - EGN: ${person.egn || 'N/A'}`.trim()
                  }))
                ]}
              />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input 
                label="First Name" 
                value={formData.firstName} 
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                disabled
                fullWidth 
                helperText="From selected person"
              />
              <Input 
                label="Last Name" 
                value={formData.lastName} 
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                disabled
                fullWidth 
                helperText="From selected person"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input 
                label="Badge Number" 
                value={formData.badgeNumber} 
                onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })} 
                required 
                fullWidth 
                placeholder="e.g., INS-2026-001"
                helperText="Official inspector identification number"
              />
              <Input 
                label="Phone" 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                required 
                fullWidth 
                placeholder="e.g., +359 888 123 456"
                helperText="Contact phone number"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">{editingItem ? 'Update Inspector' : 'Add Inspector'}</Button>
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
