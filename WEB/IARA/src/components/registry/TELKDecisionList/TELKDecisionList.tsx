import React, { useState, useEffect } from 'react';
import { telkDecisionApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card } from '../../shared';
import { useAuth, canEdit, canDelete } from '../../../shared/hooks/useAuth';
import type { Column } from '../../shared/Table/Table';
import type { TELKDecisionFilter, BaseFilter } from '../../../shared/types';

interface TELKDecisionItem {
  id: number;
  decisionNumber?: string;
  decisionDate?: string;
  subject?: string;
  description?: string;
}

export const TELKDecisionList: React.FC = () => {
  const { role } = useAuth();
  const [decisions, setDecisions] = useState<TELKDecisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TELKDecisionItem | null>(null);
  const [formData, setFormData] = useState({
    decisionNumber: '',
    decisionDate: '',
    subject: '',
    description: '',
  });

  useEffect(() => {
    loadDecisions();
  }, []);

  const loadDecisions = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<TELKDecisionFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await telkDecisionApi.getAll(filters);
      setDecisions(data);
    } catch (error) {
      console.error('Failed to load TELK decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canEdit(role)) return;
    setEditingItem(null);
    setFormData({ decisionNumber: '', decisionDate: '', subject: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: TELKDecisionItem) => {
    if (!canEdit(role)) return;
    setEditingItem(item);
    setFormData({
      decisionNumber: item.decisionNumber || '',
      decisionDate: item.decisionDate ? item.decisionDate.split('T')[0] : '',
      subject: item.subject || '',
      description: item.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDelete(role)) return;
    if (!confirm('Are you sure?')) return;
    try {
      await telkDecisionApi.delete(Number(id));
      await loadDecisions();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit(role)) return;
    try {
      const payload = {
        decisionNumber: formData.decisionNumber,
        subject: formData.subject,
        description: formData.description,
        personId: 1,
        issueDate: formData.decisionDate ? new Date(formData.decisionDate).toISOString() : '',
      };
      if (editingItem) {
        await telkDecisionApi.edit({ id: editingItem.id, ...payload });
      } else {
        await telkDecisionApi.add(payload);
      }
      setIsModalOpen(false);
      await loadDecisions();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const columns: Column<TELKDecisionItem>[] = [
    { key: 'decisionNumber', header: 'Decision Number' },
    { key: 'decisionDate', header: 'Date', render: (item) => item.decisionDate ? new Date(item.decisionDate).toLocaleDateString() : '-' },
    { key: 'subject', header: 'Subject' },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canEdit(role) && <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>}
          {canDelete(role) && <Button size="small" variant="danger" onClick={() => handleDelete(String(item.id))}>Delete</Button>}
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
        title="TELK Decisions"
        subtitle="Manage regulatory committee decisions"
        actions={canEdit(role) ? <Button variant="primary" onClick={handleAdd}>+ Add Decision</Button> : undefined}
      >
        <Table columns={columns} data={decisions} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Decision' : 'Add Decision'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Decision Number" value={formData.decisionNumber} onChange={(e) => setFormData({ ...formData, decisionNumber: e.target.value })} required fullWidth />
              <Input label="Decision Date" type="date" value={formData.decisionDate} onChange={(e) => setFormData({ ...formData, decisionDate: e.target.value })} required fullWidth />
            </div>
            <Input label="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required fullWidth />
            <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required fullWidth />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">{editingItem ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
