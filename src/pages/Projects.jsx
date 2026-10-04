import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FolderKanban, Plus } from 'lucide-react';

const Projects = () => {
  const { projects } = useAppContext();
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FolderKanban size={28} color="var(--accent-cyan)" />
          Projects
        </h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(proj => (
                <tr key={proj.id}>
                  <td>{proj.id}</td>
                  <td style={{ fontWeight: 500 }}>{proj.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{proj.description}</td>
                  <td>
                    <span className={`badge badge-${proj.status === 'Active' ? 'success' : proj.status === 'Completed' ? 'info' : 'warning'}`}>
                      {proj.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(proj.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '400px' }}>
            <h2 style={{ marginBottom: '1rem' }}>Create Project</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Simulated new project creation.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
