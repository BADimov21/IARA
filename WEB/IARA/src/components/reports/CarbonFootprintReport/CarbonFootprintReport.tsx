import React, { useEffect, useState } from 'react';
import { reportsApi } from '../../../api/reports.api';
import type { VesselCarbonFootprint } from '../../../api/reports.api';
import { useToast } from '../../shared/Toast';
import './CarbonFootprintReport.css';

export const CarbonFootprintReport: React.FC = () => {
  const [vessels, setVessels] = useState<VesselCarbonFootprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(2025);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, [year]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getCarbonFootprint(year);
      setVessels(data);
    } catch (error) {
      showToast('error', 'Failed to load report');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getEfficiencyClass = (footprint: number) => {
    if (footprint < 1.0) return 'excellent';
    if (footprint < 2.0) return 'good';
    if (footprint < 3.0) return 'average';
    return 'poor';
  };

  if (loading) return <div className="loading">Loading report...</div>;

  return (
    <div className="carbon-footprint-report">
      <div className="report-header">
        <h1>🌍 Carbon Footprint Report</h1>
        <p className="report-description">
          Fuel efficiency analysis: liters of fuel consumed per kilogram of fish caught.
          Lower values indicate better efficiency.
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
          <p>No data available for vessels with active permits in {year}.</p>
        </div>
      ) : (
        <div className="report-content">
          <div className="info-box">
            <h3>📌 About This Report</h3>
            <p>
              This report calculates the carbon footprint by dividing total fuel consumed by total fish caught.
              Only vessels with currently active permits are included. Lower numbers indicate more sustainable fishing practices.
            </p>
          </div>

          <div className="efficiency-legend">
            <div className="legend-item excellent">
              <span className="dot"></span> Excellent (&lt; 1.0 L/kg)
            </div>
            <div className="legend-item good">
              <span className="dot"></span> Good (1.0-2.0 L/kg)
            </div>
            <div className="legend-item average">
              <span className="dot"></span> Average (2.0-3.0 L/kg)
            </div>
            <div className="legend-item poor">
              <span className="dot"></span> Needs Improvement (&gt; 3.0 L/kg)
            </div>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Vessel Name</th>
                <th>Engine Type</th>
                <th>Trip Hours</th>
                <th>Fuel Consumed (L)</th>
                <th>Total Catch (kg)</th>
                <th>Footprint (L/kg)</th>
                <th>Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {vessels.map((vessel) => (
                <tr key={vessel.vesselId} className={vessel.rank <= 3 ? 'highlight' : ''}>
                  <td className="rank-cell">
                    {vessel.rank === 1 && '🥇'}
                    {vessel.rank === 2 && '🥈'}
                    {vessel.rank === 3 && '🥉'}
                    {vessel.rank > 3 && `#${vessel.rank}`}
                  </td>
                  <td className="vessel-name">{vessel.vesselName}</td>
                  <td>{vessel.engineTypeName}</td>
                  <td>{vessel.totalTripHours.toFixed(1)}</td>
                  <td>{vessel.totalFuelConsumed.toFixed(1)}</td>
                  <td>{vessel.totalCatchWeightKg.toFixed(1)}</td>
                  <td className="footprint-value">
                    <strong>{vessel.carbonFootprintPerKg.toFixed(3)}</strong>
                  </td>
                  <td>
                    <span className={`efficiency-badge ${getEfficiencyClass(vessel.carbonFootprintPerKg)}`}>
                      {getEfficiencyClass(vessel.carbonFootprintPerKg).toUpperCase()}
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
