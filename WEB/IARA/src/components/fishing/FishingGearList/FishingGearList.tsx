import React, { useState, useEffect } from 'react';
import { fishingGearApi, fishingGearTypeApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Select, Loading, Card, ConfirmDialog, useToast, FilterPanel } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FishingGearFilter, BaseFilter } from '../../../shared/types';
import type { FilterField } from '../../shared/FilterPanel/FilterPanel';

interface FishingGearItem {
  id: number;
  gearTypeId?: number;
  gearTypeName?: string;
  vesselId?: number;
  vesselName?: string;
  meshSize?: number;
  length?: number;
}

export const FishingGearList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [gears, setGears] = useState<FishingGearItem[]>([]);
  const [gearTypes, setGearTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FishingGearItem | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    gearTypeId: '',
    meshSize: '',
    length: '',
  });

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'gearTypeId', label: 'Gear Type ID', type: 'number', placeholder: 'Search by type' },
    { name: 'minMeshSize', label: 'Min Mesh Size (mm)', type: 'number', placeholder: 'Min mesh' },
    { name: 'maxMeshSize', label: 'Max Mesh Size (mm)', type: 'number', placeholder: 'Max mesh' },
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadGears(),
      loadGearTypes(),
    ]);
  };

  const loadGearTypes = async () => {
    try {
      const filters = { page: 1, pageSize: 1000, filters: {} };
      const data = await fishingGearTypeApi.getAll(filters);
      setGearTypes(data.map((type: any) => ({
        id: type.id,
        name: type.typeName || type.name || `Type ${type.id}`,
      })));
    } catch (error) {
      console.error('Failed to load gear types:', error);
    }
  };

  const loadGears = async (customFilters?: FishingGearFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<FishingGearFilter> = { page: 1, pageSize: 100, filters: customFilters || {} };
      const data = await fishingGearApi.getAll(filters);
      console.log('🎣 Fishing Gear API Response:', data);
      if (data && data.length > 0) {
        console.log('📦 First gear data structure:', data[0]);
        console.log('🚢 vesselName field:', data[0].vesselName);
        console.log('🚢 vessel field:', data[0].vessel);
      }
      setGears(data);
    } catch (error) {
      console.error('Failed to load fishing gears:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: FishingGearFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        filters[key as keyof FishingGearFilter] = Number(value);
      }
    });
    loadGears(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadGears({});
  };

  const handleAdd = () => {
    if (!canCreate(role, 'fishingGear')) return;
    
    // Validate prerequisites
    if (gearTypes.length === 0) {
      toast.error('Please create fishing gear types first before adding fishing gear');
      return;
    }
    
    setEditingItem(null);
    setFormData({ gearTypeId: '', meshSize: '', length: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: FishingGearItem) => {
    if (!canEdit(role, 'fishingGear')) return;
    setEditingItem(item);
    setFormData({
      gearTypeId: item.gearTypeId?.toString() || '',
      meshSize: item.meshSize?.toString() || '',
      length: item.length?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'fishingGear')) return;
    
    const confirmed = await confirm({
      title: 'Delete Fishing Gear',
      message: 'Are you sure you want to delete this fishing gear? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await fishingGearApi.delete(Number(id));
      toast.success('Fishing gear deleted successfully');
      await loadGears();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete fishing gear');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'fishingGear')) return;
    try {
      const payload = {
        gearTypeId: Number(formData.gearTypeId),
        meshSize: formData.meshSize ? parseFloat(formData.meshSize) : undefined,
        length: formData.length ? parseFloat(formData.length) : undefined,
      };
      if (editingItem) {
        await fishingGearApi.edit({ id: editingItem.id, ...payload });
        toast.success('Fishing gear updated successfully');
      } else {
        await fishingGearApi.add(payload);
        toast.success('Fishing gear added successfully');
      }
      setIsModalOpen(false);
      await loadGears();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save fishing gear');
    }
  };

  const columns: Column<FishingGearItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { 
      key: 'gearTypeName', 
      header: 'Gear Type',
      render: (item: any) => item.gearTypeName || item.gearType?.name || item.gearType?.typeName || '-'
    },
    { key: 'meshSize', header: 'Mesh Size (mm)', render: (item) => item.meshSize ? `${item.meshSize} mm` : '-' },
    { key: 'length', header: 'Length (m)', render: (item) => item.length ? `${item.length} m` : '-' },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'fishingGear') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'fishingGear') && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'fishingGear') && (
        <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', color: '#0369a1' }}>
          You have view-only access to this page.
        </div>
      )}
      
      <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#4338ca' }}>🎣 Fishing Gear Registry</h3>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#4338ca' }}>
          Register and manage fishing gear types and specifications. This includes nets, hooks, traps, and other fishing equipment.
          Gear will be assigned to vessels through fishing permits.
        </p>
      </div>
      
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
        title="Fishing Gear"
        subtitle="Manage vessel fishing gear inventory"
        actions={canCreate(role, 'fishingGear') ? <Button variant="primary" onClick={handleAdd}>+ Add Gear</Button> : undefined}
      >
        <Table columns={columns} data={gears} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Gear' : 'Add Gear'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ marginBottom: '0.5rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#4338ca' }}>
              ℹ️ Register fishing gear with specifications like mesh size and length. Gear will be linked to vessels through fishing permits.
            </div>
            
            <Select
              label="Gear Type"
              value={formData.gearTypeId}
              onChange={(e) => setFormData({ ...formData, gearTypeId: e.target.value })}
              required
              fullWidth
              options={[
                { value: '', label: '-- Select Gear Type --' },
                ...gearTypes.map(type => ({ value: type.id.toString(), label: type.name }))
              ]}
              helperText="Type of fishing gear (e.g., nets, hooks, traps)"
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Mesh Size (mm)"
                type="number"
                step="0.1"
                value={formData.meshSize}
                onChange={(e) => setFormData({ ...formData, meshSize: e.target.value })}
                fullWidth
                placeholder="e.g., 40.0"
                helperText="Optional: mesh size in millimeters"
              />
              <Input
                label="Length (m)"
                type="number"
                step="0.1"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                fullWidth
                placeholder="e.g., 100.0"
                helperText="Optional: gear length in meters"
              />
            </div>
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
