import React, { useState, useEffect } from 'react';
import { fishingPermitApi, vesselApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel, Select } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { FishingPermitFilter, BaseFilter } from '../../../shared/types';
import type { FilterField } from '../../shared/FilterPanel/FilterPanel';

interface FishingPermitItem {
  id: number;
  vesselId?: string;
  vesselName?: string;
  permitNumber?: string;
  issueDate?: string;
  expiryDate?: string;
}

export const FishingPermitList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [permits, setPermits] = useState<FishingPermitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FishingPermitItem | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [vessels, setVessels] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    vesselId: '',
    permitNumber: '',
    issueDate: '',
    expiryDate: '',
  });

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'permitNumber', label: 'Permit Number', type: 'text', placeholder: 'Search permit number' },
    { name: 'vesselId', label: 'Vessel ID', type: 'number', placeholder: 'Search by vessel' },
    { name: 'issueDateFrom', label: 'Issue Date From', type: 'date' },
    { name: 'issueDateTo', label: 'Issue Date To', type: 'date' },
  ];

  useEffect(() => {
    loadPermits();
    loadVessels();
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

  const loadPermits = async (customFilters?: FishingPermitFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<FishingPermitFilter> = { page: 1, pageSize: 100, filters: customFilters || {} };
      const data = await fishingPermitApi.getAll(filters);
      setPermits(data);
    } catch (error) {
      console.error('Failed to load fishing permits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: FishingPermitFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        if (key === 'id' || key === 'vesselId') {
          filters[key] = Number(value);
        } else {
          filters[key as keyof FishingPermitFilter] = value as any;
        }
      }
    });
    loadPermits(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadPermits({});
  };

  const handleAdd = () => {
    if (!canCreate(role, 'fishingPermits')) return;
    setEditingItem(null);
    setFormData({ vesselId: '', permitNumber: '', issueDate: '', expiryDate: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: FishingPermitItem) => {
    if (!canEdit(role, 'fishingPermits')) return;
    setEditingItem(item);
    setFormData({
      vesselId: item.vesselId || '',
      permitNumber: item.permitNumber || '',
      issueDate: item.issueDate ? item.issueDate.split('T')[0] : '',
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'fishingPermits')) return;
    
    const confirmed = await confirm({
      title: 'Delete Fishing Permit',
      message: 'Are you sure you want to delete this fishing permit? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await fishingPermitApi.delete(Number(id));
      toast.success('Fishing permit deleted successfully');
      await loadPermits();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete fishing permit');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'fishingPermits')) return;
    
    // Validation
    if (!formData.vesselId) {
      toast.error('Please select a vessel');
      return;
    }
    if (!formData.permitNumber.trim()) {
      toast.error('Please enter a permit number');
      return;
    }
    if (!formData.issueDate) {
      toast.error('Please enter the issue date');
      return;
    }
    if (!formData.expiryDate) {
      toast.error('Please enter the expiry date');
      return;
    }
    if (new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
      toast.error('Expiry date must be after issue date');
      return;
    }
    
    try {
      const payload = {
        vesselId: Number(formData.vesselId),
        permitNumber: formData.permitNumber,
        issueDate: formData.issueDate ? new Date(formData.issueDate).toISOString() : '',
        validFrom: formData.issueDate ? new Date(formData.issueDate).toISOString() : '',
        validUntil: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : '',
      };
      if (editingItem) {
        toast.info('Fishing permits cannot be edited once issued. Use the Revoke button if needed.');
        setIsModalOpen(false);
        return;
      } else {
        await fishingPermitApi.add(payload);
        toast.success('Fishing permit issued successfully');
      }
      setIsModalOpen(false);
      await loadPermits();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to issue fishing permit');
    }
  };

  const columns: Column<FishingPermitItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { 
      key: 'permitNumber', 
      header: 'Permit Number',
      render: (item: any) => item.permitNumber || '-'
    },
    { 
      key: 'vesselName', 
      header: 'Vessel',
      render: (item: any) => item.vessel?.vesselName || item.vessel?.name || item.vesselName || '-'
    },
    { 
      key: 'issueDate', 
      header: 'Issue Date', 
      render: (item: any) => {
        const date = item.issueDate || item.validFrom;
        if (!date) return '-';
        const d = new Date(date);
        return !isNaN(d.getTime()) ? d.toLocaleDateString() : '-';
      }
    },
    { 
      key: 'expiryDate', 
      header: 'Expiry Date', 
      render: (item: any) => {
        const date = item.validUntil || item.expiryDate;
        if (!date) return '-';
        const d = new Date(date);
        return !isNaN(d.getTime()) ? d.toLocaleDateString() : '-';
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'fishingPermits') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'fishingPermits') && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'fishingPermits') && (
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
        title="Fishing Permits"
        subtitle="Manage vessel fishing permits and licenses"
        actions={canCreate(role, 'fishingPermits') ? <Button variant="primary" onClick={handleAdd}>+ Add Permit</Button> : undefined}
      >
        <Table columns={columns} data={permits} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Permit' : 'Issue Fishing Permit'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#4338ca' }}>
              <strong>📋 Issuing a Fishing Permit</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>A fishing permit authorizes a vessel to conduct commercial fishing operations. Select the vessel and specify the permit validity period.</p>
            </div>

            <Select
              label="Vessel"
              value={formData.vesselId}
              onChange={(e) => setFormData({ ...formData, vesselId: e.target.value })}
              required
              fullWidth
              helperText="Select the vessel for this permit"
              options={[
                { value: '', label: '-- Select Vessel --' },
                ...vessels.map((vessel: any) => ({
                  value: vessel.id.toString(),
                  label: `${vessel.vesselName || vessel.name || 'Unknown'} (CFR: ${vessel.internationalNumber || vessel.cfr || 'N/A'})`
                }))
              ]}
            />

            <Input 
              label="Permit Number" 
              value={formData.permitNumber} 
              onChange={(e) => setFormData({ ...formData, permitNumber: e.target.value })} 
              required 
              fullWidth 
              placeholder="e.g., FP-2026-001"
              helperText="Unique identifier for this permit"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input 
                label="Issue Date" 
                type="date" 
                value={formData.issueDate} 
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} 
                required 
                fullWidth 
                helperText="When the permit is issued"
                max={formData.expiryDate || undefined}
              />
              <Input 
                label="Expiry Date" 
                type="date" 
                value={formData.expiryDate} 
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} 
                required 
                fullWidth 
                helperText="When the permit expires"
                min={formData.issueDate || undefined}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">{editingItem ? 'Update' : 'Issue Permit'}</Button>
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
