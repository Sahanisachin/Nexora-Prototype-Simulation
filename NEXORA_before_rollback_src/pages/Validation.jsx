import React from 'react';
import { useAppContext } from '../context/AppContext';

const Validation = () => {
  const { engineState } = useAppContext();
  const { validations, scenarios } = engineState;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <h1 className="page-title">VALIDATION RESULTS</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {validations.length === 0 ? (
          <div className="text-muted font-mono p-4">No validations have run yet. Run a scenario to generate validation results.</div>
        ) : (
          <div className="grid-2">
            {validations.map(val => {
              const scenario = scenarios.find(s => s.id === val.scenarioId) || { name: val.scenarioId };
              const isPass = val.result === 'PASS';
              
              return (
                <div key={val.id} className="panel flex-col gap-4">
                  <div className="flex justify-between items-start pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <div className="font-mono text-xs text-muted mb-1">{val.id} • {new Date(val.timestamp).toLocaleTimeString()}</div>
                      <div className="font-bold">{scenario.name}</div>
                    </div>
                    {isPass ? (
                      <div className="badge badge-outline">✓ PASS</div>
                    ) : (
                      <div className="badge badge-outline">✕ FAIL</div>
                    )}
                  </div>
                  
                  <div className="grid-2 font-mono text-sm gap-4">
                    <div>
                      <div className="text-muted text-xs uppercase mb-1">Expected</div>
                      <div className="p-2" style={{ borderLeft: '1px solid var(--border-color)' }}>{val.expected}</div>
                    </div>
                    <div>
                      <div className="text-muted text-xs uppercase mb-1">Observed</div>
                      <div className="p-2" style={{ borderLeft: '1px solid var(--border-color)' }}>{val.observed}</div>
                    </div>
                  </div>
                  
                  <div className="font-mono text-xs mt-2 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted">Expected Detection</span>
                      <span>YES</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted">Expected Incident</span>
                      <span>YES</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Linked Incident</span>
                      <span>{val.incidentId}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Validation;
