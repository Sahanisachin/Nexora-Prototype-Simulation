import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Telemetry = () => {
  const { engineState, engine } = useAppContext();
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const results = engine.searchTelemetry(search);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <h1 className="page-title">TELEMETRY</h1>
      </div>

      <div className="panel mb-4 flex items-center gap-4">
        <div style={{ flex: 1, position: 'relative' }}>
          <span className="font-mono" style={{ position: 'absolute', top: '10px', left: '10px' }}>&gt;</span>
          <input 
            type="text" 
            className="input-field font-mono" 
            style={{ paddingLeft: '2.5rem' }} 
            placeholder="Search telemetry (e.g. powershell, T1110)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="font-mono text-xs text-muted">
          EVENTS: {results.length}
        </div>
      </div>

      <div className="grid-3" style={{ flex: 1, overflow: 'hidden' }}>
        <div className="panel" style={{ gridColumn: 'span 2', overflowY: 'auto', padding: 0 }}>
          <div className="data-table-wrapper" style={{ border: 'none' }}>
            <table className="data-table font-mono">
              <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'var(--bg-card)' }}>
                <tr>
                  <th>Timestamp</th>
                  <th>Event ID</th>
                  <th>Severity</th>
                  <th>Technique</th>
                  <th>Process</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? <tr><td colSpan="5" className="text-muted text-center p-4">No telemetry found.</td></tr> : null}
                {results.map(evt => (
                  <tr key={evt.id} style={{ cursor: 'pointer', backgroundColor: selectedEvent?.id === evt.id ? 'rgba(255,255,255,0.05)' : '' }} onClick={() => setSelectedEvent(evt)}>
                    <td className="text-muted">{new Date(evt.timestamp).toLocaleTimeString()}</td>
                    <td>{evt.id}</td>
                    <td><span className="badge badge-outline">[{evt.severity}]</span></td>
                    <td>{evt.technique}</td>
                    <td>{evt.process}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel" style={{ overflowY: 'auto' }}>
          <div className="panel-header">Event Details</div>
          {!selectedEvent ? (
            <div className="text-muted text-sm font-mono">Select an event to view details.</div>
          ) : (
            <div className="font-mono text-sm">
              <div className="mb-4">
                <div className="text-muted text-xs mb-1">JSON VIEW</div>
                <pre style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0', overflowX: 'auto', border: '1px solid var(--border-color)' }}>
                  {JSON.stringify(selectedEvent, null, 2)}
                </pre>
              </div>
              <button className="btn btn-secondary text-xs" onClick={() => navigator.clipboard.writeText(JSON.stringify(selectedEvent, null, 2))}>
                COPY JSON
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Telemetry;
