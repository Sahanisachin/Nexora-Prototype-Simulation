import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Incidents = () => {
  const { engineState } = useAppContext();
  const { incidents } = engineState;
  const [selectedIncident, setSelectedIncident] = useState(null);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <h1 className="page-title">INCIDENTS</h1>
      </div>

      <div className="grid-3" style={{ flex: 1, overflow: 'hidden' }}>
        <div className="panel" style={{ overflowY: 'auto', padding: 0 }}>
          <div className="data-table-wrapper" style={{ border: 'none' }}>
            <table className="data-table font-mono">
              <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'var(--bg-card)' }}>
                <tr>
                  <th>Incident ID</th>
                  <th>Severity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {incidents.length === 0 ? <tr><td colSpan="3" className="text-muted text-center p-4">No incidents.</td></tr> : null}
                {incidents.map(inc => (
                  <tr key={inc.id} style={{ cursor: 'pointer', backgroundColor: selectedIncident?.id === inc.id ? 'rgba(255,255,255,0.05)' : '' }} onClick={() => setSelectedIncident(inc)}>
                    <td>{inc.id}</td>
                    <td><span className="badge badge-outline">[{inc.severity}]</span></td>
                    <td>{inc.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel" style={{ gridColumn: 'span 2', overflowY: 'auto' }}>
          {!selectedIncident ? (
            <div className="text-muted text-sm font-mono mt-4">Select an incident to view details.</div>
          ) : (
            <div>
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-color" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <h2 className="text-2xl font-bold font-mono mb-2">{selectedIncident.id}</h2>
                  <div className="text-muted font-mono">{selectedIncident.scenarioId}</div>
                </div>
                <div className="text-right font-mono">
                  <div className="mb-2"><span className="badge badge-outline">[{selectedIncident.severity}]</span></div>
                  <div><span className="badge badge-outline text-muted">{selectedIncident.status}</span></div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2">Timeline</h3>
                <div className="font-mono text-sm pl-4" style={{ borderLeft: '1px solid var(--border-color)' }}>
                  <div className="mb-3 position-relative">
                    <div className="text-muted text-xs">{new Date(selectedIncident.timestamp).toLocaleTimeString()}</div>
                    <div>■ Simulation started</div>
                  </div>
                  <div className="mb-3 position-relative">
                    <div className="text-muted text-xs">{new Date(selectedIncident.timestamp).toLocaleTimeString()}</div>
                    <div>■ Telemetry generated</div>
                  </div>
                  <div className="mb-3 position-relative">
                    <div className="text-muted text-xs">{new Date(selectedIncident.timestamp).toLocaleTimeString()}</div>
                    <div>■ Detection triggered: {selectedIncident.detectionId}</div>
                  </div>
                  <div className="mb-3 position-relative">
                    <div className="text-muted text-xs">{new Date(selectedIncident.timestamp).toLocaleTimeString()}</div>
                    <div>■ Incident created</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Evidence</h3>
                <pre className="font-mono text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '1rem', border: '1px solid var(--border-color)' }}>
                  {JSON.stringify(selectedIncident, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Incidents;
