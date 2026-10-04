import React from 'react';
import { useAppContext } from '../context/AppContext';

const Reports = () => {
  const { engineState } = useAppContext();
  const { metrics, validations, incidents } = engineState;

  const detectionCoverage = metrics.testedTechniques > 0 
    ? Math.round((metrics.detectedTechniques / metrics.testedTechniques) * 100) 
    : 0;
  
  const passRate = validations.length > 0
    ? Math.round((validations.filter(v => v.result === 'PASS').length / validations.length) * 100)
    : 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">SECURITY ASSESSMENT REPORT</h1>
      </div>

      <div className="panel mb-4 bg-hover font-mono text-sm border-l-4" style={{ borderLeft: '1px solid var(--border-color)' }}>
        <strong>DISCLAIMER:</strong> SIMULATION DATA. NOT A PRODUCTION SECURITY ASSESSMENT.
      </div>

      <div className="panel mb-6">
        <h2 className="font-bold text-xl mb-4 border-b border-color pb-2">Executive Summary</h2>
        <div className="grid-3 mb-6">
          <div>
            <div className="text-muted text-xs uppercase">Detection Coverage</div>
            <div className="text-2xl font-mono">{detectionCoverage}%</div>
          </div>
          <div>
            <div className="text-muted text-xs uppercase">Validation Pass Rate</div>
            <div className="text-2xl font-mono">{passRate}%</div>
          </div>
          <div>
            <div className="text-muted text-xs uppercase">Techniques Tested</div>
            <div className="text-2xl font-mono">{metrics.testedTechniques}</div>
          </div>
        </div>
        <p className="text-muted font-mono text-sm leading-relaxed">
          This report summarizes the automated validation of security controls against simulated threat scenarios. 
          The validation covered {metrics.testedTechniques} ATT&CK techniques, generating {incidents.length} incidents and 
          yielding a {passRate}% overall validation pass rate.
        </p>
      </div>

      <div className="grid-2 gap-6">
        <div className="panel">
          <h2 className="font-bold text-lg mb-4 border-b border-color pb-2">Validation Results</h2>
          {validations.length === 0 ? (
            <div className="text-muted font-mono text-sm">No validations recorded.</div>
          ) : (
            <div className="font-mono text-sm">
              {validations.map(v => (
                <div key={v.id} className="flex justify-between items-center mb-2 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <div>
                    <div>{v.scenarioId}</div>
                    <div className="text-muted text-xs">{new Date(v.timestamp).toLocaleString()}</div>
                  </div>
                  <span className="badge badge-outline">{v.result === 'PASS' ? '✓ PASS' : '✕ FAIL'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <h2 className="font-bold text-lg mb-4 border-b border-color pb-2">Incidents Generated</h2>
          {incidents.length === 0 ? (
            <div className="text-muted font-mono text-sm">No incidents recorded.</div>
          ) : (
            <div className="font-mono text-sm">
              {incidents.map(i => (
                <div key={i.id} className="flex justify-between items-center mb-2 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <div>
                    <div>{i.id}</div>
                    <div className="text-muted text-xs">{i.scenarioId}</div>
                  </div>
                  <span className="badge badge-outline">[{i.severity}]</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
