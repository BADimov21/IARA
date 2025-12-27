/**
 * UserList Component
 * Displays list of users with management actions
 */

import React, { useState, useEffect } from 'react';
import { userApi } from '../../../shared/api';
import { Table, Button, Card, Loading } from '../../shared';
import { useToast } from '../../shared/Toast';
import type { Column } from '../../shared/Table/Table';
import './UserList.css';

interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  isActive?: boolean;
}

export const UserList: React.FC = () => {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [total, setTotal] = useState(0);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.getAll({ page, pageSize });
      if (response && Array.isArray(response)) {
        setUsers(response);
        setTotal(response.length);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await userApi.delete(id);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete user');
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '80px',
    },
    {
      key: 'username',
      header: 'Username',
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
    },
    {
      key: 'role',
      header: 'Role',
      render: (user) => user.role || 'User',
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (user) => (
        <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '150px',
      render: (user) => (
        <div className="user-actions">
          <Button
            size="small"
            variant="danger"
            onClick={() => handleDelete(user.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loading text="Loading users..." />;
  }

  return (
    <div className="user-list-container">
      <Card
        title="Users"
        subtitle="Manage system users"
        actions={
          <Button variant="primary" onClick={() => window.location.href = '/users/new'}>
            Add User
          </Button>
        }
      >
        <Table
          columns={columns}
          data={users.slice((page - 1) * pageSize, page * pageSize)}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Card>
    </div>
  );
};
