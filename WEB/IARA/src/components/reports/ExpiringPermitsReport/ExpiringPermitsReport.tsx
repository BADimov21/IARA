import React, { useEffect, useState } from 'react';
import { reportsApi } from '../../../shared/api/reports.api';
import type { VesselExpiringPermit } from '../../../shared/api/reports.api';
import { useToast } from '../../shared/Toast';
import './ExpiringPermitsReport.css';

export const ExpiringPermitsReport: React.FC = () => {
  const [vessels, setVessels] = useState<VesselExpiringPermit[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getExpiringPermits();
      setVessels(data);
    } catch (error) {
      showToast('error', 'Failed to load report');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading report...</div>;

  return (
    <div className="expiring-permits-report">
      <div className="report-header">
        <h1>📋 Vessels with Expiring Permits</h1>
        <p className="report-description">
          This report shows all fishing vessels with permits expiring within the next month.
        </p>
      </div>

      {vessels.length === 0 ? (
        <div className="no-data">
          <p>✅ No vessels have permits expiring in the next month.</p>
        </div>
      ) : (
        <div className="report-content">
          <div className="summary-card">
            <h3>Summary</h3>
            <p><strong>{vessels.length}</strong> vessel{vessels.length !== 1 ? 's' : ''} with expiring permits</p>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Vessel Name</th>
                <th>International Number</th>
                <th>Owner</th>
                <th>Permit Number</th>
                <th>Expiration Date</th>
                <th>Days Remaining</th>
              </tr>
            </thead>
            <tbody>
              {vessels.map((vessel) => (
                <tr key={vessel.vesselId} className={vessel.daysUntilExpiration <= 7 ? 'urgent' : ''}>
                  <td>{vessel.vesselName}</td>
                  <td>{vessel.internationalNumber}</td>
                  <td>{vessel.ownerName}</td>
                  <td>{vessel.permitNumber}</td>
                  <td>{new Date(vessel.validUntil).toLocaleDateString()}</td>
                  <td className="days-remaining">
                    <span className={`badge ${vessel.daysUntilExpiration <= 7 ? 'urgent' : 'warning'}`}>
                      {vessel.daysUntilExpiration} {vessel.daysUntilExpiration === 1 ? 'day' : 'days'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
