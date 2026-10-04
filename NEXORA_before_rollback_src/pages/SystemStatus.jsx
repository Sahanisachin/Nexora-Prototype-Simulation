import React from 'react';

const SystemStatus = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">SYSTEM STATUS</h1>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h2 className="font-bold mb-4">APPLICATION</h2>
          <table className="data-table font-mono text-sm">
            <tbody>
              <tr><td>Frontend</td><td className="text-right">● ONLINE</td></tr>
              <tr><td>Backend</td><td className="text-right">● ONLINE</td></tr>
              <tr><td>Data Store</td><td className="text-right">● ONLINE</td></tr>
              <tr><td>Simulation Engine</td><td className="text-right">● ONLINE</td></tr>
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h2 className="font-bold mb-4">SECURITY INTEGRATIONS</h2>
          <table className="data-table font-mono text-sm">
            <tbody>
              <tr><td>Falco</td><td className="text-right">◆ SIMULATED</td></tr>
              <tr><td>Zeek</td><td className="text-right">◆ SIMULATED</td></tr>
              <tr><td>Suricata</td><td className="text-right">◆ SIMULATED</td></tr>
              <tr><td>Kubernetes</td><td className="text-right text-muted">◇ NOT CONNECTED</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
