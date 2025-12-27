/**
 * FishingTripList Component
 * Displays list of fishing trips
 */

import React, { useState, useEffect } from 'react';
import { fishingTripApi } from '../../../shared/api';
import { Table, Button, Card, Loading } from '../../shared';
import { useToast } from '../../shared/Toast';
import type { Column } from '../../shared/Table/Table';

interface FishingTrip {
  id: number;
  vesselId?: number;
  startDate?: string;
  endDate?: string;
  isCompleted?: boolean;
}

export const FishingTripList: React.FC = () => {
  const toast = useToast();
  const [trips, setTrips] = useState<FishingTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [total, setTotal] = useState(0);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await fishingTripApi.getAll({ page, pageSize });
      if (response && Array.isArray(response)) {
        setTrips(response);
        setTotal(response.length);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load fishing trips');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleComplete = async (id: number) => {
    try {
      await fishingTripApi.complete({
        id: id,
        arrivalDateTime: new Date().toISOString(),
        arrivalPort: 'Default Port',
      });
      toast.success('Fishing trip completed successfully');
      loadData();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to complete fishing trip');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const columns: Column<FishingTrip>[] = [
    {
      key: 'id',
      header: 'Trip ID',
      width: '80px',
    },
    {
      key: 'vesselId',
      header: 'Vessel ID',
      width: '100px',
    },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (trip) => formatDate(trip.startDate),
      sortable: true,
    },
    {
      key: 'endDate',
      header: 'End Date',
      render: (trip) => formatDate(trip.endDate),
    },
    {
      key: 'status',
      header: 'Status',
      render: (trip) => (
        <span className={`status-badge ${trip.isCompleted ? 'completed' : 'active'}`}>
          {trip.isCompleted ? 'Completed' : 'Active'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '200px',
      render: (trip) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {!trip.isCompleted && (
            <Button
              size="small"
              variant="success"
              onClick={() => handleComplete(trip.id)}
            >
              Complete
            </Button>
          )}
          <Button
            size="small"
            variant="primary"
            onClick={() => window.location.href = `/fishing/trips/${trip.id}`}
          >
            Details
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loading text="Loading fishing trips..." />;
  }

  return (
    <Card
      title="Fishing Trips"
      subtitle="Manage fishing trip records"
      actions={
        <Button variant="primary" onClick={() => window.location.href = '/fishing/trips/new'}>
          Create New Trip
        </Button>
      }
    >
      <Table
        columns={columns}
        data={trips.slice((page - 1) * pageSize, page * pageSize)}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Card>
  );
};
