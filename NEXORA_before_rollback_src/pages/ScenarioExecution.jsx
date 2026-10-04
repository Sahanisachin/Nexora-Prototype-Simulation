import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const ScenarioExecution = () => {
  const { engineState } = useAppContext();
  const { jobs } = engineState;
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || null);

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <h1 className="page-title">EXECUTION JOBS</h1>
      </div>

      <div className="grid-3" style={{ flex: 1, overflow: 'hidden' }}>
        <div className="panel" style={{ overflowY: 'auto' }}>
          <div className="panel-header">Recent Jobs</div>
          {jobs.length === 0 ? <div className="text-muted font-mono text-sm">No jobs.</div> : null}
          {jobs.map(job => (
            <div 
              key={job.id} 
              className={`p-4 mb-2 cursor-pointer font-mono text-sm border-b ${selectedJobId === job.id ? 'bg-hover' : ''}`}
              onClick={() => setSelectedJobId(job.id)}
              style={{ borderBottom: '1px solid var(--border-color)' }}
            >
              <div className="flex justify-between items-center mb-2">
                <span>{job.id}</span>
                <span className="badge badge-outline">{job.status === 'RUNNING' ? '■ RUNNING' : '✓ COMPLETED'}</span>
              </div>
              <div className="text-muted text-xs">{job.scenarioId}</div>
              <div className="text-muted text-xs mt-1">{new Date(job.startedAt).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>

        <div className="panel" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            Job Logs {selectedJob ? `- ${selectedJob.id}` : ''}
          </div>
          
          <div className="terminal-container" style={{ flex: 1, marginTop: '1rem', border: '1px solid var(--border-color)', borderRadius: '0' }}>
            {!selectedJob ? (
              <div className="text-muted">Select a job to view logs.</div>
            ) : (
              selectedJob.logs.map((log, idx) => (
                <div key={idx} className="terminal-line">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioExecution;
