import React from 'react';
import { Server } from 'lucide-react';

const mockProcesses = [
  { pid: 1024, name: 'svchost.exe', user: 'SYSTEM', host: 'WIN-APP-01', cpu: '0.1%', mem: '14MB', cmd: 'C:\\Windows\\system32\\svchost.exe -k DcomLaunch', status: 'Running', detection: 'Clean' },
  { pid: 3492, name: 'explorer.exe', user: 'Admin', host: 'WIN-APP-01', cpu: '1.2%', mem: '124MB', cmd: 'C:\\Windows\\Explorer.EXE', status: 'Running', detection: 'Clean' },
  { pid: 5190, name: 'powershell.exe', user: 'Admin', host: 'WIN-APP-01', cpu: '14.5%', mem: '88MB', cmd: 'powershell.exe -NoP -NonI -W Hidden -Enc JABz...', status: 'Running', detection: 'Detected' },
  { pid: 821, name: 'python3', user: 'root', host: 'LNX-DB-02', cpu: '0.5%', mem: '45MB', cmd: '/usr/bin/python3 /opt/service/main.py', status: 'Running', detection: 'Clean' },
  { pid: 8842, name: 'nmap', user: 'root', host: 'LNX-GW-01', cpu: '22.0%', mem: '18MB', cmd: 'nmap -sS -p- 192.168.1.0/24', status: 'Terminated', detection: 'Detected' },
];

const Processes = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Server size={28} color="var(--accent-cyan)" />
          Monitored Processes
        </h1>
      </div>

      <div className="card">
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Simulated active processes collected from agent endpoints.
        </p>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>PID</th>
                <th>Process Name</th>
                <th>User</th>
                <th>Host</th>
                <th>CPU</th>
                <th>Memory</th>
                <th>Command Line</th>
                <th>Status</th>
                <th>Detection</th>
              </tr>
            </thead>
            <tbody>
              {mockProcesses.map((p, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-muted)' }}>{p.pid}</td>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td>{p.user}</td>
                  <td>{p.host}</td>
                  <td>{p.cpu}</td>
                  <td>{p.mem}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.cmd}>
                    {p.cmd}
                  </td>
                  <td>{p.status}</td>
                  <td>
                    <span className={`badge badge-${p.detection === 'Detected' ? 'danger' : 'success'}`}>
                      {p.detection}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Processes;
