import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  Globe, 
  GitBranch, 
  FileCode, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Layers, 
  Lock, 
  Terminal, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

const ScreeningCenter = () => {
  const [targetType, setTargetType] = useState('APPLICATION'); // 'APPLICATION' | 'WEBSITE' | 'GITHUB'
  const [inputVal, setInputVal] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const isInvalidUrl = (url) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname;
      const forbidden = ['localhost', '127.0.0.1', '0.0.0.0'];
      return forbidden.includes(host) || host.endsWith('.local');
    } catch {
      return true;
    }
  };

  const validateFile = (f) => {
    const supportedTypes = ['zip', 'tar', 'gz', 'apk', 'ipa', 'exe', 'msi', 'pdf', 'json', 'jar', 'war', 'wasm'];
    const ext = f.name.split('.').pop().toLowerCase();
    if (!supportedTypes.includes(ext)) {
      return `Unsupported file format (.${ext}). Supported: ZIP, TAR, APK, EXE, MSI, JSON, JAR, WASM, PDF.`;
    }
    return null;
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      const err = validateFile(dropped);
      if (err) {
        setError(err);
      } else {
        setError('');
        setFile(dropped);
      }
    }
  };

  const handleStart = () => {
    setError('');
    let valid = false;

    if (targetType === 'APPLICATION') {
      if (!file) {
        setError('Please select or upload an application package/binary to initiate screening.');
        return;
      }
      const fileErr = validateFile(file);
      if (fileErr) {
        setError(fileErr);
        return;
      }
      valid = true;
    } else if (targetType === 'WEBSITE') {
      if (!inputVal.trim()) {
        setError('Please enter a target website URL (e.g., https://app.example.com).');
        return;
      }
      const urlWithProtocol = inputVal.startsWith('http://') || inputVal.startsWith('https://') 
        ? inputVal.trim() 
        : `https://${inputVal.trim()}`;
      if (isInvalidUrl(urlWithProtocol)) {
        setError('The specified URL is unreachable or points to restricted local networks.');
        return;
      }
      valid = true;
    } else if (targetType === 'GITHUB') {
      if (!inputVal.trim()) {
        setError('Please provide a repository link or report URL.');
        return;
      }
      if (!inputVal.toLowerCase().includes('github.com') && !inputVal.toLowerCase().includes('gitlab.com')) {
        setError('Please enter a valid Git repository URL (e.g., https://github.com/org/repo).');
        return;
      }
      valid = true;
    }

    if (valid) {
      const screeningId = `SCREEN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const targetDisplay = targetType === 'APPLICATION' 
        ? file.name 
        : (inputVal.startsWith('http://') || inputVal.startsWith('https://') ? inputVal.trim() : `https://${inputVal.trim()}`);
      
      const session = {
        id: screeningId,
        type: targetType,
        target: targetDisplay,
        targetMeta: {
          fileSize: file ? `${(file.size / 1024).toFixed(1)} KB` : null,
          fileName: file ? file.name : null,
          protocol: targetType !== 'APPLICATION' ? (targetDisplay.startsWith('https') ? 'HTTPS' : 'HTTP') : 'N/A',
          timestamp: new Date().toISOString()
        },
        status: 'INITIALIZING',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(`screening_${screeningId}`, JSON.stringify(session));
      navigate(`/screening/${screeningId}`);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Top Banner / System Status Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.85rem 1.25rem',
        backgroundColor: '#050608',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="live-indicator"></div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>NEXORA CENTRAL SECURITY ASSESSMENT HUB</span>
          <span className="badge" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
            ENGINE ACTIVE
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>PIPELINE: <strong style={{ color: 'var(--text-main)' }}>11 AUTOMATED VERIFICATION STAGES</strong></span>
          <span>MODE: <strong style={{ color: 'var(--text-main)' }}>NON-DESTRUCTIVE SIMULATION</strong></span>
        </div>
      </div>

      {/* Main Hero & Screening Selector Panel */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            color: 'var(--accent-cyan)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '1rem'
          }}>
            <Cpu size={14} /> MULTI-VECTOR TARGET SCREENING
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.85rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            Central Security Assessment & Screening
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Submit an application binary, web service URL, or repository report to trigger a simulated 11-stage deep inspection with live flowchart tracking, CLI command telemetry, and architecture discovery.
          </p>
        </div>

        {/* Target Category Tabs */}
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '1.75rem'
          }}>
            <button
              onClick={() => { setTargetType('APPLICATION'); setError(''); }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1.15rem 1rem',
                backgroundColor: targetType === 'APPLICATION' ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-card)',
                border: `1.5px solid ${targetType === 'APPLICATION' ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                borderRadius: '8px',
                color: targetType === 'APPLICATION' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              <FileCode size={24} color={targetType === 'APPLICATION' ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: targetType === 'APPLICATION' ? 'var(--text-main)' : 'inherit' }}>
                Application File
              </div>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Binaries, APK, ZIP, EXE</span>
            </button>

            <button
              onClick={() => { setTargetType('WEBSITE'); setError(''); }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1.15rem 1rem',
                backgroundColor: targetType === 'WEBSITE' ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-card)',
                border: `1.5px solid ${targetType === 'WEBSITE' ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                borderRadius: '8px',
                color: targetType === 'WEBSITE' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              <Globe size={24} color={targetType === 'WEBSITE' ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: targetType === 'WEBSITE' ? 'var(--text-main)' : 'inherit' }}>
                Website / Web App
              </div>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>HTTP / HTTPS Endpoints</span>
            </button>

            <button
              onClick={() => { setTargetType('GITHUB'); setError(''); }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1.15rem 1rem',
                backgroundColor: targetType === 'GITHUB' ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-card)',
                border: `1.5px solid ${targetType === 'GITHUB' ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                borderRadius: '8px',
                color: targetType === 'GITHUB' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              <GitBranch size={24} color={targetType === 'GITHUB' ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: targetType === 'GITHUB' ? 'var(--text-main)' : 'inherit' }}>
                GitHub Repo / Report
              </div>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Source Repos & Security Reports</span>
            </button>
          </div>

          {/* Upload Input Area */}
          <div style={{
            backgroundColor: '#050608',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '2rem',
            position: 'relative'
          }}>
            {targetType === 'APPLICATION' ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                style={{
                  border: `2px dashed ${isDragging ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                  borderRadius: '6px',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  backgroundColor: isDragging ? 'rgba(6, 182, 212, 0.05)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <UploadCloud size={44} color={isDragging ? 'var(--accent-cyan)' : 'var(--text-muted)'} style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  {file ? file.name : 'Drag & drop your application binary or archive'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  Supports ZIP, TAR, APK, EXE, MSI, JSON, JAR, WASM (Max size: 100MB)
                </p>
                
                <input
                  type="file"
                  id="target-file-input"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const selected = e.target.files[0];
                      const err = validateFile(selected);
                      if (err) setError(err);
                      else {
                        setError('');
                        setFile(selected);
                      }
                    }
                  }}
                />
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
                  <label htmlFor="target-file-input" className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                    <FileCheck size={16} /> {file ? 'Change File' : 'Browse Local Files'}
                  </label>
                  {file && (
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      style={{ color: 'var(--status-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      onClick={() => setFile(null)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                {file && (
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    textAlign: 'left',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1rem',
                    fontSize: '0.8rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>File Size:</span>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Format:</span>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                        {file.name.split('.').pop().toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Integrity Check:</span>
                      <div style={{ fontWeight: 600, color: 'var(--status-success)', marginTop: '0.2rem' }}>
                        CHECKSUM READY
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Pipeline Status:</span>
                      <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
                        READY TO SCREEN
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                  {targetType === 'WEBSITE' ? 'Target Website Endpoint URL' : 'Git Repository Link or Report Link'}
                </label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input
                      type="text"
                      className="input-field"
                      style={{ paddingLeft: '2.5rem', fontSize: '0.95rem' }}
                      placeholder={targetType === 'WEBSITE' ? 'https://example-saas-platform.com' : 'https://github.com/organization/production-core-service'}
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                    />
                    <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                      {targetType === 'WEBSITE' ? <Globe size={18} /> : <GitBranch size={18} />}
                    </div>
                  </div>
                  {inputVal && (
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => setInputVal('')}
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Presets:</span>
                  <button 
                    type="button"
                    onClick={() => setInputVal(targetType === 'WEBSITE' ? 'https://cloud-api.enterprise-demo.io' : 'https://github.com/nexora-sec/financial-microservices-mesh')}
                    className="badge" 
                    style={{ cursor: 'pointer', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--accent-cyan)' }}
                  >
                    {targetType === 'WEBSITE' ? 'Live Cloud API Demo' : 'Core Microservice Repo'}
                  </button>
                </div>
              </div>
            )}

            {/* Error Notification */}
            {error && (
              <div style={{
                marginTop: '1.25rem',
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                color: '#f87171',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Screening & Get Reports Trigger Button */}
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button
                onClick={handleStart}
                className="btn btn-primary"
                style={{
                  padding: '0.9rem 2.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  borderRadius: '6px',
                  boxShadow: '0 4px 16px rgba(6, 182, 212, 0.25)',
                  cursor: 'pointer'
                }}
              >
                Screening & Get Reports <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Pipeline Information Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-cyan)' }}>
            <Layers size={22} />
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>11-Stage Flowchart Pipeline</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Automated walkthrough starting from target identification, dependency extraction, static structural inspection, to vulnerability validation and risk correlation.
          </p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--status-info)' }}>
            <Terminal size={22} />
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Real-Time CLI & Architecture</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Watch dynamic terminal execution commands scroll alongside live interactive architecture mapping highlighting discovered system layers in real time.
          </p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--status-success)' }}>
            <ShieldCheck size={22} />
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>Actionable Proofs & Cache Clear</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Review concrete vulnerability proofs, affected components, and security recommendations with a dedicated button to purge temporary session cache memory.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScreeningCenter;

