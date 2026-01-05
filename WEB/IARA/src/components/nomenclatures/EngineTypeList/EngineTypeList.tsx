import React, { useState, useEffect } from 'react';
import { engineTypeApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FilterField } from '../../shared';
import type { EngineTypeResponseDTO, EngineTypeFilter, BaseFilter } from '../../../shared/types';

export const EngineTypeList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [items, setItems] = useState<EngineTypeResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EngineTypeResponseDTO | null>(null);
  const [formData, setFormData] = useState({ typeName: '', averageFuelConsumption: '', fuelUnit: '' });
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'typeName', label: 'Type Name', type: 'text', placeholder: 'Search type name' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (customFilters?: EngineTypeFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<EngineTypeFilter> = { page: 1, pageSize: 100, filters: customFilters || {} };
      const data = await engineTypeApi.getAll(filters);
      setItems(data);
    } catch (error) {
      console.error('Failed to load engine types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: EngineTypeFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        if (key === 'id') {
          filters[key] = Number(value);
        } else {
          filters[key as keyof EngineTypeFilter] = value as any;
        }
      }
    });
    loadData(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadData({});
  };

  const handleAdd = () => {
    if (!canCreate(role, 'engineTypes')) return;
    setEditingItem(null);
    setFormData({ typeName: '', averageFuelConsumption: '', fuelUnit: 'L/h' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: EngineTypeResponseDTO) => {
    if (!canEdit(role, 'engineTypes')) return;
    setEditingItem(item);
    setFormData({ 
      typeName: item.typeName || '', 
      averageFuelConsumption: item.averageFuelConsumption?.toString() || '', 
      fuelUnit: item.fuelUnit || 'L/h' 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!canDelete(role, 'engineTypes')) return;
    
    const confirmed = await confirm({
      title: 'Delete Engine Type',
      message: 'Are you sure you want to delete this engine type? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await engineTypeApi.delete(id);
      toast.success('Engine type deleted successfully');
      await loadData();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete engine type');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'engineTypes')) return;
    try {
      const payload = {
        typeName: formData.typeName,
        averageFuelConsumption: parseFloat(formData.averageFuelConsumption) || 0,
        fuelUnit: formData.fuelUnit,
      };
      if (editingItem) {
        await engineTypeApi.edit({ id: editingItem.id, ...payload });
        toast.success('Engine type updated successfully');
      } else {
        await engineTypeApi.add(payload);
        toast.success('Engine type added successfully');
      }
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save engine type');
    }
  };

  const columns: Column<EngineTypeResponseDTO>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'typeName', header: 'Type Name' },
    { key: 'averageFuelConsumption', header: 'Avg. Fuel Consumption', render: (item) => `${item.averageFuelConsumption} ${item.fuelUnit}` },
    { key: 'fuelUnit', header: 'Fuel Unit' },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'engineTypes') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'engineTypes') && <Button size="small" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'engineTypes') && (
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
      <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', borderLeft: '4px solid rgb(99, 102, 241)' }}>
        <strong>⚙️ Engine Types</strong>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
          Manage vessel engine types and specifications. This information is used for vessel registration and monitoring.
        </p>
      </div>
      <Card
        title="Engine Types"
        subtitle="Manage engine type nomenclature"
        actions={canCreate(role, 'engineTypes') ? <Button variant="primary" onClick={handleAdd}>+ Add Engine Type</Button> : undefined}
      >
        <Table columns={columns} data={items} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Engine Type' : 'Add Engine Type'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Type Name" value={formData.typeName} onChange={(e) => setFormData({ ...formData, typeName: e.target.value })} required fullWidth />
            <Input label="Average Fuel Consumption" type="number" step="0.01" value={formData.averageFuelConsumption} onChange={(e) => setFormData({ ...formData, averageFuelConsumption: e.target.value })} required fullWidth />
            <Input label="Fuel Unit" value={formData.fuelUnit} onChange={(e) => setFormData({ ...formData, fuelUnit: e.target.value })} placeholder="L/h" required fullWidth />
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
