import React, { useState, useEffect } from 'react';
import { userApi } from '../../../shared/api';
import { Button, Table, Modal, Input, Loading, Card } from '../../shared';
import { useAuth, isAdmin } from '../../../shared/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import type { Column } from '../../shared/Table/Table';
import type { UserResponseDTO, UserFilter, BaseFilter } from '../../../shared/types';

export const UserList: React.FC = () => {
  const { role } = useAuth();
  
  // Redirect non-admin users
  if (!isAdmin(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserResponseDTO | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    password: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const filters: BaseFilter<UserFilter> = { page: 1, pageSize: 100, filters: {} };
      const data = await userApi.getAll(filters);
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
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
    if (!confirm('Are you sure?')) return;
    try {
      await userApi.delete(id);
      await loadUsers();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement when API endpoints are available
      console.log('User save would be submitted:', formData);
      alert('User management API not yet implemented');
      setIsModalOpen(false);
      await loadUsers();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const columns: Column<UserResponseDTO>[] = [
    { key: 'username', header: 'Username' },
    { key: 'email', header: 'Email' },
    { key: 'userType', header: 'Role' },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="small" variant="primary" onClick={() => handleEdit(item)}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(item.userId)}>Delete</Button>
        </div>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div>
      <div className="role-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(220, 38, 38, 0.1)', borderRadius: '0.5rem', color: '#991b1b', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
        ⚠️ Admin Only - User Management
      </div>
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
                  <option value="User">User</option>
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
    </div>
  );
};
