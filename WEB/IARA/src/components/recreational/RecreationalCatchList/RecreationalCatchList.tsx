import React, { useState, useEffect } from 'react';
import { recreationalCatchApi, ticketPurchaseApi, fishSpecyApi, personApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Select, Loading, Card, ConfirmDialog, useToast } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { RecreationalCatchFilter, BaseFilter } from '../../../shared/types';

interface RecreationalCatchItem {
  id: number;
  ticketPurchaseId?: number;
  speciesId?: number;
  species?: { id: number; name: string };
  quantity?: number;
  weightKg?: number;
  catchDateTime?: string;
  location?: string;
  person?: { id: number; fullName: string; egn: string };
}

export const RecreationalCatchList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [catches, setCatches] = useState<RecreationalCatchItem[]>([]);
  const [fishSpecies, setFishSpecies] = useState<Array<{ id: number; name: string }>>([]);
  const [tickets, setTickets] = useState<Array<{ id: number; typeName: string; validFrom: string; validTo: string }>>([]);
  const [userPersonId, setUserPersonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecreationalCatchItem | null>(null);
  const [formData, setFormData] = useState({
    ticketPurchaseId: '',
    fishSpecyId: '',
    quantity: '',
    weightKg: '',
    catchDate: '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadCatches(),
      loadFishSpecies(),
      loadUserTickets(),
      loadUserPersonInfo(),
    ]);
  };

  const loadFishSpecies = async () => {
    try {
      const data = await fishSpecyApi.getAll({ page: 1, pageSize: 100, filters: {} });
      console.log('Loaded fish species:', data);
      setFishSpecies((data || []).map((f: any) => ({
        id: f.id,
        name: f.speciesName
      })));
    } catch (error) {
      console.error('Failed to load fish species:', error);
    }
  };

  const loadUserTickets = async () => {
    try {
      const data = await ticketPurchaseApi.getAll({ page: 1, pageSize: 100, filters: {} });
      // Filter only valid tickets
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const validTickets = (data || []).filter((t: any) => {
        const validFrom = new Date(t.validFrom);
        const validUntil = new Date(t.validUntil);
        validFrom.setHours(0, 0, 0, 0);
        validUntil.setHours(0, 0, 0, 0);
        return validFrom <= today && validUntil >= today;
      });
      console.log('Valid tickets:', validTickets);
      setTickets(validTickets.map((t: any) => ({
        id: t.id,
        typeName: t.ticketType?.name || 'Unknown',
        validFrom: t.validFrom,
        validTo: t.validUntil
      })));
    } catch (error) {
      console.error('Failed to load tickets:', error);
    }
  };

  const loadUserPersonInfo = async () => {
    try {
      const response = await personApi.hasCompletedPersonalInfo();
      if (response.hasCompleted && response.personId) {
        setUserPersonId(response.personId);
      }
    } catch (error) {
      console.error('Failed to load user person info:', error);
    }
  };

  const loadCatches = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<RecreationalCatchFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await recreationalCatchApi.getAll(filters);
      setCatches(data);
    } catch (error) {
      console.error('Failed to load recreational catches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canCreate(role, 'recreationalCatches')) return;
    if (!userPersonId) {
      toast.error('Please complete your personal information first');
      return;
    }
    if (tickets.length === 0) {
      toast.error('You need to purchase a valid fishing ticket first');
      return;
    }
    setEditingItem(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({ ticketPurchaseId: '', fishSpecyId: '', quantity: '1', weightKg: '', catchDate: today });
    setIsModalOpen(true);
  };

  const handleEdit = (item: RecreationalCatchItem) => {
    if (!canEdit(role, 'recreationalCatches')) return;
    setEditingItem(item);
    setFormData({
      ticketPurchaseId: item.ticketPurchaseId?.toString() || '',
      fishSpecyId: item.speciesId?.toString() || '',
      quantity: item.quantity?.toString() || '',
      weightKg: item.weightKg?.toString() || '',
      catchDate: item.catchDateTime ? item.catchDateTime.split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role, 'recreationalCatches')) return;
    
    const confirmed = await confirm({
      title: 'Delete Recreational Catch',
      message: 'Are you sure you want to delete this catch record? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await recreationalCatchApi.delete(Number(id));
      toast.success('Catch deleted successfully');
      await loadCatches();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete catch');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'recreationalCatches')) return;
    try {
      const payload = {
        ticketPurchaseId: Number(formData.ticketPurchaseId),
        personId: userPersonId || 0,
        speciesId: Number(formData.fishSpecyId),
        quantity: formData.quantity ? parseInt(formData.quantity) : 1,
        weightKg: formData.weightKg ? parseFloat(formData.weightKg) : 0.01,
        catchDateTime: formData.catchDate ? new Date(formData.catchDate).toISOString() : new Date().toISOString(),
      };
      console.log('Sending catch payload:', payload);
      if (editingItem) {
        await recreationalCatchApi.edit({ ...payload, id: editingItem.id });
        toast.success('Catch updated successfully');
      } else {
        await recreationalCatchApi.add(payload);
        toast.success('Catch added successfully');
      }
      setIsModalOpen(false);
      await loadCatches();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save catch');
    }
  };

  const columns: Column<RecreationalCatchItem>[] = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'catchDateTime', header: 'Date', render: (item) => item.catchDateTime ? new Date(item.catchDateTime).toLocaleDateString() : '-' },
    { key: 'species', header: 'Fish Species', render: (item) => item.species?.name || '-' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'weightKg', header: 'Weight (kg)', render: (item) => item.weightKg ? `${item.weightKg} kg` : '-' },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'recreationalCatches') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'recreationalCatches') && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'recreationalCatches') && (
        <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', color: '#0369a1' }}>
          You have view-only access to this page.
        </div>
      )}
      <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '0.5rem', borderLeft: '4px solid rgb(34, 197, 94)' }}>
        <strong>🐟 Catch Recording</strong>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
          Record your catches here to help monitor fish populations and maintain sustainable fishing. 
          You must have a valid fishing ticket to record catches.
        </p>
      </div>
      <Card
        title={role === 'Admin' ? 'All Recreational Catches' : 'My Fishing Catches'}
        subtitle="Record and track your recreational fishing catches"
        actions={canCreate(role, 'recreationalCatches') ? <Button variant="primary" onClick={handleAdd}>📝 Record New Catch</Button> : undefined}
      >
        <Table columns={columns} data={catches} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Catch' : 'Record Your Catch'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#0369a1' }}>
              <strong>ℹ️ Recording Your Catch:</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>Please record your catch immediately after fishing. Select the ticket you used, the species you caught, and the quantity. This helps maintain sustainable fishing practices.</p>
            </div>
            
            <Select 
              label="Fishing Ticket" 
              value={formData.ticketPurchaseId} 
              onChange={(e) => setFormData({ ...formData, ticketPurchaseId: e.target.value })} 
              options={tickets.map(t => ({ 
                value: t.id.toString(), 
                label: `${t.typeName || 'Ticket #' + t.id} (Valid: ${new Date(t.validFrom).toLocaleDateString()} - ${new Date(t.validTo).toLocaleDateString()})` 
              }))}
              helperText="Select which ticket you used for this fishing trip"
              required 
              fullWidth 
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
              <Select 
                label="Fish Species" 
                value={formData.fishSpecyId} 
                onChange={(e) => setFormData({ ...formData, fishSpecyId: e.target.value })} 
                options={fishSpecies.map(f => ({ 
                  value: f.id.toString(), 
                  label: f.name 
                }))}
                helperText="What type of fish did you catch?"
                required 
                fullWidth 
              />
              <Input 
                label="Quantity" 
                type="number" 
                min="1"
                value={formData.quantity} 
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} 
                helperText="Number caught"
                required 
                fullWidth 
              />
              <Input 
                label="Weight (kg)" 
                type="number" 
                min="0.01"
                step="0.01"
                value={formData.weightKg} 
                onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })} 
                helperText="Total weight"
                required 
                fullWidth 
              />
            </div>
            
            <Input 
              label="Catch Date" 
              type="date" 
              max={new Date().toISOString().split('T')[0]}
              value={formData.catchDate} 
              onChange={(e) => setFormData({ ...formData, catchDate: e.target.value })} 
              helperText="When did you catch these fish?"
              required 
              fullWidth 
            />
            
            {formData.fishSpecyId && formData.quantity && (
              <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#166534' }}>
                <strong>✓ Catch Summary:</strong>
                <p style={{ margin: '0.5rem 0 0 0' }}>
                  Recording {formData.quantity} {fishSpecies.find(f => f.id.toString() === formData.fishSpecyId)?.name || 'fish'} {formData.weightKg ? `(${formData.weightKg} kg total)` : ''} caught on {formData.catchDate ? new Date(formData.catchDate).toLocaleDateString() : '(select date)'}.
                </p>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">{editingItem ? 'Update' : 'Record Catch'}</Button>
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
