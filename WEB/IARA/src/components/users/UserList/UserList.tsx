import React, { useState, useEffect } from 'react';
import { userApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card, ConfirmDialog, useToast, FilterPanel } from '../../shared';
import { useAuth, isAdmin } from '../../../shared/hooks/useAuth';
import { useConfirm } from '../../../shared/hooks/useConfirm';
import type { Column } from '../../shared/Table/Table';
import type { UserResponseDTO, UserFilter, BaseFilter } from '../../../shared/types';
import type { FilterField } from '../../shared/FilterPanel/FilterPanel';

export const UserList: React.FC = () => {
  const { role } = useAuth();
  const toast = useToast();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserResponseDTO | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    password: '',
  });

  const filterFields: FilterField[] = [
    { name: 'id', label: 'ID', type: 'number', placeholder: 'Search by ID' },
    { name: 'username', label: 'Username', type: 'text', placeholder: 'Search username' },
    { name: 'email', label: 'Email', type: 'text', placeholder: 'Search email' },
    { name: 'userType', label: 'Role', type: 'text', placeholder: 'Search role' },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (customFilters?: UserFilter) => {
    try {
      setLoading(true);
      const filters: BaseFilter<UserFilter> = { page: 1, pageSize: 100, filters: customFilters || {} };
      const data = await userApi.getAll(filters);
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filters: UserFilter = {};
    Object.keys(filterValues).forEach((key) => {
      const value = filterValues[key];
      if (value !== '' && value !== null && value !== undefined) {
        if (key === 'id') {
          filters[key] = Number(value);
        } else {
          filters[key as keyof UserFilter] = value as any;
        }
      }
    });
    loadUsers(filters);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    loadUsers({});
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ username: '', email: '', role: 'User', password: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: UserResponseDTO) => {
    setEditingItem(item);
    setFormData({
      username: item.username || '',
      email: item.email || '',
      role: item.userType || 'User',
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Ban User',
      message: 'Are you sure you want to ban this user? They will no longer be able to log in.',
      confirmText: 'Ban User',
      variant: 'danger',
    });
    
    if (!confirmed) return;

    try {
      await userApi.delete(id);
      toast.success('User banned successfully');
      await loadUsers();
    } catch (error) {
      console.error('Failed to ban user:', error);
      toast.error('Failed to ban user');
    }
  };

  const handleUnban = async (id: string) => {
    const confirmed = await confirm({
      title: 'Unban User',
      message: 'Are you sure you want to unban this user? They will be able to log in again.',
      confirmText: 'Unban User',
      variant: 'primary',
    });
    
    if (!confirmed) return;

    try {
      await userApi.unban(id);
      toast.success('User unbanned successfully');
      await loadUsers();
    } catch (error) {
      console.error('Failed to unban user:', error);
      toast.error('Failed to unban user');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement when API endpoints are available
      console.log('User save would be submitted:', formData);
      toast.warning('User management API not yet implemented');
      setIsModalOpen(false);
      await loadUsers();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save user');
    }
  };

  const columns: Column<UserResponseDTO>[] = [
    { key: 'userId', header: 'ID', width: '80px' },
    { key: 'username', header: 'Username' },
    { key: 'email', header: 'Email' },
    { key: 'userType', header: 'Role' },
    {
      key: 'isActive',
      header: 'Status',
      width: '100px',
      render: (item) => (
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          background: item.isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: item.isActive ? '#15803d' : '#dc2626',
          border: item.isActive ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          {item.isActive ? 'Active' : 'Banned'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => {
        const isAdminUser = item.userType === 'Admin';
        const isBanned = !item.isActive;
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button 
              size="small" 
              variant="primary" 
              onClick={() => handleEdit(item)}
              disabled={isAdminUser}
              title={isAdminUser ? 'Admin users cannot be edited' : ''}
            >
              Edit
            </Button>
            {isBanned ? (
              <Button 
                size="small" 
                variant="success" 
                onClick={() => handleUnban(item.userId)}
                disabled={isAdminUser}
                title={isAdminUser ? 'Admin users cannot be unbanned' : ''}
              >
                Unban
              </Button>
            ) : (
              <Button 
                size="small" 
                variant="danger" 
                onClick={() => handleDelete(item.userId)}
                disabled={isAdminUser}
                title={isAdminUser ? 'Admin users cannot be banned' : ''}
              >
                Ban
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(220, 38, 38, 0.1)', borderRadius: '0.5rem', color: '#991b1b', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
        ⚠️ Admin Only - User Management
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
        title="Users"
        subtitle="Manage system users (Admin Only)"
        actions={<Button variant="primary" onClick={handleAdd}>+ Add User</Button>}
      >
        <Table columns={columns} data={users} />
      </Card>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit User' : 'Add User'} size="large">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input label="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required fullWidth />
              <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required fullWidth />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Role</label>
                <select 
                  value={formData.role} 
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                  required
                >
                  <option value="User">User (Fisherman)</option>
                  <option value="Inspector">Inspector</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <Input 
                label={editingItem ? "New Password (leave blank to keep current)" : "Password"} 
                type="password" 
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                required={!editingItem}
                fullWidth 
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
