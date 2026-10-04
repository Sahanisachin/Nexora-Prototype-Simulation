import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ShieldAlert, UserPlus, CheckCircle2 } from 'lucide-react';

const Incidents = () => {
  const { incidents } = useAppContext();
  const [selectedIncident, setSelectedIncident] = useState(null);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={28} color="var(--accent-cyan)" />
          Incidents
        </h1>
      </div>

      <div className="grid-3" style={{ alignItems: 'start' }}>
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>First Seen</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map(inc => (
                  <tr key={inc.id} style={{ backgroundColor: selectedIncident?.id === inc.id ? 'var(--bg-hover)' : 'transparent' }}>
                    <td>{inc.id}</td>
                    <td style={{ fontWeight: 500 }}>{inc.title}</td>
                    <td>
                      <span className={`badge badge-${inc.severity.toLowerCase() === 'high' || inc.severity.toLowerCase() === 'critical' ? 'danger' : inc.severity.toLowerCase() === 'medium' ? 'warning' : 'info'}`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${inc.status === 'Resolved' ? 'success' : inc.status === 'In Progress' ? 'warning' : 'danger'}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {new Date(inc.firstSeen).toLocaleString()}
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setSelectedIncident(inc)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {incidents.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No incidents generated yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedIncident ? (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>{selectedIncident.id}</h2>
              <span className={`badge badge-${selectedIncident.severity.toLowerCase() === 'high' || selectedIncident.severity.toLowerCase() === 'critical' ? 'danger' : selectedIncident.severity.toLowerCase() === 'medium' ? 'warning' : 'info'}`}>
                {selectedIncident.severity}
              </span>
            </div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>{selectedIncident.title}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span>{selectedIncident.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Source:</span>
                <span>{selectedIncident.source}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assignee:</span>
                <span>{selectedIncident.assignee}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Timeline</h4>
              <div style={{ fontSize: '0.875rem', paddingLeft: '1rem', borderLeft: '2px solid var(--border-color)' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ color: 'var(--accent-cyan)' }}>Detection Triggered</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(selectedIncident.firstSeen).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <UserPlus size={16} /> Assign to me
              </button>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <CheckCircle2 size={16} /> Resolve Incident
              </button>
            </div>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', height: '100%' }}>
            Select an incident to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default Incidents;
