import React, { useState, useEffect } from 'react';
import { ticketTypeApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast } from '../../shared';
import { useAuth } from '../../../shared/hooks/useAuth';
import { canCreate, canEdit, canDelete } from '../../../shared/utils/permissions';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { TicketTypeFilter, BaseFilter } from '../../../shared/types';

interface TicketTypeItem {
  id: number;
  typeName: string;
  validityDays: number;
  priceUnder14: number;
  priceAdult: number;
  pricePensioner: number;
  isFreeForDisabled: boolean;
}

export const TicketTypeList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const [items, setItems] = useState<TicketTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TicketTypeItem | null>(null);
  const [formData, setFormData] = useState({ 
    typeName: '', 
    validityDays: '', 
    priceUnder14: '', 
    priceAdult: '', 
    pricePensioner: '',
    isFreeForDisabled: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<TicketTypeFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await ticketTypeApi.getAll(filters);
      setItems(data);
    } catch (error) {
      console.error('Failed to load ticket types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canCreate(role, 'ticketTypes')) return;
    setEditingItem(null);
    setFormData({ 
      typeName: '', 
      validityDays: '', 
      priceUnder14: '', 
      priceAdult: '', 
      pricePensioner: '',
      isFreeForDisabled: false
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: TicketTypeItem) => {
    if (!canEdit(role, 'ticketTypes')) return;
    setEditingItem(item);
    setFormData({
      typeName: item.typeName || '',
      validityDays: item.validityDays?.toString() || '',
      priceUnder14: item.priceUnder14?.toString() || '',
      priceAdult: item.priceAdult?.toString() || '',
      pricePensioner: item.pricePensioner?.toString() || '',
      isFreeForDisabled: item.isFreeForDisabled || false
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!canDelete(role, 'ticketTypes')) return;
    
    const confirmed = await confirm({
      title: 'Delete Ticket Type',
      message: 'Are you sure you want to delete this ticket type? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await ticketTypeApi.delete(id);
      toast.success('Ticket type deleted successfully');
      await loadData();
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete ticket type');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role, 'ticketTypes')) return;
    try {
      const payload = {
        typeName: formData.typeName,
        validityDays: formData.validityDays ? parseInt(formData.validityDays) : 1,
        priceUnder14: formData.priceUnder14 ? parseFloat(formData.priceUnder14) : 0,
        priceAdult: formData.priceAdult ? parseFloat(formData.priceAdult) : 0,
        pricePensioner: formData.pricePensioner ? parseFloat(formData.pricePensioner) : 0,
        isFreeForDisabled: formData.isFreeForDisabled
      };
      if (editingItem) {
        await ticketTypeApi.edit({ id: editingItem.id, ...payload });
        toast.success('Ticket type updated successfully');
      } else {
        await ticketTypeApi.add(payload);
        toast.success('Ticket type added successfully');
      }
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save ticket type');
    }
  };

  const columns: Column<TicketTypeItem>[] = [
    { key: 'typeName', header: 'Type Name' },
    { key: 'validityDays', header: 'Validity', render: (item) => `${item.validityDays} days` },
    { key: 'priceAdult', header: 'Adult Price', render: (item) => `${item.priceAdult} BGN` },
    { key: 'priceUnder14', header: 'Under 14', render: (item) => `${item.priceUnder14} BGN` },
    { key: 'pricePensioner', header: 'Pensioner', render: (item) => `${item.pricePensioner} BGN` },
    { key: 'isFreeForDisabled', header: 'Free for Disabled', render: (item) => item.isFreeForDisabled ? '✓ Yes' : '✗ No' },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role, 'ticketTypes') && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role, 'ticketTypes') && <Button size="small" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>}
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      {!canEdit(role, 'ticketTypes') && (
        <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '0.5rem', color: '#0369a1' }}>
          You have view-only access to this page.
        </div>
      )}
      <Card
        title="Ticket Types"
        subtitle="Manage recreational fishing ticket types"
        actions={canCreate(role, 'ticketTypes') ? <Button variant="primary" onClick={handleAdd}>+ Add Ticket Type</Button> : undefined}
      >
        <Table columns={columns} data={items} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Ticket Type' : 'Add Ticket Type'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#4338ca' }}>
              <strong>ℹ️ Ticket Type Configuration:</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>Configure pricing for different age groups. Set the validity period and specify if the ticket is free for disabled persons.</p>
            </div>
            
            <Input 
              label="Ticket Type Name" 
              value={formData.typeName} 
              onChange={(e) => setFormData({ ...formData, typeName: e.target.value })} 
              placeholder="e.g., Daily, Weekly, Monthly"
              helperText="Name of the ticket type"
              required 
              fullWidth 
            />
            
            <Input 
              label="Validity Period (days)" 
              type="number" 
              min="1"
              value={formData.validityDays} 
              onChange={(e) => setFormData({ ...formData, validityDays: e.target.value })} 
              helperText="Number of days the ticket is valid"
              required 
              fullWidth 
            />
            
            <div style={{ padding: '1rem', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
              <strong style={{ display: 'block', marginBottom: '1rem', color: '#0369a1' }}>💰 Pricing by Age Group</strong>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <Input 
                  label="Adult Price (BGN)" 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={formData.priceAdult} 
                  onChange={(e) => setFormData({ ...formData, priceAdult: e.target.value })} 
                  helperText="Standard adult price"
                  required 
                  fullWidth 
                />
                <Input 
                  label="Under 14 Price (BGN)" 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={formData.priceUnder14} 
                  onChange={(e) => setFormData({ ...formData, priceUnder14: e.target.value })} 
                  helperText="Price for under 14"
                  required 
                  fullWidth 
                />
                <Input 
                  label="Pensioner Price (BGN)" 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={formData.pricePensioner} 
                  onChange={(e) => setFormData({ ...formData, pricePensioner: e.target.value })} 
                  helperText="Price for pensioners"
                  required 
                  fullWidth 
                />
              </div>
            </div>
            
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={formData.isFreeForDisabled}
                  onChange={(e) => setFormData({ ...formData, isFreeForDisabled: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '500', color: '#166534' }}>♿ Free for Disabled Persons</span>
              </label>
              <p style={{ margin: '0.5rem 0 0 2.5rem', fontSize: '0.85rem', color: '#15803d' }}>
                Enable this to make this ticket type free for persons with disabilities
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">{editingItem ? 'Update Ticket Type' : 'Create Ticket Type'}</Button>
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
