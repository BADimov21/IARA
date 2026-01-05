import React, { useState, useEffect } from 'react';
import { inspectionApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FilterField } from '../../shared';
import type { InspectionFilter, BaseFilter } from '../../../shared/types';

interface InspectionItem {
  id: number;
  inspectionDate: string;
  inspectorId: number;
  vesselId: number;
  location: string;
  observations: string;
}

export const InspectionList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [inspections, setInspections] = useState<InspectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InspectionItem | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    inspectorId: '',
    vesselId: '',
    inspectionDate: '',
    location: '',
    observations: '',
  });

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'inspectorId', label: 'Inspector ID', type: 'number', placeholder: 'Inspector ID' },
    { name: 'vesselId', label: 'Vessel ID', type: 'number', placeholder: 'Vessel ID' },
    { name: 'inspectionDateTimeFrom', label: 'From Date', type: 'date' },
    { name: 'inspectionDateTimeTo', label: 'To Date', type: 'date' },
    { name: 'location', label: 'Location', type: 'text', placeholder: 'Search location' },
  ];

  useEffect(() => {
    loadInspections();
  }, []);

  const loadInspections = async (customFilters?: InspectionFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<InspectionFilter> = { 
        page: 1, 
        pageSize: 100, 
        filters: customFilters || {} 
      };
      const data = await inspectionApi.getAll(filters);
      setInspections(data);
    } catch (error) {
      console.error('Failed to load inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: InspectionFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        if (key === 'id' || key === 'inspectorId' || key === 'vesselId') {
          filters[key as keyof InspectionFilter] = Number(value) as any;
        } else if (key === 'inspectionDateTimeFrom' || key === 'inspectionDateTimeTo') {
          filters[key] = new Date(value).toISOString();
        } else {
          filters[key as keyof InspectionFilter] = value as any;
        }
      }
    });
    loadInspections(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadInspections({});
  };

  const handleAdd = () => {
    if (!canCreate(role, 'inspections')) return;
    setEditingItem(null);
    setFormData({ inspectorId: '', vesselId: '', inspectionDate: '', location: '', observations: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: InspectionItem) => {
    if (!canEdit(role, 'inspections')) return;
    setEditingItem(item);
    setFormData({
      inspectorId: String(item.inspectorId || ''),
      vesselId: String(item.vesselId || ''),
      inspectionDate: item.inspectionDate ? item.inspectionDate.split('T')[0] : '',
      location: item.location || '',
      observations: item.observations || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'inspections')) return;
    
    const confirmed = await confirm({
      title: 'Delete Inspection',
      message: 'Are you sure you want to delete this inspection? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await inspectionApi.delete(Number(id));
      toast.success('Inspection deleted successfully');
      await loadInspections();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete inspection');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'inspections')) return;
    try {
      const payload = {
        inspectorId: Number(formData.inspectorId),
        vesselId: Number(formData.vesselId),
        inspectionDateTime: formData.inspectionDate ? new Date(formData.inspectionDate).toISOString() : new Date().toISOString(),
        inspectionType: 'Standard',
        location: formData.location,
        isCompliant: true,
        observations: formData.observations,
      };
      if (editingItem) {
        await inspectionApi.edit({ id: editingItem.id, ...payload });
        toast.success('Inspection updated successfully');
      } else {
        await inspectionApi.add(payload);
        toast.success('Inspection added successfully');
      }
      setIsModalOpen(false);
      await loadInspections();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save inspection');
    }
  };

  const columns: Column<InspectionItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'inspectionDate', header: 'Date', render: (item) => item.inspectionDate ? new Date(item.inspectionDate).toLocaleDateString() : '-' },
    { key: 'inspectorId', header: 'Inspector ID' },
    { key: 'vesselId', header: 'Vessel ID' },
    { key: 'location', header: 'Location' },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'inspections') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'inspections') && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'inspections') && (
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
        title="Inspections"
        subtitle="Track vessel inspections"
        actions={canCreate(role, 'inspections') ? <Button variant="primary" onClick={handleAdd}>+ Add Inspection</Button> : undefined}
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
            <Input label="Observations" value={formData.observations} onChange={(e) => setFormData({ ...formData, observations: e.target.value })} fullWidth />
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
