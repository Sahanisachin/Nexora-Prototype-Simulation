import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Activity, Search, Filter } from 'lucide-react';

const Telemetry = () => {
  const { telemetry } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('All');

  const filteredTelemetry = telemetry.filter(t => {
    const matchesSearch = t.message.toLowerCase().includes(searchTerm.toLowerCase()) || t.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === 'All' || t.source === filterSource;
    return matchesSearch && matchesSource;
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={28} color="var(--accent-cyan)" />
          Telemetry Stream
        </h1>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search events..." 
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="input-field" 
          style={{ width: '200px' }}
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
        >
          <option value="All">All Sources</option>
          <option value="Suricata">Suricata</option>
          <option value="Zeek">Zeek</option>
          <option value="Falco">Falco</option>
          <option value="Application">Application</option>
          <option value="Kubernetes">Kubernetes</option>
        </select>
      </div>

      <div className="card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Source</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Message</th>
                <th>Host</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {filteredTelemetry.map(t => (
                <tr key={t.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {new Date(t.timestamp).toLocaleString()}
                  </td>
                  <td>{t.source}</td>
                  <td>{t.type}</td>
                  <td>
                    <span className={`badge badge-${t.severity.toLowerCase() === 'high' || t.severity.toLowerCase() === 'critical' ? 'danger' : t.severity.toLowerCase() === 'medium' ? 'warning' : 'info'}`}>
                      {t.severity}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace' }}>{t.message}</td>
                  <td>{t.host}</td>
                  <td>{t.ip}</td>
                </tr>
              ))}
              {filteredTelemetry.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No telemetry events found matching criteria.
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

export default Telemetry;
