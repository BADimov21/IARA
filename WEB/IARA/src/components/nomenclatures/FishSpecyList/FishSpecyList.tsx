/**
 * FishSpecyList Component
 * Displays list of fish species
 */

import React, { useState, useEffect } from 'react';
import { fishSpecyApi } from '../../../shared/api';
import { Table, Button, Card, Loading, Modal } from '../../shared';
import { useToast } from '../../shared/Toast';
import { FishSpecyForm } from '../FishSpecyForm';
import type { Column } from '../../shared/Table/Table';

interface FishSpecy {
  id: number;
  speciesName: string;
  latinName?: string;
  code?: string;
}

export const FishSpecyList: React.FC = () => {
  const toast = useToast();
  const [fishSpecies, setFishSpecies] = useState<FishSpecy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FishSpecy | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await fishSpecyApi.getAll({ page, pageSize });
      if (response && Array.isArray(response)) {
        setFishSpecies(response);
        setTotal(response.length);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load fish species');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this fish species?')) {
      return;
    }

    try {
      await fishSpecyApi.delete(id);
      toast.success('Fish species deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete fish species');
    }
  };

  const handleEdit = (item: FishSpecy) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleSaveSuccess = () => {
    setShowModal(false);
    setEditingItem(null);
    loadData();
  };

  const columns: Column<FishSpecy>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '80px',
    },
    {
      key: 'speciesName',
      header: 'Species Name',
      sortable: true,
    },
    {
      key: 'latinName',
      header: 'Latin Name',
      sortable: true,
      render: (item) => item.latinName || '-',
    },
    {
      key: 'code',
      header: 'Code',
      width: '100px',
      render: (item) => item.code || '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '180px',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="small" variant="primary" onClick={() => handleEdit(item)}>
            Edit
          </Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(item.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loading text="Loading fish species..." />;
  }

  return (
    <div>
      <Card
        title="Fish Species"
        subtitle="Manage fish species nomenclature"
        actions={<Button variant="primary" onClick={handleAdd}>Add Fish Species</Button>}
      >
        <Table
          columns={columns}
          data={fishSpecies.slice((page - 1) * pageSize, page * pageSize)}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Card>

      {showModal && (
        <Modal
          title={editingItem ? 'Edit Fish Species' : 'Add Fish Species'}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          size="medium"
        >
          <FishSpecyForm
            initialData={editingItem || undefined}
            onSuccess={handleSaveSuccess}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};
