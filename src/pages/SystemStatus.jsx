import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Settings, Server, Database, Activity, Shield, RefreshCw } from 'lucide-react';

const SystemStatus = () => {
  const { resetData } = useAppContext();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all prototype demo data? This will clear all incidents and validations.")) {
      resetData();
      alert("Demo data reset successfully.");
    }
  };

  const systems = [
    { name: 'Frontend Application', status: 'Online', type: 'Local', icon: Activity },
    { name: 'Simulation Engine', status: 'Online', type: 'Local', icon: Settings },
    { name: 'Local Data Store', status: 'Online', type: 'Local', icon: Database },
    { name: 'Detection Engine', status: 'Online', type: 'Local', icon: Shield },
    { name: 'Kubernetes Cluster', status: 'Simulated', type: 'External', icon: Server },
    { name: 'Falco Agent', status: 'Simulated', type: 'External', icon: Shield },
    { name: 'Zeek Sensor', status: 'Simulated', type: 'External', icon: Activity },
    { name: 'Suricata IDS', status: 'Simulated', type: 'External', icon: Shield },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={28} color="var(--accent-cyan)" />
          System Status
        </h1>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Component Health</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {systems.map((sys, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-dark)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <sys.icon size={20} color="var(--text-muted)" />
                  <div>
                    <div style={{ fontWeight: 500 }}>{sys.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sys.type}</div>
                  </div>
                </div>
                <span className={`badge badge-${sys.status === 'Online' ? 'success' : 'warning'}`}>
                  {sys.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Prototype Controls</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            This dashboard is running in Prototype/Simulation mode. All events, incidents, and validations generated are simulated entirely within the local browser storage.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--status-danger)' }}>Danger Zone</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Resetting demo data will clear all executed scenarios, generated telemetry, incidents, and validation reports.
            </p>
            <button className="btn btn-secondary" style={{ borderColor: 'var(--status-danger)', color: 'var(--status-danger)', justifyContent: 'center' }} onClick={handleReset}>
              <RefreshCw size={18} /> Reset Demo Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
