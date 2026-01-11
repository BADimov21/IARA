import React, { useEffect, useState } from 'react';
import { reportsApi } from '../../../api/reports.api';
import type { VesselStatistics } from '../../../api/reports.api';
import { useToast, Card, Loading } from '../../shared';
import './VesselStatisticsReport.css';

export const VesselStatisticsReport: React.FC = () => {
  const [vessels, setVessels] = useState<VesselStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(2025);
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, [year]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getVesselStatistics(year);
      setVessels(data);
    } catch (error) {
      toast.error('Failed to load vessel statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="vessel-statistics-report">
      <div className="report-header">
        <h1>📊 Vessel Statistics Report</h1>
        <p className="report-description">
          Comprehensive statistics on fishing vessel performance including trip duration and catch data.
        </p>
        <div className="year-selector">
          <label>Select Year: </label>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>
      </div>

      {vessels.length === 0 ? (
        <div className="no-data">
          <p>No fishing trip data available for {year}.</p>
        </div>
      ) : (
        <div className="report-content">
          <div className="stats-grid">
            <Card title="Total Vessels" subtitle="">
              <p className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6', textAlign: 'center', margin: '1rem 0' }}>{vessels.length}</p>
            </Card>
            <Card title="Total Trips" subtitle="">
              <p className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', textAlign: 'center', margin: '1rem 0' }}>{vessels.reduce((sum, v) => sum + v.totalTrips, 0)}</p>
            </Card>
            <Card title="Total Catch" subtitle="">
              <p className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b', textAlign: 'center', margin: '1rem 0' }}>{vessels.reduce((sum, v) => sum + v.totalCatchWeightKg, 0).toFixed(0)} kg</p>
            </Card>
          </div>

          <Card title="Vessel Performance Rankings" subtitle={`Detailed statistics for ${year}`}>
            <table className="report-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Vessel Name</th>
                <th>International #</th>
                <th>Total Trips</th>
                <th>Avg Trip (hrs)</th>
                <th>Min/Max Trip (hrs)</th>
                <th>Avg Catch (kg)</th>
                <th>Total Catch (kg)</th>
              </tr>
            </thead>
            <tbody>
              {vessels.map((vessel) => (
                <tr key={vessel.vesselId} className={vessel.rank <= 3 ? `top-${vessel.rank}` : ''}>
                  <td className="rank-cell">#{vessel.rank}</td>
                  <td className="vessel-name">{vessel.vesselName}</td>
                  <td>{vessel.internationalNumber}</td>
                  <td>{vessel.totalTrips}</td>
                  <td>{vessel.averageTripDuration?.toFixed(1) || 'N/A'}</td>
                  <td>
                    {vessel.minTripDuration?.toFixed(1) || 'N/A'} / {vessel.maxTripDuration?.toFixed(1) || 'N/A'}
                  </td>
                  <td>{vessel.averageCatchPerTrip?.toFixed(1) || 'N/A'}</td>
                  <td className="total-catch">{vessel.totalCatchWeightKg.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </Card>
        </div>
      )}
    </div>
  );
};
