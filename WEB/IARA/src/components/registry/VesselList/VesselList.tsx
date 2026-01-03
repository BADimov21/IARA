import React, { useState, useEffect } from 'react';
import { vesselApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { VesselResponseDTO, VesselFilter, BaseFilter } from '../../../shared/types';

export const VesselList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [vessels, setVessels] = useState<VesselResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VesselResponseDTO | null>(null);
  const [formData, setFormData] = useState({
    vesselName: '',
    internationalNumber: '',
    callSign: '',
    length: '',
    width: '',
    grossTonnage: '',
    enginePower: '',
    engineTypeId: '',
    ownerId: '',
    captainId: '',
  });

  useEffect(() => {
    loadVessels();
  }, []);

  const loadVessels = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<VesselFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await vesselApi.getAll(filters);
      setVessels(data);
    } catch (error) {
      console.error('Failed to load vessels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ vesselName: '', internationalNumber: '', callSign: '', length: '', width: '', grossTonnage: '', enginePower: '', engineTypeId: '', ownerId: '', captainId: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: VesselResponseDTO) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({
      vesselName: item.vesselName || '',
      internationalNumber: item.internationalNumber || '',
      callSign: item.callSign || '',
      length: item.length?.toString() || '',
      width: item.width?.toString() || '',
      grossTonnage: item.grossTonnage?.toString() || '',
      enginePower: item.enginePower?.toString() || '',
      engineTypeId: item.engineTypeId?.toString() || '',
      ownerId: item.ownerId?.toString() || '',
      captainId: item.captainId?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!canDelete(role)) return;
    
    const confirmed = await confirm({
      title: 'Delete Vessel',
      message: 'Are you sure you want to delete this vessel? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await vesselApi.delete(id);
      toast.success('Vessel deleted successfully');
      await loadVessels();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete vessel');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
    try {
      const payload = {
        internationalNumber: formData.internationalNumber,
        callSign: formData.callSign,
        vesselName: formData.vesselName,
        length: formData.length ? parseFloat(formData.length) : 0,
        width: formData.width ? parseFloat(formData.width) : 0,
        grossTonnage: formData.grossTonnage ? parseFloat(formData.grossTonnage) : 0,
        enginePower: formData.enginePower ? parseFloat(formData.enginePower) : 0,
        engineTypeId: formData.engineTypeId ? parseInt(formData.engineTypeId) : 1,
        ownerId: formData.ownerId ? parseInt(formData.ownerId) : 1,
        captainId: formData.captainId ? parseInt(formData.captainId) : 1,
      };
      if (editingItem) {
        await vesselApi.edit({ id: editingItem.id, ...payload });
        toast.success('Vessel updated successfully');
      } else {
        await vesselApi.add(payload);
        toast.success('Vessel added successfully');
      }
      setIsModalOpen(false);
      await loadVessels();
    } catch (error) {
      console.error('Failed to save vessel:', error);
      toast.error('Failed to save vessel');
    }
  };

  const columns: Column<VesselResponseDTO>[] = [
    { key: 'vesselName', header: 'Vessel Name' },
    { key: 'internationalNumber', header: 'International Number' },
    { key: 'callSign', header: 'Call Sign' },
    { key: 'length', header: 'Length (m)', render: (item) => `${item.length} m` },
    { key: 'grossTonnage', header: 'Gross Tonnage', render: (item) => item.grossTonnage.toFixed(2) },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role) && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role) && <Button size="small" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role) && (
        <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', color: '#0369a1' }}>
          You have view-only access to this page.
        </div>
      )}
      <Card
        title="Vessels"
        subtitle="Manage fishing vessel registry"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Vessel</Button> : undefined}
      >
        <Table columns={columns} data={vessels} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Vessel' : 'Add Vessel'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Vessel Name" value={formData.vesselName} onChange={(e) => setFormData({ ...formData, vesselName: e.target.value })} required fullWidth />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="International Number" value={formData.internationalNumber} onChange={(e) => setFormData({ ...formData, internationalNumber: e.target.value })} required fullWidth />
              <Input label="Call Sign" value={formData.callSign} onChange={(e) => setFormData({ ...formData, callSign: e.target.value })} required fullWidth />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <Input label="Length (m)" type="number" step="0.01" value={formData.length} onChange={(e) => setFormData({ ...formData, length: e.target.value })} fullWidth />
              <Input label="Width (m)" type="number" step="0.01" value={formData.width} onChange={(e) => setFormData({ ...formData, width: e.target.value })} fullWidth />
              <Input label="Gross Tonnage" type="number" step="0.01" value={formData.grossTonnage} onChange={(e) => setFormData({ ...formData, grossTonnage: e.target.value })} fullWidth />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <Input label="Engine Power (kW)" type="number" step="0.01" value={formData.enginePower} onChange={(e) => setFormData({ ...formData, enginePower: e.target.value })} fullWidth />
              <Input label="Engine Type ID" type="number" value={formData.engineTypeId} onChange={(e) => setFormData({ ...formData, engineTypeId: e.target.value })} placeholder="1" fullWidth />
              <Input label="Owner ID" type="number" value={formData.ownerId} onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })} placeholder="1" fullWidth />
            </div>
            <Input label="Captain ID" type="number" value={formData.captainId} onChange={(e) => setFormData({ ...formData, captainId: e.target.value })} placeholder="1" fullWidth />
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
