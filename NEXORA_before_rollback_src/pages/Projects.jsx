import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Projects = () => {
  const { engineState, engine } = useAppContext();
  const [selectedProject, setSelectedProject] = useState(engineState.projects[0]);

  const handleRemove = (scenarioId) => {
    if (window.confirm('Remove scenario from project?')) {
      engine.removeScenarioFromProject(scenarioId, selectedProject.id);
      setSelectedProject(engine.state.projects.find(p => p.id === selectedProject.id));
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">PROJECTS</h1>
      </div>

      <div className="grid-3 mb-6">
        <div className="panel" style={{ padding: 0 }}>
          <div className="panel-header" style={{ padding: '1rem', margin: 0 }}>Select Project</div>
          {engineState.projects.map(p => (
            <div 
              key={p.id} 
              className={`p-4 cursor-pointer border-b border-color ${selectedProject?.id === p.id ? 'bg-hover' : ''}`}
              onClick={() => setSelectedProject(p)}
              style={{ borderLeft: selectedProject?.id === p.id ? '2px solid var(--border-color)' : '2px solid transparent' }}
            >
              <div className="font-bold">{p.name}</div>
              <div className="text-muted text-xs font-mono mt-1">{p.id}</div>
            </div>
          ))}
        </div>

        <div className="panel" style={{ gridColumn: 'span 2' }}>
          {selectedProject ? (
            <>
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-color" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div className="text-muted text-xs font-mono mb-1">PROJECT</div>
                  <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                  <p className="text-muted mt-2">{selectedProject.description}</p>
                </div>
                <div className="font-mono text-sm text-right">
                  <div className="mb-1">SCENARIOS: {selectedProject.scenarios.length}</div>
                </div>
              </div>
              
              <h3 className="font-bold mb-4">Assigned Scenarios</h3>
              {selectedProject.scenarios.length === 0 ? (
                <div className="text-muted font-mono text-sm">No scenarios assigned. Go to Scenario Library to add scenarios.</div>
              ) : (
                <div className="data-table-wrapper">
                  <table className="data-table font-mono">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProject.scenarios.map(scId => {
                        const sc = engineState.scenarios.find(s => s.id === scId);
                        if (!sc) return null;
                        return (
                          <tr key={sc.id}>
                            <td>{sc.id}</td>
                            <td>{sc.name}</td>
                            <td>
                              <button className="btn btn-secondary text-xs" onClick={() => handleRemove(sc.id)}>REMOVE</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="text-muted font-mono text-sm">Select a project to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
