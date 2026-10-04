import React from 'react';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
  const { engineState } = useAppContext();
  const { metrics, jobs, incidents } = engineState;

  const detectionCoverage = metrics.testedTechniques > 0 
    ? Math.round((metrics.detectedTechniques / metrics.testedTechniques) * 100) 
    : 0;

  const passRate = engineState.validations.length > 0
    ? Math.round((engineState.validations.filter(v => v.result === 'PASS').length / engineState.validations.length) * 100)
    : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">NEXORA SECURITY OPERATIONS</h1>
          <p className="text-muted font-mono text-xs mt-2">◆ SIMULATION MODE</p>
        </div>
      </div>

      <div className="grid-4 mb-4">
        <div className="metric-box">
          <div className="metric-label">Detection Coverage</div>
          <div className="metric-value">{detectionCoverage}%</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Validation Pass Rate</div>
          <div className="metric-value">{passRate}%</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Active Simulations</div>
          <div className="metric-value">{metrics.activeSimulations}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Open Incidents</div>
          <div className="metric-value">{engineState.incidents.filter(i => i.status === 'OPEN').length}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">Execution Timeline</div>
          <div className="font-mono text-sm">
            {jobs.length === 0 ? <span className="text-muted">No recent activity.</span> : null}
            {jobs.slice(0, 5).map(job => (
              <div key={job.id} className="mb-4">
                <div className="text-muted text-xs mb-1">{new Date(job.startedAt).toLocaleTimeString()}</div>
                <div>{job.id} - {job.scenarioId} <span className="badge badge-outline">{job.status === 'RUNNING' ? '■ RUNNING' : '✓ COMPLETED'}</span></div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">Recent Incidents</div>
          <div className="data-table-wrapper">
            <table className="data-table font-mono">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Severity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {incidents.length === 0 ? <tr><td colSpan="3" className="text-muted text-center p-4">No incidents.</td></tr> : null}
                {incidents.slice(0, 5).map(inc => (
                  <tr key={inc.id}>
                    <td>{inc.id}</td>
                    <td><span className="badge badge-outline">[{inc.severity}]</span></td>
                    <td>{inc.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
