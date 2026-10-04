import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FlaskConical, PlayCircle, Plus } from 'lucide-react';

const Scenarios = () => {
  const { scenarios } = useAppContext();
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FlaskConical size={28} color="var(--accent-cyan)" />
          Scenario Library
        </h1>
        <button className="btn btn-primary">
          <Plus size={18} /> Add Scenario
        </button>
      </div>

      <div className="grid-2">
        {scenarios.map(scen => (
          <div key={scen.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{scen.name}</h2>
              <span className={`badge badge-${scen.severity === 'Critical' || scen.severity === 'High' ? 'danger' : scen.severity === 'Medium' ? 'warning' : 'info'}`}>
                {scen.severity}
              </span>
            </div>
            
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1 }}>{scen.description}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target:</span>
                <span>{scen.target}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Technique:</span>
                <span style={{ color: 'var(--accent-cyan)' }}>{scen.technique}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tactic:</span>
                <span>{scen.tactic}</span>
              </div>
            </div>

            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
              onClick={() => navigate(`/scenarios/${scen.id}/execute`)}
            >
              <PlayCircle size={18} /> Execute Simulation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scenarios;
