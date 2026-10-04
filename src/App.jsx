import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { LayoutDashboard, FolderKanban, FlaskConical, PlayCircle, Activity, ShieldAlert, Search, CheckSquare, FileText, Server, LogOut, Settings } from 'lucide-react';

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
import ModelAnimation from './pages/ModelAnimation';
import Processes from './pages/Processes';
import ScreeningCenter from './pages/ScreeningCenter';
import LiveScreening from './pages/LiveScreening';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAppContext();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/screening', label: 'Security Screening Center', icon: Search },
    { path: '/projects', label: 'Projects', icon: FolderKanban },
    { path: '/model-animation', label: 'Model Animation', icon: PlayCircle },
    { path: '/scenarios', label: 'Scenario Library', icon: FlaskConical },
    { path: '/telemetry', label: 'Telemetry', icon: Activity },
    { path: '/incidents', label: 'Incidents', icon: ShieldAlert },
    { path: '/hunting', label: 'Threat Hunting', icon: Search },
    { path: '/validation', label: 'Validation', icon: CheckSquare },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/processes', label: 'Processes', icon: Server },
    { path: '/status', label: 'System Status', icon: Settings },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <ShieldAlert size={28} />
        NEXORA
      </div>
      <div style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
        SECURITY CONSOLE
      </div>
      <div className="sidebar-nav">
        {navItems.map(item => (
          <Link key={item.path} to={item.path} className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}>
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="sidebar-nav" style={{ flex: 0 }}>
        <button className="nav-item" onClick={logout} style={{ width: '100%', background: 'none', border: '1px solid transparent', textAlign: 'left', cursor: 'pointer' }}>
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div>
            <span className="badge">Simulation Environment</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Logged in as: <strong style={{ color: 'var(--text-main)' }}>{currentUser.username}</strong></span>
          </div>
        </div>
        <div className="page-container">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout><Navigate to="/dashboard" replace /></Layout>} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/screening" element={<Layout><ScreeningCenter /></Layout>} />
      <Route path="/screening/:id" element={<Layout><LiveScreening /></Layout>} />
      <Route path="/projects" element={<Layout><Projects /></Layout>} />
      <Route path="/scenarios" element={<Layout><Scenarios /></Layout>} />
      <Route path="/scenarios/:id/execute" element={<Layout><ScenarioExecution /></Layout>} />
      <Route path="/telemetry" element={<Layout><Telemetry /></Layout>} />
      <Route path="/incidents" element={<Layout><Incidents /></Layout>} />
      <Route path="/hunting" element={<Layout><ThreatHunting /></Layout>} />
      <Route path="/validation" element={<Layout><Validation /></Layout>} />
      <Route path="/reports" element={<Layout><Reports /></Layout>} />
      <Route path="/processes" element={<Layout><Processes /></Layout>} />
      <Route path="/status" element={<Layout><SystemStatus /></Layout>} />
      <Route path="/model-animation" element={<Layout><ModelAnimation /></Layout>} />
    </Routes>
  );
}

export default App;
