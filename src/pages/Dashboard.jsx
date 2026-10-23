import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Shield, Target, AlertTriangle, CheckCircle, Activity, Radio } from 'lucide-react';

const Dashboard = () => {
  const { scenarios, incidents, telemetry, validations, scenarioRuns } = useAppContext();

  const passedValidations = validations.filter(v => v.result === 'PASSED').length;
  const overallScore = validations.length > 0 ? Math.round((passedValidations / validations.length) * 100) : 0;
  
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 className="page-title">Security Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '2rem' }}>
          <div className="live-indicator"></div>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.05em' }}>LIVE MONITORING</span>
          <Radio size={16} className="text-cyan-500" />
        </div>
      </div>

      {/* Central Screening Quick Action Card */}
      <div className="card" style={{
        marginBottom: '2rem',
        padding: '1.5rem 2rem',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(10, 11, 14, 0.95) 100%)',
        border: '1.5px solid rgba(6, 182, 212, 0.35)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '8px'
      }}>
        <div style={{ maxWidth: '700px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge" style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
              CORE CAPABILITY
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Security Assessment Engine</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Target Security Screening & Loopholes Assessment
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
            Upload application binaries, enter website links, or supply GitHub repo reports to run an 11-stage automated simulation with live flowchart tracing, CLI command telemetry, and architecture vulnerability proofs.
          </p>
        </div>
        <div>
          <a
            href="/screening"
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Launch Screening Center &rarr;
          </a>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card animated-card delay-1">
          <span className="stat-label">Active Scenarios</span>
          <span className="stat-value">{scenarios.length}</span>
        </div>
        <div className="card stat-card animated-card delay-2">
          <span className="stat-label">Total Detections</span>
          <span className="stat-value">{telemetry.length}</span>
        </div>
        <div className="card stat-card animated-card delay-3">
          <span className="stat-label">Open Incidents</span>
          <span className="stat-value" style={{ color: 'var(--status-danger)' }}>
            {incidents.filter(i => i.status !== 'Resolved').length}
          </span>
        </div>
        <div className="card stat-card animated-card delay-4">
          <span className="stat-label">Security Posture Score</span>
          <span className="stat-value" style={{ color: overallScore >= 80 ? 'var(--status-success)' : overallScore >= 50 ? 'var(--status-warning)' : 'var(--status-danger)' }}>
            {overallScore}%
          </span>
        </div>
      </div>

      <div className="grid-2">
        <div className="card animated-card delay-2">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} className="text-muted" /> Recent Incidents
          </h2>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Severity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {incidents.slice(0, 5).map(inc => (
                  <tr key={inc.id}>
                    <td>{inc.id}</td>
                    <td>{inc.title}</td>
                    <td>
                      <span className={`badge badge-${inc.severity.toLowerCase() === 'high' || inc.severity.toLowerCase() === 'critical' ? 'danger' : inc.severity.toLowerCase() === 'medium' ? 'warning' : 'info'}`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td>{inc.status}</td>
                  </tr>
                ))}
                {incidents.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No recent incidents.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card animated-card delay-3">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} className="text-muted" /> Recent Scenario Runs
          </h2>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Scenario</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {scenarioRuns.slice(0, 5).map(run => (
                  <tr key={run.id}>
                    <td>{run.id}</td>
                    <td>{run.scenarioName}</td>
                    <td>
                      <span className={`badge badge-${run.status === 'COMPLETED' ? 'success' : run.status === 'FAILED' ? 'danger' : 'info'}`}>
                        {run.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {new Date(run.startTime).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
                {scenarioRuns.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No recent executions.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
