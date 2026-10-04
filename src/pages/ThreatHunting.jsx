import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Database, Terminal } from 'lucide-react';

const ThreatHunting = () => {
  const { telemetry } = useAppContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(true);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const matches = telemetry.filter(t => 
      t.message.toLowerCase().includes(lowerQuery) || 
      t.source.toLowerCase().includes(lowerQuery) ||
      t.type.toLowerCase().includes(lowerQuery)
    );
    setResults(matches);
    setHasSearched(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={28} color="var(--accent-cyan)" />
          Threat Hunting
        </h1>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={18} /> Hunt Query
        </h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="e.g., powershell, failed login, falco..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{ fontFamily: 'monospace' }}
          />
          <button className="btn btn-primary" onClick={handleSearch} style={{ minWidth: '120px' }}>
            Run Query
          </button>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Example queries:</span>
          <button className="badge badge-info" style={{ cursor: 'pointer', border: 'none' }} onClick={() => setQuery('powershell')}>powershell</button>
          <button className="badge badge-info" style={{ cursor: 'pointer', border: 'none' }} onClick={() => setQuery('login')}>login</button>
          <button className="badge badge-info" style={{ cursor: 'pointer', border: 'none' }} onClick={() => setQuery('falco')}>falco</button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} /> Results {hasSearched && `(${results.length})`}
          </h2>
        </div>
        
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Source</th>
                <th>Severity</th>
                <th>Message</th>
                <th>Host</th>
              </tr>
            </thead>
            <tbody>
              {results.map(t => (
                <tr key={t.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {new Date(t.timestamp).toLocaleString()}
                  </td>
                  <td>{t.source}</td>
                  <td>
                    <span className={`badge badge-${t.severity.toLowerCase() === 'high' || t.severity.toLowerCase() === 'critical' ? 'danger' : t.severity.toLowerCase() === 'medium' ? 'warning' : 'info'}`}>
                      {t.severity}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{t.message}</td>
                  <td>{t.host}</td>
                </tr>
              ))}
              {hasSearched && results.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No events match the query.
                  </td>
                </tr>
              )}
              {!hasSearched && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    Enter a query to start hunting.
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

export default ThreatHunting;
