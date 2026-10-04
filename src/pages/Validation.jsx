import React from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckSquare, AlertTriangle, ShieldCheck } from 'lucide-react';

const Validation = () => {
  const { validations } = useAppContext();

  const passed = validations.filter(v => v.result === 'PASSED').length;
  const failed = validations.filter(v => v.result === 'FAILED').length;
  const partial = validations.filter(v => v.result === 'PARTIAL').length;
  const total = validations.length;
  
  const score = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckSquare size={28} color="var(--accent-cyan)" />
          Security Validation
        </h1>
      </div>

      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card" style={{ gridColumn: 'span 1' }}>
          <span className="stat-label">Total Validations</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="card stat-card" style={{ gridColumn: 'span 1' }}>
          <span className="stat-label">Passed</span>
          <span className="stat-value" style={{ color: 'var(--status-success)' }}>{passed}</span>
        </div>
        <div className="card stat-card" style={{ gridColumn: 'span 1' }}>
          <span className="stat-label">Failed / Partial</span>
          <span className="stat-value" style={{ color: 'var(--status-danger)' }}>{failed + partial}</span>
        </div>
        <div className="card stat-card" style={{ gridColumn: 'span 1' }}>
          <span className="stat-label">Overall Score</span>
          <span className="stat-value" style={{ color: score >= 80 ? 'var(--status-success)' : score >= 50 ? 'var(--status-warning)' : 'var(--status-danger)' }}>
            {score}%
          </span>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} /> Validation History
        </h2>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Scenario</th>
                <th>Technique</th>
                <th>Expected Detection</th>
                <th>Actual Result</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {validations.map(val => (
                <tr key={val.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {new Date(val.timestamp).toLocaleString()}
                  </td>
                  <td style={{ fontWeight: 500 }}>{val.scenarioName}</td>
                  <td>{val.technique}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{val.expectedDetection}</td>
                  <td>{val.actualDetection}</td>
                  <td>
                    <span className={`badge badge-${val.result === 'PASSED' ? 'success' : val.result === 'PARTIAL' ? 'warning' : 'danger'}`}>
                      {val.result}
                    </span>
                  </td>
                </tr>
              ))}
              {validations.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No validations have been run yet. Execute a scenario to generate validations.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Validation;
