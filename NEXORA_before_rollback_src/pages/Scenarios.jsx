import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Scenarios = () => {
  const { engineState, engine } = useAppContext();
  const navigate = useNavigate();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedProject, setSelectedProject] = useState(engineState.projects[0]?.id || '');
  const [addStatus, setAddStatus] = useState('');

  const handleRun = (scenarioId) => {
    engine.runScenario(scenarioId);
    navigate('/execution');
  };
  
  const openProjectModal = (scenarioId) => {
    setSelectedScenario(scenarioId);
    setAddStatus('');
    setModalOpen(true);
  };
  
  const handleAddToProject = () => {
    if (!selectedProject) return;
    const success = engine.addScenarioToProject(selectedScenario, selectedProject);
    if (success) {
      setAddStatus('✓ ADDED TO PROJECT');
      setTimeout(() => setModalOpen(false), 1500);
    } else {
      setAddStatus('! ALREADY IN PROJECT');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">SCENARIO LIBRARY</h1>
      </div>

      <div className="grid-2">
        {engineState.scenarios.map(sc => (
          <div key={sc.id} className="panel flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">{sc.name}</h2>
                <span className="badge badge-outline">[{sc.severity}]</span>
              </div>
              <div className="font-mono text-sm mb-4">
                <div className="text-muted text-xs uppercase mb-1">ATT&CK Map</div>
                <div className="mb-2">{sc.technique} | {sc.tactic}</div>
                
                <div className="text-muted text-xs uppercase mb-1 mt-4">Expected Detection</div>
                <div className="mb-2">{sc.expectedDetection}</div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 flex-col gap-2" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="font-mono text-xs mb-2">
                Status: {sc.status === 'RUNNING' ? '■ RUNNING' : sc.status === 'COMPLETED' ? '✓ COMPLETED' : '□ IDLE'}
              </div>
              <div className="flex gap-2">
                <button className="btn btn-secondary" onClick={() => openProjectModal(sc.id)}>ADD TO PROJECT</button>
                <button className="btn btn-secondary">VIEW</button>
                <button className="btn btn-primary" onClick={() => handleRun(sc.id)} disabled={sc.status === 'RUNNING'}>RUN</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {modalOpen && (
        <div className="modal-overlay">
          <div className="panel" style={{ width: '500px' }}>
            <h2 className="panel-header">ADD SCENARIO TO PROJECT</h2>
            
            <div className="mb-4">
              <div className="text-muted text-xs uppercase mb-1">Scenario</div>
              <div className="font-bold">{engineState.scenarios.find(s => s.id === selectedScenario)?.name}</div>
            </div>
            
            <div className="mb-6">
              <div className="text-muted text-xs uppercase mb-1">Select Project</div>
              <select 
                className="input-field" 
                value={selectedProject} 
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                {engineState.projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            
            {addStatus && <div className="font-mono text-sm mb-4">{addStatus}</div>}
            
            <div className="flex gap-2 justify-end mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>CANCEL</button>
              <button className="btn btn-primary" onClick={handleAddToProject}>ADD TO PROJECT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scenarios;
