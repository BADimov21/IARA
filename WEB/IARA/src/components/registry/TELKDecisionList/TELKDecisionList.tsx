import React, { useState, useEffect } from 'react';
import { telkDecisionApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { TELKDecisionFilter, BaseFilter } from '../../../shared/types';
import type { FilterField } from '../../shared/FilterPanel/FilterPanel';

interface TELKDecisionItem {
  id: number;
  decisionNumber?: string;
  decisionDate?: string;
  subject?: string;
  description?: string;
}

export const TELKDecisionList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [decisions, setDecisions] = useState<TELKDecisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TELKDecisionItem | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    decisionNumber: '',
    decisionDate: '',
    subject: '',
    description: '',
  });

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'decisionNumber', label: 'Decision Number', type: 'text', placeholder: 'Search number' },
    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Search subject' },
    { name: 'decisionDateFrom', label: 'Date From', type: 'date' },
    { name: 'decisionDateTo', label: 'Date To', type: 'date' },
  ];

  useEffect(() => {
    loadDecisions();
  }, []);

  const loadDecisions = async (customFilters?: TELKDecisionFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<TELKDecisionFilter> = { page: 1, pageSize: 100, filters: customFilters || {} };
      const data = await telkDecisionApi.getAll(filters);
      setDecisions(data);
    } catch (error) {
      console.error('Failed to load TELK decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: TELKDecisionFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        if (key === 'id') {
          filters[key] = Number(value);
        } else {
          filters[key as keyof TELKDecisionFilter] = value as any;
        }
      }
    });
    loadDecisions(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadDecisions({});
  };

  const handleAdd = () => {
    if (!canCreate(role, 'telkDecisions')) return;
    setEditingItem(null);
    setFormData({ decisionNumber: '', decisionDate: '', subject: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: TELKDecisionItem) => {
    if (!canEdit(role, 'telkDecisions')) return;
    setEditingItem(item);
    setFormData({
      decisionNumber: item.decisionNumber || '',
      decisionDate: item.decisionDate ? item.decisionDate.split('T')[0] : '',
      subject: item.subject || '',
      description: item.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'telkDecisions')) return;
    
    const confirmed = await confirm({
      title: 'Delete TELK Decision',
      message: 'Are you sure you want to delete this TELK decision? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await telkDecisionApi.delete(Number(id));
      toast.success('TELK decision deleted successfully');
      await loadDecisions();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete TELK decision');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'telkDecisions')) return;
    try {
      const payload = {
        decisionNumber: formData.decisionNumber,
        subject: formData.subject,
        description: formData.description,
        personId: 1,
        issueDate: formData.decisionDate ? new Date(formData.decisionDate).toISOString() : '',
      };
      if (editingItem) {
        await telkDecisionApi.edit({ id: editingItem.id, ...payload });
        toast.success('TELK decision updated successfully');
      } else {
        await telkDecisionApi.add(payload);
        toast.success('TELK decision added successfully');
      }
      setIsModalOpen(false);
      await loadDecisions();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save TELK decision');
    }
  };

  const columns: Column<TELKDecisionItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'decisionNumber', header: 'Decision Number' },
    { key: 'decisionDate', header: 'Date', render: (item) => item.decisionDate ? new Date(item.decisionDate).toLocaleDateString() : '-' },
    { key: 'subject', header: 'Subject' },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'telkDecisions') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'telkDecisions') && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'telkDecisions') && (
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
        title="TELK Decisions"
        subtitle="Manage regulatory committee decisions"
        actions={canCreate(role, 'telkDecisions') ? <Button variant="primary" onClick={handleAdd}>+ Add Decision</Button> : undefined}
      >
        <Table columns={columns} data={decisions} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Decision' : 'Add Decision'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Decision Number" value={formData.decisionNumber} onChange={(e) => setFormData({ ...formData, decisionNumber: e.target.value })} required fullWidth />
              <Input label="Decision Date" type="date" value={formData.decisionDate} onChange={(e) => setFormData({ ...formData, decisionDate: e.target.value })} required fullWidth />
            </div>
            <Input label="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required fullWidth />
            <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required fullWidth />
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
