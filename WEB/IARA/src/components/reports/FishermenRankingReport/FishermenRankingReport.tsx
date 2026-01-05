import React, { useEffect, useState } from 'react';
import { reportsApi } from '../../../api/reports.api';
import type { RecreationalFishermenRanking } from '../../../api/reports.api';
import { useToast } from '../../shared/Toast';
import './FishermenRankingReport.css';

export const FishermenRankingReport: React.FC = () => {
  const [fishermen, setFishermen] = useState<RecreationalFishermenRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getFishermenRanking();
      setFishermen(data);
    } catch (error) {
      showToast('error', 'Failed to load report');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) return <div className="loading">Loading report...</div>;

  return (
    <div className="fishermen-ranking-report">
      <div className="report-header">
        <h1>🏆 Recreational Fishermen Ranking</h1>
        <p className="report-description">
          Top recreational fishermen ranked by total catch weight over the past year.
        </p>
      </div>

      {fishermen.length === 0 ? (
        <div className="no-data">
          <p>No recreational catches recorded in the past year.</p>
        </div>
      ) : (
        <div className="report-content">
          <div className="podium">
            {fishermen.slice(0, 3).map((fisher) => (
              <div key={fisher.personId} className={`podium-place place-${fisher.rank}`}>
                <div className="medal">{getMedalIcon(fisher.rank)}</div>
                <div className="fisher-name">{fisher.fisherName}</div>
                <div className="weight">{fisher.totalWeightKg.toFixed(2)} kg</div>
                <div className="catches">{fisher.totalCatches} catches</div>
              </div>
            ))}
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Fisher Name</th>
                <th>Total Catches</th>
                <th>Total Weight (kg)</th>
                <th>Avg per Catch (kg)</th>
              </tr>
            </thead>
            <tbody>
              {fishermen.map((fisher) => (
                <tr key={fisher.personId} className={fisher.rank <= 3 ? `top-${fisher.rank}` : ''}>
                  <td className="rank-cell">
                    <span className="rank-badge">{getMedalIcon(fisher.rank)}</span>
                  </td>
                  <td className="fisher-name-cell">{fisher.fisherName}</td>
                  <td>{fisher.totalCatches}</td>
                  <td className="weight-cell">{fisher.totalWeightKg.toFixed(2)} kg</td>
                  <td>{(fisher.totalWeightKg / fisher.totalCatches).toFixed(2)} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
