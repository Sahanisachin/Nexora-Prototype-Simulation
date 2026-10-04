import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { CLIParser } from './services/CLIParser';

const Sidebar = () => {
  const location = useLocation();
  
  const navGroups = [
    {
      title: 'Overview',
      items: [
        { path: '/dashboard', label: 'Dashboard' }
      ]
    },
    {
      title: 'Projects',
      items: [
        { path: '/projects', label: 'Projects' },
        { path: '/scenarios', label: 'Scenario Library' }
      ]
    },
    {
      title: 'Operations',
      items: [
        { path: '/model-animation', label: 'Model Animation' },
        { path: '/simulations', label: 'Simulations' },
        { path: '/processes', label: 'Execution Jobs' }
      ]
    },
    {
      title: 'Security',
      items: [
        { path: '/telemetry', label: 'Telemetry' },
        { path: '/incidents', label: 'Incidents' },
        { path: '/hunting', label: 'Threat Hunting' },
        { path: '/validation', label: 'Validation' },
        { path: '/mitre', label: 'MITRE ATT&CK' }
      ]
    },
    {
      title: 'Reporting',
      items: [
        { path: '/reports', label: 'Reports' }
      ]
    },
    {
      title: 'Tools',
      items: [
        { path: '/terminal', label: 'Terminal' }
      ]
    },
    {
      title: 'System',
      items: [
        { path: '/status', label: 'System Status' },
        { path: '/audit', label: 'Audit Log' }
      ]
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        NEXORA <span className="text-xs text-muted">v2.0</span>
      </div>
      <div className="sidebar-nav">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-4">
            <div className="nav-section-title font-mono">{group.title}</div>
            {group.items.map(item => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link key={item.path} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const Topbar = () => {
  const { currentUser, logout, engine } = useAppContext();

  return (
    <div className="topbar">
      <div className="flex items-center gap-4">
        <span className="badge badge-inverted">◆ SIMULATION MODE</span>
        <button onClick={() => { if(window.confirm('Reset demo data?')) engine.reset(); }} className="btn text-xs">
          RESET DATA
        </button>
      </div>
      <div className="flex items-center gap-4 font-mono text-sm text-muted">
        <span>USER: <strong className="text-main">{currentUser.username}</strong></span>
        <span>ROLE: <strong className="text-main">{currentUser.role}</strong></span>
        <button onClick={logout} className="btn btn-secondary text-xs">LOGOUT</button>
      </div>
    </div>
  );
};

const CommandPalette = ({ open, setOpen }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" style={{ alignItems: 'flex-start', paddingTop: '10vh' }}>
      <div className="panel" style={{ width: '600px', padding: '1rem' }}>
        <input type="text" className="input-field font-mono" placeholder="> Type a command... (Press Esc to close)" autoFocus 
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
          }}
        />
        <div className="mt-4 text-xs text-muted font-mono">Available: scenario list, telemetry search, system status...</div>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  const { currentUser } = useAppContext();
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-container">
          {children}
        </div>
      </div>
      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
    </div>
  );
};

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Scenarios from './pages/Scenarios';
import ScenarioExecution from './pages/ScenarioExecution';
import Telemetry from './pages/Telemetry';
import Incidents from './pages/Incidents';
import ThreatHunting from './pages/ThreatHunting';
import Validation from './pages/Validation';
import Reports from './pages/Reports';
import SystemStatus from './pages/SystemStatus';
import Processes from './pages/Processes';
import TerminalPage from './pages/TerminalPage';
import ModelAnimation from './pages/ModelAnimation';

const DummyPage = ({ title }) => (
  <div className="panel"><h1 className="page-title">{title}</h1><p>Not implemented yet.</p></div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout><Navigate to="/dashboard" replace /></Layout>} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/projects" element={<Layout><Projects /></Layout>} />
      <Route path="/scenarios" element={<Layout><Scenarios /></Layout>} />
      <Route path="/scenarios/:id/execute" element={<Layout><ScenarioExecution /></Layout>} />
      <Route path="/execution" element={<Layout><ScenarioExecution /></Layout>} />
      <Route path="/processes" element={<Layout><ScenarioExecution /></Layout>} />
      <Route path="/simulations" element={<Layout><ScenarioExecution /></Layout>} />
      <Route path="/telemetry" element={<Layout><Telemetry /></Layout>} />
      <Route path="/incidents" element={<Layout><Incidents /></Layout>} />
      <Route path="/hunting" element={<Layout><ThreatHunting /></Layout>} />
      <Route path="/validation" element={<Layout><Validation /></Layout>} />
      <Route path="/mitre" element={<Layout><DummyPage title="MITRE ATT&CK" /></Layout>} />
      <Route path="/reports" element={<Layout><Reports /></Layout>} />
      <Route path="/status" element={<Layout><SystemStatus /></Layout>} />
      <Route path="/audit" element={<Layout><DummyPage title="Audit Log" /></Layout>} />
      <Route path="/terminal" element={<Layout><TerminalPage /></Layout>} />
      <Route path="/model-animation" element={<Layout><ModelAnimation /></Layout>} />
    </Routes>
  );
}

export default App;
