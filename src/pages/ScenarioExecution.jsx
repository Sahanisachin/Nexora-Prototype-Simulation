import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Play, Square, RefreshCw, Terminal, CheckCircle } from 'lucide-react';
import { generateMockTelemetry } from '../data/mockData';

const ScenarioExecution = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { scenarios, addTelemetryEvent, addIncident, addValidation, addScenarioRun } = useAppContext();
  
  const scenario = scenarios.find(s => s.id === id);
  
  const [status, setStatus] = useState('IDLE'); // IDLE, RUNNING, COMPLETED
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!scenario) {
    return <div>Scenario not found</div>;
  }

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${msg}`]);
  };

  const handleExecute = () => {
    setStatus('RUNNING');
    setLogs([]);
    addLog(`Initializing simulation for: ${scenario.name}`);
    
    let step = 0;
    const runId = 'RUN-' + Math.floor(Math.random() * 10000);
    let runTelemetry = [];
    let runIncident = null;

    const steps = [
      () => addLog('Loading target profile...'),
      () => addLog(`Executing simulated technique: ${scenario.technique}...`),
      () => {
        addLog('Telemetry event generated in simulation layer.');
        const t1 = generateMockTelemetry('Simulated Action', scenario.name + ' execution step', scenario.severity, 'Application');
        addTelemetryEvent(t1);
        runTelemetry.push(t1);
      },
      () => {
        addLog('Evaluating local detection rules against telemetry...');
        const t2 = generateMockTelemetry('Detection', scenario.expectedDetections[0] || 'Malicious activity detected', 'High', 'Suricata');
        addTelemetryEvent(t2);
        runTelemetry.push(t2);
      },
      () => {
        addLog('Rule matched. Creating incident...');
        const incidentId = 'INC-2026-' + Math.floor(100 + Math.random() * 900);
        runIncident = {
          id: incidentId,
          title: `Simulated Incident: ${scenario.name}`,
          severity: scenario.severity,
          status: 'Open',
          source: 'Detection Engine',
          firstSeen: new Date().toISOString(),
          assignee: 'Unassigned',
        };
        addIncident(runIncident);
      },
      () => {
        addLog('Validating detection against expected outcome...');
        addValidation({
          id: 'VAL-' + Math.floor(Math.random() * 10000),
          scenarioName: scenario.name,
          technique: scenario.technique,
          expectedDetection: scenario.expectedDetections[0] || 'Unknown',
          actualDetection: 'Detected',
          result: 'PASSED',
          timestamp: new Date().toISOString()
        });
      },
      () => {
        addLog('Simulation completed successfully.');
        setStatus('COMPLETED');
        addScenarioRun({
          id: runId,
          scenarioId: scenario.id,
          scenarioName: scenario.name,
          status: 'COMPLETED',
          startTime: new Date().toISOString(),
        });
      }
    ];

    const timer = setInterval(() => {
      if (step < steps.length) {
        steps[step]();
        step++;
      } else {
        clearInterval(timer);
      }
    }, 1200); // 1.2s delay between steps for realistic effect
  };

  const handleReset = () => {
    setStatus('IDLE');
    setLogs([]);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={28} color="var(--accent-cyan)" />
            Execution: {scenario.name}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{scenario.technique} - {scenario.tactic}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/scenarios')}>Back</button>
          {status === 'IDLE' && (
            <button className="btn btn-primary" onClick={handleExecute}>
              <Play size={18} /> Execute
            </button>
          )}
          {status === 'RUNNING' && (
            <button className="btn btn-danger" disabled>
              <Square size={18} /> Running...
            </button>
          )}
          {status === 'COMPLETED' && (
            <button className="btn btn-secondary" onClick={handleReset}>
              <RefreshCw size={18} /> Reset + Replay
            </button>
          )}
        </div>
      </div>

      <div className="stack-layout">
        <div className="card animated-card delay-1">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>GUI Simulation Overview</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>State</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: status === 'RUNNING' ? 'var(--status-warning)' : status === 'COMPLETED' ? 'var(--status-success)' : 'var(--text-main)' }}>
                  {status}
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Target</div>
                <div>{scenario.target}</div>
              </div>

              {status === 'COMPLETED' && (
                <div style={{ padding: '1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--status-success)', borderRadius: '0.75rem', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--status-success)', fontWeight: 'bold', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                    <CheckCircle size={24} /> Validation Passed
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    The expected detection "{scenario.expectedDetections[0]}" was successfully triggered and recorded as an incident.
                  </div>
                  <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/validation')}>
                    View Validation Report
                  </button>
                </div>
              )}
            </div>

            <div style={{ 
              backgroundColor: 'rgba(0,0,0,0.3)', 
              borderRadius: '0.5rem', 
              border: '1px solid var(--border-color)', 
              height: '300px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
               {status === 'RUNNING' ? (
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                   <div className="live-indicator" style={{ width: '40px', height: '40px' }}></div>
                   <div style={{ color: 'var(--accent-cyan)', fontWeight: '600' }}>Simulating Network Traffic...</div>
                 </div>
               ) : status === 'COMPLETED' ? (
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--status-success)' }}>
                   <CheckCircle size={48} />
                   <div style={{ fontWeight: '600' }}>Simulation Finalized</div>
                 </div>
               ) : (
                 <div style={{ color: 'var(--text-muted)' }}>Simulation GUI Ready...</div>
               )}
            </div>
          </div>
        </div>

        <div className="card animated-card delay-2" style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={20} /> Execution Logs (CLI)
          </h2>
          <div style={{ 
            flex: 1, 
            backgroundColor: '#0a0a0a', 
            borderRadius: '0.5rem', 
            padding: '1.5rem', 
            fontFamily: 'monospace', 
            overflowY: 'auto',
            color: '#a3be8c',
            border: '1px solid #333'
          }}>
            {logs.length === 0 ? (
              <span style={{ color: '#4c566a' }}>Waiting for execution to start...</span>
            ) : (
              logs.map((log, i) => (
                <div key={i} style={{ marginBottom: '0.5rem' }}>{log}</div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioExecution;
