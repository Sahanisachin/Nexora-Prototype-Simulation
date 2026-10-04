import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScreeningCenter = () => {
  const [targetType, setTargetType] = useState('APPLICATION');
  const [inputVal, setInputVal] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const styles = {
    container: {
      backgroundColor: '#000000',
      color: '#FFFFFF',
      fontFamily: '"JetBrains Mono", monospace',
      minHeight: 'calc(100vh - 64px)',
      padding: '2rem',
      boxSizing: 'border-box'
    },
    systemHeader: {
      border: '1px solid #333333',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '2rem',
      fontSize: '0.875rem'
    },
    panel: {
      border: '1px solid #333333',
      padding: '2rem',
      marginBottom: '2rem',
      backgroundColor: '#050505'
    },
    header: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      borderBottom: '1px solid #333333',
      paddingBottom: '0.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    },
    button: {
      backgroundColor: '#000000',
      color: '#A0A0A0',
      border: '1px solid #333333',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: '0.875rem'
    },
    buttonActive: {
      backgroundColor: '#FFFFFF',
      color: '#000000'
    },
    input: {
      width: '100%',
      backgroundColor: '#000000',
      color: '#FFFFFF',
      border: '1px solid #333333',
      padding: '0.75rem',
      fontFamily: 'inherit',
      fontSize: '1rem',
      outline: 'none'
    },
    error: {
      color: '#FFFFFF',
      border: '1px solid #FFFFFF',
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      padding: '1rem',
      marginTop: '1rem'
    }
  };

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
    const supportedTypes = ['zip', 'tar', 'gz', 'apk', 'ipa', 'exe', 'msi', 'pdf', 'json'];
    const ext = f.name.split('.').pop().toLowerCase();
    if (!supportedTypes.includes(ext)) {
      return 'UNSUPPORTED INPUT TYPE';
    }
    return null;
  };

  const handleStart = () => {
    setError('');
    let valid = false;

    if (targetType === 'APPLICATION') {
      if (!file) {
        setError('The supplied file is missing.');
        return;
      }
      const fileErr = validateFile(file);
      if (fileErr) {
        setError(fileErr);
        return;
      }
      valid = true;
    } else if (targetType === 'WEBSITE') {
      if (!inputVal) {
        setError('The supplied URL is missing.');
        return;
      }
      if (isInvalidUrl(inputVal)) {
        setError('The supplied URL is invalid.');
        return;
      }
      valid = true;
    } else if (targetType === 'GITHUB') {
      if (!inputVal) {
        setError('The supplied URL is missing.');
        return;
      }
      if (!inputVal.includes('github.com')) {
        setError('The supplied URL is invalid.');
        return;
      }
      valid = true;
    }

    if (valid) {
      const screeningId = `SCREEN-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random()*9000)}`;
      const session = {
        id: screeningId,
        type: targetType,
        target: targetType === 'APPLICATION' ? file.name : inputVal,
        status: 'INITIALIZING',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(`screening_${screeningId}`, JSON.stringify(session));
      
      navigate(`/screening/${screeningId}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.systemHeader}>
        <div>NEXORA</div>
        <div>SCREENING CENTER</div>
        <div style={{ color: '#A0A0A0' }}>SYSTEM: READY &nbsp;&nbsp;|&nbsp;&nbsp; SIMULATION MODE</div>
      </div>

      <div style={styles.panel}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', letterSpacing: '2px' }}>SECURITY SCREENING CENTER</h1>
          <p style={{ color: '#A0A0A0' }}>Analyze an application, website, or repository<br/>through the NEXORA security assessment pipeline.</p>
        </div>

        <div style={{ marginBottom: '1rem', color: '#A0A0A0', fontSize: '0.875rem' }}>TARGET TYPE</div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            style={{ ...styles.button, ...(targetType === 'APPLICATION' ? styles.buttonActive : {}) }}
            onClick={() => { setTargetType('APPLICATION'); setInputVal(''); setFile(null); setError(''); }}
          >
            APPLICATION FILE
          </button>
          <button 
            style={{ ...styles.button, ...(targetType === 'WEBSITE' ? styles.buttonActive : {}) }}
            onClick={() => { setTargetType('WEBSITE'); setInputVal(''); setFile(null); setError(''); }}
          >
            WEBSITE
          </button>
          <button 
            style={{ ...styles.button, ...(targetType === 'GITHUB' ? styles.buttonActive : {}) }}
            onClick={() => { setTargetType('GITHUB'); setInputVal(''); setFile(null); setError(''); }}
          >
            GITHUB / REPORT
          </button>
        </div>

        <div style={{ marginBottom: '1rem', color: '#A0A0A0', fontSize: '0.875rem' }}>TARGET</div>
        <div style={{ border: '1px solid #333333', padding: '2rem', textAlign: 'center' }}>
          {targetType === 'APPLICATION' ? (
            <div>
              <p style={{ color: '#A0A0A0', marginBottom: '1rem' }}>Upload application file</p>
              <input 
                type="file" 
                id="file-upload" 
                style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files[0])} 
              />
              <label htmlFor="file-upload" style={{ ...styles.button, display: 'inline-block' }}>
                BROWSE
              </label>
              {file && (
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', textAlign: 'left', display: 'inline-block' }}>
                  <div style={{ color: '#A0A0A0' }}>Filename: <span style={{ color: '#FFFFFF' }}>{file.name}</span></div>
                  <div style={{ color: '#A0A0A0' }}>Size: <span style={{ color: '#FFFFFF' }}>{Math.round(file.size / 1024)} KB</span></div>
                  <div style={{ color: '#A0A0A0' }}>Type: <span style={{ color: '#FFFFFF' }}>{file.name.split('.').pop().toUpperCase()}</span></div>
                  <div style={{ color: '#A0A0A0' }}>SHA-256: <span style={{ color: '#FFFFFF' }}>PENDING</span></div>
                  <div style={{ color: '#A0A0A0' }}>Upload status: <span style={{ color: '#FFFFFF' }}>READY FOR SCREENING</span></div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p style={{ color: '#A0A0A0', marginBottom: '1rem' }}>{targetType === 'WEBSITE' ? 'Enter website URL' : 'Enter GitHub link'}</p>
              <input 
                style={styles.input} 
                placeholder={targetType === 'WEBSITE' ? "https://example.com" : "https://github.com/user/project"}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              {inputVal && !error && (
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', textAlign: 'left', display: 'inline-block' }}>
                  <div style={{ color: '#A0A0A0' }}>TARGET: <span style={{ color: '#FFFFFF' }}>{inputVal}</span></div>
                  <div style={{ color: '#A0A0A0' }}>PROTOCOL: <span style={{ color: '#FFFFFF' }}>{inputVal.startsWith('https') ? 'HTTPS' : 'HTTP'}</span></div>
                  <div style={{ color: '#A0A0A0' }}>STATUS: <span style={{ color: '#FFFFFF' }}>READY FOR SCREENING</span></div>
                  <div style={{ color: '#A0A0A0' }}>WEB ASSESSMENT MODE: <span style={{ color: '#FFFFFF' }}>SIMULATED</span></div>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div style={styles.error}>
            <strong>TARGET ERROR</strong><br/><br/>
            {error}<br/><br/>
            <button style={{...styles.button, padding: '0.25rem 0.5rem', marginTop: '0.5rem'}} onClick={() => setError('')}>[EDIT TARGET]</button>
          </div>
        )}

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <button style={{ ...styles.button, ...styles.buttonActive, padding: '1rem 2rem', fontSize: '1rem', fontWeight: 'bold' }} onClick={handleStart}>
            SCREENING & GET REPORTS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScreeningCenter;
