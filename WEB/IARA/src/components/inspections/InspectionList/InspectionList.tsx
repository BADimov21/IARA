import React, { useState, useEffect } from 'react';
import { inspectionApi, vesselApi, inspectorApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel, Select } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FilterField } from '../../shared';
import type { InspectionFilter, BaseFilter } from '../../../shared/types';

interface InspectionItem {
  id: number;
  inspectionDate?: string;
  inspectionDateTime?: string;
  inspectorId?: number;
  inspector?: { id: number; firstName?: string; lastName?: string; badgeNumber?: string };
  vesselId?: number;
  vessel?: { id: number; vesselName?: string; name?: string; internationalNumber?: string; cfr?: string };
  location?: string;
  observations?: string;
  inspectionType?: string;
  isCompliant?: boolean;
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
  const [vessels, setVessels] = useState<any[]>([]);
  const [inspectors, setInspectors] = useState<any[]>([]);
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
    loadVessels();
    loadInspectors();
  }, []);

  const loadVessels = async () => {
    try {
      const filters = { page: 1, pageSize: 100, filters: {} };
      const data = await vesselApi.getAll(filters);
      setVessels(data);
    } catch (error) {
      console.error('Failed to load vessels:', error);
    }
  };

  const loadInspectors = async () => {
    try {
      const filters = { page: 1, pageSize: 100, filters: {} };
      const data = await inspectorApi.getAll(filters);
      setInspectors(data);
    } catch (error) {
      console.error('Failed to load inspectors:', error);
    }
  };

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
    if (inspectors.length === 0) {
      toast.error('Please register at least one inspector before creating an inspection');
      return;
    }
    if (vessels.length === 0) {
      toast.error('Please register at least one vessel before creating an inspection');
      return;
    }
    setEditingItem(null);
    setFormData({ inspectorId: '', vesselId: '', inspectionDate: '', location: '', observations: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: InspectionItem) => {
    if (!canEdit(role, 'inspections')) return;
    setEditingItem(item);
    const date = item.inspectionDateTime || item.inspectionDate;
    const inspectorId = item.inspector?.id || item.inspectorId;
    const vesselId = item.vessel?.id || item.vesselId;
    setFormData({
      inspectorId: inspectorId?.toString() || '',
      vesselId: vesselId?.toString() || '',
      inspectionDate: date ? (typeof date === 'string' ? date.split('T')[0] : new Date(date).toISOString().split('T')[0]) : '',
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
    
    // Validation
    if (!formData.inspectorId) {
      toast.error('Please select an inspector');
      return;
    }
    if (!formData.vesselId) {
      toast.error('Please select a vessel');
      return;
    }
    if (!formData.inspectionDate) {
      toast.error('Please enter the inspection date');
      return;
    }
    if (!formData.location.trim()) {
      toast.error('Please enter the inspection location');
      return;
    }
    
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
        toast.success('Inspection recorded successfully');
      }
      setIsModalOpen(false);
      await loadInspections();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error(editingItem ? 'Failed to update inspection' : 'Failed to record inspection');
    }
  };

  const columns: Column<InspectionItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'inspectionDate', header: 'Date', render: (item) => {
      const date = item.inspectionDateTime || item.inspectionDate;
      return date ? new Date(date).toLocaleDateString() : '-';
    }},
    { key: 'inspector', header: 'Inspector', render: (item) => {
      if (item.inspector) {
        return `${item.inspector.badgeNumber || `#${item.inspector.id}`} - ${item.inspector.firstName || ''} ${item.inspector.lastName || ''}`.trim();
      }
      return item.inspectorId ? `Inspector #${item.inspectorId}` : '-';
    }},
    { key: 'vessel', header: 'Vessel', render: (item) => {
      if (item.vessel) {
        const name = item.vessel.vesselName || item.vessel.name || 'Unknown';
        const cfr = item.vessel.internationalNumber || item.vessel.cfr || 'No CFR';
        return `${name} (${cfr})`;
      }
      return item.vesselId ? `Vessel #${item.vesselId}` : '-';
    }},
    { key: 'location', header: 'Location' },
    { key: 'observations', header: 'Observations', render: (item) => item.observations || '-' },
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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Inspection' : 'Record Inspection'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#4338ca' }}>
              <strong>🔍 Recording an Inspection</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>Document vessel inspections for regulatory compliance. Record inspection findings, compliance status, and any observations.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Select
                label="Inspector"
                value={formData.inspectorId}
                onChange={(e) => setFormData({ ...formData, inspectorId: e.target.value })}
                required
                fullWidth
                helperText="Inspector conducting this inspection"
                options={[
                  { value: '', label: '-- Select Inspector --' },
                  ...inspectors.map((inspector: any) => ({
                    value: inspector.id.toString(),
                    label: `${inspector.badgeNumber || `#${inspector.id}`} - ${inspector.firstName || ''} ${inspector.lastName || ''}`.trim()
                  }))
                ]}
              />

              <Select
                label="Vessel"
                value={formData.vesselId}
                onChange={(e) => setFormData({ ...formData, vesselId: e.target.value })}
                required
                fullWidth
                helperText="Vessel being inspected"
                options={[
                  { value: '', label: '-- Select Vessel --' },
                  ...vessels.map((vessel: any) => ({
                    value: vessel.id.toString(),
                    label: `${vessel.vesselName || vessel.name || 'Unknown'} (${vessel.internationalNumber || vessel.cfr || 'No CFR'})`
                  }))
                ]}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input 
                label="Inspection Date" 
                type="date" 
                value={formData.inspectionDate} 
                onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })} 
                required 
                fullWidth 
                helperText="When the inspection was conducted"
                max={new Date().toISOString().split('T')[0]}
              />
              <Input 
                label="Location" 
                value={formData.location} 
                onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                required 
                fullWidth 
                placeholder="e.g., Burgas Port, At Sea - 42.5°N 27.5°E"
                helperText="Where the inspection took place"
              />
            </div>

            <Input 
              label="Observations" 
              value={formData.observations} 
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })} 
              fullWidth 
              placeholder="Additional findings or notes from the inspection..."
              helperText="Optional notes about compliance, gear condition, or other findings"
            />

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">{editingItem ? 'Update Inspection' : 'Record Inspection'}</Button>
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
