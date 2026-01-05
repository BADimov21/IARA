import React, { useState, useEffect } from 'react';
import { violationApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FilterField } from '../../shared';
import type { ViolationFilter, BaseFilter } from '../../../shared/types';

interface ViolationItem {
  id: number;
  inspectionId?: number;
  violationType?: string;
  description?: string;
  fineAmount?: number;
  isPaid?: boolean;
  paidDate?: string;
}

export const ViolationList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [violations, setViolations] = useState<ViolationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ViolationItem | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    inspectionId: '',
    violationType: '',
    description: '',
    fineAmount: '',
  });

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'inspectionId', label: 'Inspection ID', type: 'number', placeholder: 'Inspection ID' },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'Search description' },
    { name: 'minFineAmount', label: 'Min Fine', type: 'number', placeholder: 'Min fine amount' },
    { name: 'maxFineAmount', label: 'Max Fine', type: 'number', placeholder: 'Max fine amount' },
  ];

  useEffect(() => {
    loadViolations();
  }, []);

  const loadViolations = async (customFilters?: ViolationFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<ViolationFilter> = { page: 1, pageSize: 100, filters: customFilters || {} };
      const data = await violationApi.getAll(filters);
      setViolations(data);
    } catch (error) {
      console.error('Failed to load violations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: ViolationFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        if (key.includes('Fine') || key === 'id' || key === 'inspectionId') {
          filters[key as keyof ViolationFilter] = Number(value) as any;
        } else {
          filters[key as keyof ViolationFilter] = value as any;
        }
      }
    });
    loadViolations(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadViolations({});
  };

  const handleAdd = () => {
    if (!canCreate(role, 'violations')) return;
    setEditingItem(null);
    setFormData({ inspectionId: '', violationType: '', description: '', fineAmount: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: ViolationItem) => {
    if (!canEdit(role, 'violations')) return;
    setEditingItem(item);
    setFormData({
      inspectionId: item.inspectionId?.toString() || '',
      violationType: item.violationType || '',
      description: item.description || '',
      fineAmount: item.fineAmount?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'violations')) return;
    
    const confirmed = await confirm({
      title: 'Delete Violation',
      message: 'Are you sure you want to delete this violation? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await violationApi.delete(Number(id));
      toast.success('Violation deleted successfully');
      await loadViolations();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete violation');
    }
  };

  const handleMarkAsPaid = async (id: number) => {
    if (role !== 'Admin') return;
    
    const confirmed = await confirm({
      title: 'Mark Violation as Paid',
      message: 'Confirm that the fine has been paid by the vessel owner?',
      confirmText: 'Mark as Paid',
      variant: 'primary',
    });
    
    if (!confirmed) return;

    try {
      await violationApi.edit({ id, isPaid: true });
      toast.success('Violation marked as paid');
      await loadViolations();
    } catch (error) {
      console.error('Failed to update payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'violations')) return;
    try {
      const payload = {
        inspectionId: Number(formData.inspectionId),
        violationType: formData.violationType,
        description: formData.description,
        fineAmount: formData.fineAmount ? parseFloat(formData.fineAmount) : 0,
      };
      if (editingItem) {
        await violationApi.edit({ id: editingItem.id, ...payload });
        toast.success('Violation updated successfully');
      } else {
        await violationApi.add(payload);
        toast.success('Violation added successfully');
      }
      setIsModalOpen(false);
      await loadViolations();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save violation');
    }
  };

  const columns: Column<ViolationItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'violationType', header: 'Type' },
    { key: 'description', header: 'Description' },
    { key: 'fineAmount', header: 'Fine Amount', render: (item) => item.fineAmount ? `${item.fineAmount} BGN` : '-' },
    {
      key: 'isPaid',
      header: 'Payment Status',
      render: (item) => (
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: '500',
          backgroundColor: item.isPaid ? 'rgba(34, 197, 94, 0.1)' : 'rgba(251, 191, 36, 0.1)',
          color: item.isPaid ? '#15803d' : '#a16207',
        }}>
          {item.isPaid ? '✓ Paid' : '⏳ Unpaid'}
        </span>
      ),
    },
    {
      key: 'paidDate',
      header: 'Paid Date',
      render: (item) => item.paidDate ? new Date(item.paidDate).toLocaleDateString() : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '240px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {!item.isPaid && role === 'Admin' && (
            <Button size="small" variant="success" onClick={() => handleMarkAsPaid(item.id)}>Mark as Paid</Button>
          )}
          {canEdit(role, 'violations') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'violations') && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'violations') && (
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
        title="Violations"
        subtitle="Track fishing regulation violations"
        actions={canCreate(role, 'violations') ? <Button variant="primary" onClick={handleAdd}>+ Add Violation</Button> : undefined}
      >
        <Table columns={columns} data={violations} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Violation' : 'Add Violation'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Inspection ID" value={formData.inspectionId} onChange={(e) => setFormData({ ...formData, inspectionId: e.target.value })} required fullWidth />
            <Input label="Violation Type" value={formData.violationType} onChange={(e) => setFormData({ ...formData, violationType: e.target.value })} required fullWidth />
            <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required fullWidth />
            <Input label="Fine Amount (BGN)" type="number" step="0.01" value={formData.fineAmount} onChange={(e) => setFormData({ ...formData, fineAmount: e.target.value })} fullWidth />
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
