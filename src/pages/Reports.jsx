import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Download, Printer } from 'lucide-react';

const Reports = () => {
  const { validations, incidents } = useAppContext();
  const [showReport, setShowReport] = useState(false);

  const passed = validations.filter(v => v.result === 'PASSED').length;
  const total = validations.length;
  const score = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={28} color="var(--accent-cyan)" />
          Reports
        </h1>
      </div>

      {!showReport ? (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
          <FileText size={64} color="var(--text-muted)" style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
          <h2 style={{ marginBottom: '1rem' }}>Generate Validation Report</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Generate a comprehensive executive summary of the simulated project execution, including all validations, incidents, and security posture metrics.
          </p>
          <button className="btn btn-primary" onClick={() => setShowReport(true)}>
            Create Report
          </button>
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '2rem' }}>
            <button className="btn btn-secondary" onClick={() => setShowReport(false)}>
              Close
            </button>
            <button className="btn btn-secondary" onClick={() => window.print()}>
              <Printer size={16} /> Print
            </button>
            <button className="btn btn-primary">
              <Download size={16} /> Export PDF
            </button>
          </div>

          <div style={{ padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-dark)' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
              <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '2px' }}>NEXORA</h1>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: 400 }}>Security Validation Executive Summary</h2>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Generated: {new Date().toLocaleString()}</p>
              <div style={{ marginTop: '1rem', display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--status-warning)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                SIMULATED DATA
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.125rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Metrics Overview</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Total Scenarios Validated:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{total}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Passed Validations:</span>
                    <strong style={{ color: 'var(--status-success)' }}>{passed}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Incidents Generated:</span>
                    <strong style={{ color: 'var(--status-danger)' }}>{incidents.length}</strong>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>Overall Security Score:</span>
                    <strong style={{ color: score >= 80 ? 'var(--status-success)' : 'var(--status-danger)', fontSize: '1.25rem' }}>{score}%</strong>
                  </li>
                </ul>
              </div>
              
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.125rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Executive Summary</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  This report summarizes the results of the recent security validation simulations. 
                  The simulation tested critical defenses against common MITRE ATT&CK techniques including Credential Access, Discovery, Execution, and Privilege Escalation.
                  <br/><br/>
                  Based on the localized simulation results, {score >= 80 ? 'the security controls are performing optimally.' : 'several security controls failed to detect simulated malicious activity. Immediate remediation is recommended.'}
                </p>
              </div>
            </div>

            <h3 style={{ fontSize: '1.125rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Validation Details</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.75rem', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>Scenario</th>
                  <th style={{ padding: '0.75rem', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>Technique</th>
                  <th style={{ padding: '0.75rem', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>Result</th>
                </tr>
              </thead>
              <tbody>
                {validations.map((v, i) => (
                  <tr key={i}>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-main)', fontWeight: 500 }}>{v.scenarioName}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>{v.technique}</td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)', color: v.result === 'PASSED' ? 'var(--status-success)' : 'var(--status-danger)', fontWeight: 'bold' }}>{v.result}</td>
                  </tr>
                ))}
                {validations.length === 0 && (
                  <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No validation data available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
