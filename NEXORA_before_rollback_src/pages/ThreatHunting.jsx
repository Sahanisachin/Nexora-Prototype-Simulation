import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Play } from 'lucide-react';

const ThreatHunting = () => {
  const { engine } = useAppContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasRun, setHasRun] = useState(false);

  const handleRunQuery = () => {
    setResults(engine.searchTelemetry(query));
    setHasRun(true);
  };

  return (
    <div className="animated-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <h1 className="page-title text-cyan">THREAT HUNTING</h1>
      </div>

      <div className="panel mb-4">
        <div className="text-muted text-sm font-mono mb-2">Query</div>
        <div className="flex gap-4">
          <div style={{ flex: 1, position: 'relative' }}>
            <span className="font-mono text-cyan" style={{ position: 'absolute', top: '10px', left: '12px', fontWeight: 'bold' }}>&gt;</span>
            <input 
              type="text" 
              className="input-field font-mono text-lg" 
              style={{ paddingLeft: '2rem', backgroundColor: '#050505' }} 
              placeholder="e.g. powershell"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRunQuery(); }}
            />
          </div>
          <button className="btn btn-primary" onClick={handleRunQuery}>
            <Play size={16} /> RUN HUNT
          </button>
        </div>
      </div>

      <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        <div className="panel-header" style={{ margin: '1.5rem 1.5rem 0', borderBottom: 'none' }}>Results</div>
        <div className="data-table-wrapper" style={{ flex: 1, border: 'none', borderRadius: 0 }}>
          <table className="data-table font-mono">
            <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'var(--bg-card)' }}>
              <tr>
                <th>Timestamp</th>
                <th>Severity</th>
                <th>Technique</th>
                <th>Process/Event</th>
              </tr>
            </thead>
            <tbody>
              {!hasRun ? (
                <tr><td colSpan="4" className="text-muted text-center p-8">Enter a query and run hunt.</td></tr>
              ) : results.length === 0 ? (
                <tr><td colSpan="4" className="text-muted text-center p-8">No matching telemetry found.</td></tr>
              ) : (
                results.map(evt => (
                  <tr key={evt.id}>
                    <td className="text-muted">{new Date(evt.timestamp).toLocaleTimeString()}</td>
                    <td><span className={`badge ${evt.severity === 'HIGH' || evt.severity === 'CRITICAL' ? 'badge-red' : evt.severity === 'MEDIUM' ? 'badge-amber' : 'badge-green'}`}>{evt.severity}</span></td>
                    <td className="text-cyan">{evt.technique}</td>
                    <td>{evt.process !== 'unknown' ? evt.process : evt.event}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ThreatHunting;
