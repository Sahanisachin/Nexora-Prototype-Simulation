import React, { useState, useEffect } from 'react';
import { Activity, Play, CheckCircle, Clock } from 'lucide-react';

const stages = [
  { id: 1, name: 'Initialization', desc: 'Loading XBird core modules...' },
  { id: 2, name: 'Data Processing', desc: 'Ingesting simulation telemetry...' },
  { id: 3, name: 'Threat Analysis', desc: 'Running heuristic algorithms...' },
  { id: 4, name: 'Validation', desc: 'Verifying system integrity...' },
  { id: 5, name: 'Completion', desc: 'Simulation process finalized.' }
];

export default function ModelAnimation() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let timer;
    if (isRunning && currentStageIndex < stages.length) {
      // Pick random duration: 15s or 25s
      const duration = 3;
      setTimeRemaining(duration);
      
      const logEntry = `[${new Date().toLocaleTimeString()}] Stage '${stages[currentStageIndex].name}' started. Expected duration: ${duration}s.`;
      setLogs(prev => [...prev, logEntry]);

      // Count down
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Advance stage
      timer = setTimeout(() => {
        const completionLog = `[${new Date().toLocaleTimeString()}] Stage '${stages[currentStageIndex].name}' completed.`;
        setLogs(prev => [...prev, completionLog]);
        setCurrentStageIndex(prev => prev + 1);
      }, duration * 1000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else if (currentStageIndex >= stages.length) {
      setIsRunning(false);
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] All simulation stages completed successfully.`]);
    }
  }, [isRunning, currentStageIndex]);

  const startSimulation = () => {
    setCurrentStageIndex(0);
    setLogs([]);
    setIsRunning(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={28} /> Model Animation
        </h1>
        <button className="btn btn-primary" onClick={startSimulation} disabled={isRunning}>
          <Play size={18} />
          {currentStageIndex > 0 && currentStageIndex < stages.length ? 'Simulation Running...' : 'Start Simulation'}
        </button>
      </div>

      <div className="grid-2">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Simulation Stages</h2>
          {stages.map((stage, index) => {
            const isActive = index === currentStageIndex && isRunning;
            const isCompleted = index < currentStageIndex;
            
            let statusColor = 'var(--text-muted)';
            if (isActive) statusColor = 'var(--accent-cyan)';
            if (isCompleted) statusColor = 'var(--text-main)';

            return (
              <div key={stage.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                padding: '1rem',
                border: `1px solid ${isActive ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                borderRadius: '0.5rem',
                backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
                transition: 'all 0.3s ease'
              }}>
                <div>
                  {isCompleted ? <CheckCircle size={24} color="var(--text-main)" /> : 
                   isActive ? <Activity size={24} className="spin-icon" color="var(--accent-cyan)" /> :
                   <Clock size={24} color="var(--text-muted)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: statusColor }}>{stage.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stage.desc}</div>
                </div>

              </div>
            );
          })}
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h2 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Process Logs</h2>
          <div style={{ 
            flex: 1, 
            backgroundColor: '#000', 
            color: '#fff', 
            padding: '1rem', 
            fontFamily: 'monospace', 
            borderRadius: '0.25rem',
            overflowY: 'auto',
            maxHeight: '400px',
            border: '1px solid #333'
          }}>
            {logs.length === 0 ? (
              <span style={{ color: '#555' }}>Awaiting simulation start...</span>
            ) : (
              logs.map((log, i) => (
                <div key={i} style={{ marginBottom: '0.5rem', opacity: 0.8 }}>
                  {log}
                </div>
              ))
            )}
            {isRunning && (
              <div style={{ color: 'var(--accent-cyan)', marginTop: '0.5rem', animation: 'blink 1s infinite' }}>_ processing...</div>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .spin-icon {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
