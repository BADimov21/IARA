import React, { useState, useEffect } from 'react';
import { fishingGearTypeApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FilterField } from '../../shared';
import type { FishingGearTypeResponseDTO, FishingGearTypeFilter, BaseFilter } from '../../../shared/types';

export const FishingGearTypeList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [items, setItems] = useState<FishingGearTypeResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FishingGearTypeResponseDTO | null>(null);
  const [formData, setFormData] = useState({ typeName: '' });
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'typeName', label: 'Name', type: 'text', placeholder: 'Search name' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (customFilters?: FishingGearTypeFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<FishingGearTypeFilter> = { page: 1, pageSize: 100, filters: customFilters || {} };
      const data = await fishingGearTypeApi.getAll(filters);
      setItems(data);
    } catch (error) {
      console.error('Failed to load fishing gear types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: FishingGearTypeFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        if (key === 'id') {
          filters[key] = Number(value);
        } else {
          filters[key as keyof FishingGearTypeFilter] = value as any;
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
    if (!canCreate(role, 'fishingGearTypes')) return;
    setEditingItem(null);
    setFormData({ typeName: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: FishingGearTypeResponseDTO) => {
    if (!canEdit(role, 'fishingGearTypes')) return;
    setEditingItem(item);
    setFormData({ typeName: item.typeName || item.name || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'fishingGearTypes')) return;
    
    const confirmed = await confirm({
      title: 'Delete Fishing Gear Type',
      message: 'Are you sure you want to delete this fishing gear type? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await fishingGearTypeApi.delete(id);
      toast.success('Fishing gear type deleted successfully');
      await loadData();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete fishing gear type');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'fishingGearTypes')) return;
    try {
      if (editingItem) {
        await fishingGearTypeApi.edit({ id: editingItem.id, ...formData });
        toast.success('Fishing gear type updated successfully');
      } else {
        await fishingGearTypeApi.add(formData);
        toast.success('Fishing gear type added successfully');
      }
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save fishing gear type');
    }
  };

  const columns: Column<FishingGearTypeResponseDTO>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { 
      key: 'typeName', 
      header: 'Gear Type Name',
      render: (item) => item.typeName || item.name || '-'
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'fishingGearTypes') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'fishingGearTypes') && <Button size="small" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      <FilterPanel
        fields={filterFields}
        values={filterValues}
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        isExpanded={isFilterExpanded}
        onToggle={() => setIsFilterExpanded(!isFilterExpanded)}
      />
      {!canEdit(role, 'fishingGearTypes') && (
        <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', color: '#0369a1' }}>
          You have view-only access to this page.
        </div>
      )}
      <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', borderLeft: '4px solid rgb(99, 102, 241)' }}>
        <strong>🎣 Fishing Gear Types</strong>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
          Configure types of fishing gear used in commercial and recreational fishing operations. This includes nets, lines, traps, and other fishing equipment.
        </p>
      </div>
      <Card
        title="Fishing Gear Types"
        subtitle="Manage fishing gear type nomenclature"
        actions={canCreate(role, 'fishingGearTypes') ? <Button variant="primary" onClick={handleAdd}>+ Add Gear Type</Button> : undefined}
      >
        <Table columns={columns} data={items} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Gear Type' : 'Add Gear Type'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input 
              label="Gear Type Name" 
              value={formData.typeName} 
              onChange={(e) => setFormData({ ...formData, typeName: e.target.value })} 
              required 
              fullWidth 
              placeholder="e.g., Gillnet, Trawl, Longline"
              helperText="Enter the name of the fishing gear type"
            />
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
