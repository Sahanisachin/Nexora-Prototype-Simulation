import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LiveScreening = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const [processEvents, setProcessEvents] = useState([]);
  const [findings, setFindings] = useState([]);
  const [architecture, setArchitecture] = useState([]);
  const [report, setReport] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const logsEndRef = useRef(null);

  const STAGES = [
    { id: 'TARGET', name: 'TARGET IDENTIFICATION', duration: 2500 },
    { id: 'DISCOVERY', name: 'ENVIRONMENT DISCOVERY', duration: 3500 },
    { id: 'ARCHITECTURE', name: 'ARCHITECTURE ANALYSIS', duration: 4000 },
    { id: 'STATIC', name: 'STATIC ANALYSIS', duration: 5500 },
    { id: 'DEPENDENCY', name: 'DEPENDENCY ANALYSIS', duration: 3500 },
    { id: 'SECURITY', name: 'SECURITY CONTROL ANALYSIS', duration: 6000 },
    { id: 'VULNERABILITY', name: 'VULNERABILITY ANALYSIS', duration: 5000 },
    { id: 'EVIDENCE', name: 'EVIDENCE COLLECTION', duration: 3500 },
    { id: 'RISK', name: 'RISK CORRELATION', duration: 3000 },
    { id: 'VALIDATION', name: 'VALIDATION', duration: 4000 },
    { id: 'REPORT', name: 'REPORT GENERATION', duration: 3000 }
  ];

  const styles = {
    container: { backgroundColor: '#000000', color: '#FFFFFF', fontFamily: '"JetBrains Mono", monospace', minHeight: 'calc(100vh - 64px)', padding: '1rem', boxSizing: 'border-box' },
    systemHeader: { border: '1px solid #333333', padding: '1rem', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.875rem' },
    panel: { border: '1px solid #333333', padding: '1.5rem', backgroundColor: '#050505', marginBottom: '1rem', position: 'relative' },
    header: { fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid #333333', paddingBottom: '0.5rem', color: '#FFFFFF' },
    cli: { backgroundColor: '#000000', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '0.875rem', height: '140px', overflowY: 'auto', border: '1px solid #333333', padding: '1rem' },
    flexGrid: { display: 'flex', gap: '1rem', alignItems: 'flex-start' },
    colLeft: { flex: '0 0 320px' },
    colRight: { flex: '1', display: 'flex', flexDirection: 'column', gap: '1rem' },
    badge: { border: '1px solid #333333', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#000000' },
    button: { backgroundColor: '#000000', color: '#A0A0A0', border: '1px solid #333333', padding: '0.5rem 1rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', transition: 'all 0.2s' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' },
    th: { borderBottom: '1px solid #333333', padding: '0.75rem 0.5rem', textTransform: 'uppercase', color: '#A0A0A0' },
    td: { borderBottom: '1px dashed #333333', padding: '0.75rem 0.5rem' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { border: '1px solid #333333', backgroundColor: '#050505', padding: '2rem', maxWidth: '500px', width: '100%' }
  };

  useEffect(() => {
    const saved = localStorage.getItem(`screening_${id}`);
    if (saved) {
      setSession(JSON.parse(saved));
    } else {
      navigate('/screening');
    }
  }, [id, navigate]);

  const getTime = () => new Date().toLocaleTimeString('en-US', { hour12: false });

  const addLog = (msg) => {
    setLogs(prev => [...prev, `${getTime()}  ${msg}`]);
  };

  const addEvent = (msg) => {
    setProcessEvents(prev => [...prev, `${getTime()} ${msg}`]);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  useEffect(() => {
    if (!session) return;
    if (currentStageIndex >= STAGES.length) return;

    let isMounted = true;
    const stage = STAGES[currentStageIndex];
    
    // Simulate events for the current stage
    let timeoutIds = [];
    
    if (stage.id === 'TARGET') {
      addLog(`nexora> screening start --target ${session.target} --mode ${session.type.toLowerCase()}`);
      addLog(`[TARGET] ${session.target}`);
      addEvent('Target received');
      timeoutIds.push(setTimeout(() => addLog(`[TARGET] initializing target analysis`), 500));
      timeoutIds.push(setTimeout(() => addEvent('Input validated'), 1500));
      timeoutIds.push(setTimeout(() => setArchitecture([{ id: 'TARGET', name: 'TARGET' }]), 2000));
    }
    else if (stage.id === 'DISCOVERY') {
      addLog(`[DISCOVERY] initialized`);
      addEvent('Architecture discovery started');
      timeoutIds.push(setTimeout(() => addLog(`[DISCOVERY] analyzing connectivity and routing`), 1000));
      timeoutIds.push(setTimeout(() => addEvent('Target identified'), 2500));
    }
    else if (stage.id === 'ARCHITECTURE') {
      addLog(`[ARCHITECTURE] discovering components`);
      addEvent('Architecture detected');
      timeoutIds.push(setTimeout(() => {
        setArchitecture(prev => [...prev, { id: 'APP', name: session.type === 'APPLICATION' ? 'APP BINARY' : 'WEB APPLICATION' }]);
      }, 1500));
      timeoutIds.push(setTimeout(() => {
        setArchitecture(prev => [...prev, { id: 'DB', name: 'DATA LAYER' }]);
        addLog(`[ARCHITECTURE] mapped internal dependencies`);
      }, 3000));
    }
    else if (stage.id === 'STATIC') {
      addLog(`[STATIC] initialized`);
      timeoutIds.push(setTimeout(() => addLog(`[STATIC] extracting and analyzing structural metadata`), 1500));
      timeoutIds.push(setTimeout(() => addEvent('Static analysis completed'), 4500));
    }
    else if (stage.id === 'DEPENDENCY') {
      addLog(`[DEPENDENCY] initialized`);
      addEvent('Dependencies discovered');
      timeoutIds.push(setTimeout(() => addLog(`[DEPENDENCY] scanning known vulnerable packages`), 1500));
    }
    else if (stage.id === 'SECURITY') {
      addLog(`[SECURITY] evaluating controls`);
      addEvent('Security controls evaluated');
      timeoutIds.push(setTimeout(() => addLog(`[SECURITY] analyzing configurations`), 2000));
      timeoutIds.push(setTimeout(() => addLog(`[SECURITY] checking headers and encryption`), 4000));
    }
    else if (stage.id === 'VULNERABILITY') {
      addLog(`[VULNERABILITY] running active checks (simulated)`);
      timeoutIds.push(setTimeout(() => addEvent('Potential issue identified'), 2000));
      timeoutIds.push(setTimeout(() => addLog(`[VULNERABILITY] detecting potential weaknesses`), 3500));
    }
    else if (stage.id === 'EVIDENCE') {
      addLog(`[EVIDENCE] collecting supporting data`);
      addEvent('Evidence collected');
      timeoutIds.push(setTimeout(() => {
        const finding = { 
          id: 'FND-001', 
          title: 'Missing Security Headers / Content-Security-Policy', 
          severity: 'HIGH', 
          confidence: 'CONFIRMED',
          category: 'Security Misconfiguration',
          component: session.target, 
          status: 'UNDER REVIEW',
          evidence: "HTTP/1.1 200 OK\nServer: example\nMissing: Content-Security-Policy",
          impact: "Allows Cross-Site Scripting (XSS) and data injection attacks.",
          recommendation: "Implement a strict Content-Security-Policy header."
        };
        setFindings([finding]);
        addLog(`[EVIDENCE] collected artifacts for FND-001`);
        addEvent(`New finding generated: ${finding.id}`);
      }, 1500));
    }
    else if (stage.id === 'RISK') {
      addLog(`[RISK] correlating findings`);
      timeoutIds.push(setTimeout(() => addLog(`[RISK] calculating overall severity`), 1500));
    }
    else if (stage.id === 'VALIDATION') {
      addLog(`[VALIDATION] initialized`);
      timeoutIds.push(setTimeout(() => addLog(`[VALIDATION] verifying findings against baselines`), 1000));
      timeoutIds.push(setTimeout(() => {
        setFindings(prev => prev.map(f => ({ ...f, status: 'CONFIRMED' })));
        addLog(`[VALIDATION] FND-001 confirmed`);
      }, 2500));
    }
    else if (stage.id === 'REPORT') {
      addLog(`[REPORT] generating final report`);
      addEvent('Generating final report');
      timeoutIds.push(setTimeout(() => {
        addLog(`[REPORT] assessment completed.`);
        setReport({
          target: session.target,
          type: session.type,
          duration: '00:00:43',
          checks: 37,
          findingsTotal: findings.length > 0 ? findings.length : 1,
          high: 1, medium: 0, low: 0, confirmed: 1, potential: 0,
          limitations: 'SIMULATED. Only authorized testing was performed. Certain source-code level vulnerabilities could not be verified due to lack of internal access. Results represent a point-in-time snapshot.'
        });
      }, 2000));
    }

    const nextStageTimeout = setTimeout(() => {
      if (isMounted) {
        setCurrentStageIndex(prev => prev + 1);
      }
    }, stage.duration);
    
    return () => {
      isMounted = false;
      clearTimeout(nextStageTimeout);
      timeoutIds.forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStageIndex, session]);

  const confirmClear = () => {
    localStorage.removeItem(`screening_${id}`);
    navigate('/screening');
  };

  if (!session) return null;

  const isComplete = currentStageIndex >= STAGES.length;
  const progressPercent = Math.min(100, Math.round((currentStageIndex / STAGES.length) * 100));
  const progressBlocks = '█'.repeat(Math.floor(progressPercent / 5)) + '░'.repeat(20 - Math.floor(progressPercent / 5));

  return (
    <div style={styles.container}>
      {showClearModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#FFFFFF' }}>CLEAR SCREENING DATA</div>
            <p style={{ color: '#A0A0A0', marginBottom: '1rem' }}>This will remove:</p>
            <ul style={{ color: '#A0A0A0', marginBottom: '1.5rem', paddingLeft: '1.5rem', lineHeight: '1.5' }}>
              <li>Uploaded target metadata</li>
              <li>Temporary analysis results</li>
              <li>Screening events</li>
              <li>Temporary evidence</li>
              <li>Generated report data</li>
              <li>Local cache</li>
            </ul>
            <p style={{ color: '#A0A0A0', marginBottom: '1rem' }}>It will NOT remove:</p>
            <ul style={{ color: '#A0A0A0', marginBottom: '2rem', paddingLeft: '1.5rem', lineHeight: '1.5' }}>
              <li>Projects</li>
              <li>Existing scenarios</li>
              <li>Historical records</li>
              <li>Application configuration</li>
            </ul>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button style={styles.button} onClick={() => setShowClearModal(false)}>CANCEL</button>
              <button style={{ ...styles.button, backgroundColor: '#FFFFFF', color: '#000000' }} onClick={confirmClear}>CLEAR DATA</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.systemHeader}>
        <div>NEXORA SCREENING</div>
        <div style={{ color: '#A0A0A0' }}>
          SCREENING ID: <span style={{ color: '#FFFFFF' }}>{id}</span>
        </div>
        <div style={{ color: '#A0A0A0' }}>
          TARGET: <span style={{ color: '#FFFFFF' }}>{session.target}</span>
        </div>
        <div style={{ color: '#A0A0A0' }}>
          STATUS: <span style={{ color: '#FFFFFF' }}>{isComplete ? 'COMPLETED' : 'ANALYZING'}</span>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={styles.cli}>
          {logs.map((l, i) => <div key={i}>{l}</div>)}
          <div ref={logsEndRef} />
        </div>
      </div>

      {!report ? (
        <div style={styles.flexGrid}>
          {/* FLOWCHART */}
          <div style={{ ...styles.panel, ...styles.colLeft }}>
            <div style={styles.header}>SCREENING FLOW</div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '0.5rem', color: '#A0A0A0', fontSize: '0.75rem' }}>SCREENING PROGRESS</div>
              <div style={{ wordBreak: 'break-all', color: '#FFFFFF' }}>{progressBlocks} {progressPercent}%</div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#A0A0A0' }}>Completed: {currentStageIndex} / {STAGES.length} stages</div>
            </div>
            
            <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '1px solid #333333' }}>
              {STAGES.map((stage, idx) => {
                let statusIcon = '○';
                let statusText = 'WAITING';
                let color = '#555555';
                
                if (idx < currentStageIndex) {
                  statusIcon = '✓';
                  statusText = 'COMPLETED';
                  color = '#A0A0A0';
                } else if (idx === currentStageIndex) {
                  statusIcon = '■';
                  statusText = '██████████ RUNNING';
                  color = '#FFFFFF';
                }

                return (
                  <div key={stage.id} style={{ marginBottom: '1.5rem', position: 'relative', color }}>
                    <div style={{ position: 'absolute', left: '-1.9rem', backgroundColor: '#050505', padding: '2px 0' }}>{statusIcon}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{stage.name}</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{statusText}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={styles.colRight}>
            <div style={styles.flexGrid}>
              {/* ARCHITECTURE */}
              <div style={{ ...styles.panel, flex: 1 }}>
                <div style={styles.header}>PROJECT ARCHITECTURE</div>
                <div style={{ paddingLeft: '1rem', borderLeft: '1px dashed #333333' }}>
                  {architecture.map(a => (
                    <div key={a.id} style={{ marginBottom: '1rem', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-1.5rem', color: '#A0A0A0' }}>├─</div>
                      <div style={styles.badge}>{a.name}</div>
                    </div>
                  ))}
                  {!isComplete && (
                    <div style={{ position: 'relative', marginTop: '1rem' }}>
                      <div style={{ position: 'absolute', left: '-1.5rem', color: '#333333' }}>├─</div>
                      <div style={{ color: '#A0A0A0', fontSize: '0.875rem' }}>◉ SCANNING...</div>
                    </div>
                  )}
                </div>
              </div>

              {/* PROCESS */}
              <div style={{ ...styles.panel, flex: 1 }}>
                <div style={styles.header}>LIVE PROCESS</div>
                <div style={{ fontSize: '0.75rem', height: '200px', overflowY: 'auto' }}>
                  {processEvents.map((evt, i) => (
                    <div key={i} style={{ marginBottom: '0.5rem', color: i === processEvents.length - 1 ? '#FFFFFF' : '#A0A0A0' }}>{evt}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* FINDINGS STREAM */}
            <div style={styles.panel}>
              <div style={styles.header}>LIVE FINDINGS</div>
              {findings.length === 0 ? (
                <div style={{ color: '#A0A0A0', fontSize: '0.875rem' }}>No findings identified yet...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {findings.map(f => (
                    <div key={f.id} style={{ border: '1px solid #333333', padding: '1rem', backgroundColor: '#000000' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 'bold' }}>{f.id} - {f.title}</div>
                        <div style={{ color: '#A0A0A0', fontSize: '0.75rem' }}>{f.status}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', marginBottom: '1rem' }}>
                        <div>Severity: <span style={{ color: '#FFFFFF' }}>{f.severity}</span></div>
                        <div>Category: <span style={{ color: '#FFFFFF' }}>{f.category}</span></div>
                        <div>Component: <span style={{ color: '#FFFFFF' }}>{f.component}</span></div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#A0A0A0', borderTop: '1px dashed #333333', paddingTop: '0.5rem' }}>
                        <div style={{ marginBottom: '0.25rem' }}>EVIDENCE:</div>
                        <pre style={{ margin: 0, fontFamily: 'inherit', color: '#FFFFFF' }}>{f.evidence}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* REPORT VIEW */
        <div style={styles.panel}>
          <div style={{...styles.header, display: 'flex', justifyContent: 'space-between'}}>
            <span>SCREENING COMPLETE</span>
            <span style={{ color: '#A0A0A0', fontSize: '0.875rem', fontWeight: 'normal' }}>ASSESSMENT REPORT</span>
          </div>
          
          <div style={{ display: 'flex', gap: '3rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #333333' }}>
            <div>
              <div style={{ color: '#A0A0A0', fontSize: '0.75rem', marginBottom: '0.5rem' }}>TARGET</div>
              <div>{report.target}</div>
            </div>
            <div>
              <div style={{ color: '#A0A0A0', fontSize: '0.75rem', marginBottom: '0.5rem' }}>DURATION</div>
              <div>{report.duration}</div>
            </div>
            <div>
              <div style={{ color: '#A0A0A0', fontSize: '0.75rem', marginBottom: '0.5rem' }}>CHECKS PERFORMED</div>
              <div>{report.checks}</div>
            </div>
            <div>
              <div style={{ color: '#A0A0A0', fontSize: '0.75rem', marginBottom: '0.5rem' }}>FINDINGS</div>
              <div>{report.findingsTotal}</div>
            </div>
            <div>
              <div style={{ color: '#A0A0A0', fontSize: '0.75rem', marginBottom: '0.5rem' }}>HIGH</div>
              <div style={{ color: '#FFFFFF' }}>{report.high}</div>
            </div>
            <div>
              <div style={{ color: '#A0A0A0', fontSize: '0.75rem', marginBottom: '0.5rem' }}>CONFIRMED</div>
              <div style={{ color: '#FFFFFF' }}>{report.confirmed}</div>
            </div>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #333333', display: 'inline-block', paddingBottom: '0.5rem', color: '#A0A0A0' }}>SECURITY FINDINGS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {findings.map(f => (
                <div key={f.id} style={{ border: '1px solid #333333', padding: '1.5rem', backgroundColor: '#000000' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px dashed #333333', paddingBottom: '0.5rem' }}>
                    <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{f.id}</div>
                    <div style={styles.badge}>{f.severity}</div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', fontSize: '0.875rem' }}>
                    <div style={{ color: '#A0A0A0' }}>Title</div>
                    <div>{f.title}</div>
                    
                    <div style={{ color: '#A0A0A0' }}>Confidence</div>
                    <div>{f.confidence}</div>
                    
                    <div style={{ color: '#A0A0A0' }}>Affected Component</div>
                    <div>{f.component}</div>

                    <div style={{ color: '#A0A0A0' }}>Impact</div>
                    <div>{f.impact}</div>

                    <div style={{ color: '#A0A0A0' }}>Recommendation</div>
                    <div>{f.recommendation}</div>
                  </div>
                  
                  <div style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
                    <div style={{ color: '#A0A0A0', marginBottom: '0.5rem' }}>Evidence</div>
                    <div style={{ border: '1px solid #333333', padding: '1rem', backgroundColor: '#050505', color: '#FFFFFF' }}>
                      <pre style={{ margin: 0, fontFamily: 'inherit' }}>{f.evidence}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '1.5rem', border: '1px solid #333333', color: '#A0A0A0', fontSize: '0.875rem', marginBottom: '2rem', backgroundColor: '#000000' }}>
            <strong style={{ color: '#FFFFFF' }}>ASSESSMENT LIMITATIONS</strong><br/><br/>
            {report.limitations}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button style={{ ...styles.button, backgroundColor: '#FFFFFF', color: '#000000' }}>DOWNLOAD REPORT</button>
            <button style={styles.button}>EXPORT PDF</button>
            <button style={styles.button}>ADD TO PROJECT</button>
            <button style={{ ...styles.button, border: '1px solid #555555', color: '#A0A0A0' }} onClick={() => setShowClearModal(true)}>
              CLEAR SCREENING DATA
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveScreening;
