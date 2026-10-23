import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Terminal, 
  Layers, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Database, 
  Server, 
  Globe, 
  ArrowRight, 
  Lock, 
  FileCode, 
  Cpu, 
  Trash2, 
  Download, 
  Printer, 
  Clock, 
  Activity, 
  RefreshCw,
  Search,
  Check,
  ChevronRight,
  ExternalLink,
  Code2,
  Bug,
  KeyRound
} from 'lucide-react';

const STAGES = [
  { id: 'TARGET', name: 'TARGET INGESTION', phase: 'Phase 1', duration: 3200, desc: 'Validating payload checksum, format boundaries, and protocol handshake' },
  { id: 'DISCOVERY', name: 'ENVIRONMENT DISCOVERY', phase: 'Phase 2', duration: 4200, desc: 'Detecting network routing, DNS zones, API gateways & ingress layers' },
  { id: 'ARCHITECTURE', name: 'TOPOLOGY EXTRACTION', phase: 'Phase 3', duration: 4500, desc: 'Mapping component boundaries, service mesh, microservices & datastores' },
  { id: 'STATIC', name: 'STATIC DEEP SCAN', phase: 'Phase 4', duration: 5200, desc: 'AST code parsing, hardcoded secrets search & dangerous API pattern matching' },
  { id: 'DEPENDENCY', name: 'SCA & DEPENDENCY MAP', phase: 'Phase 5', duration: 3800, desc: 'Cross-referencing package manifests against CVE/NVD vulnerability registries' },
  { id: 'SECURITY', name: 'SECURITY CONTROL AUDIT', phase: 'Phase 6', duration: 4800, desc: 'Verifying TLS configuration, CORS policies, CSP headers, rate-limiting & WAF rules' },
  { id: 'VULNERABILITY', name: 'EXPLOIT SURFACE PROBING', phase: 'Phase 7', duration: 5000, desc: 'Simulated fuzzing, authorization bypass checks & injection payload testing' },
  { id: 'EVIDENCE', name: 'EVIDENCE & PROOF EXTRACTION', phase: 'Phase 8', duration: 4200, desc: 'Capturing HTTP raw payloads, stack traces, decompiled snippets & reproduction steps' },
  { id: 'RISK', name: 'RISK & BLAST-RADIUS MODELING', phase: 'Phase 9', duration: 3600, desc: 'Correlating findings with MITRE ATT&CK enterprise tactics and CVSS v3.1 scoring' },
  { id: 'VALIDATION', name: 'FALSE-POSITIVE TRIAGE', phase: 'Phase 10', duration: 4000, desc: 'Executing secondary confirmation passes to confirm verified exploits' },
  { id: 'REPORT', name: 'EXECUTIVE & TECHNICAL AUDIT', phase: 'Phase 11', duration: 3400, desc: 'Compiling structured vulnerability proofs, architecture loopholes & remediation playbook' }
];

const ARCH_NODES = [
  { id: 'CLIENT', name: 'Client Ingress / Web Browser', type: 'CLIENT', icon: Globe, ip: '198.51.100.24', status: 'AUDITED' },
  { id: 'GATEWAY', name: 'API Gateway & Reverse Proxy (NGINX/Envoy)', type: 'GATEWAY', icon: Server, ip: '10.0.1.15', status: 'PENDING' },
  { id: 'APP', name: 'Core Microservice / Business Logic', type: 'APP', icon: Cpu, ip: '10.0.4.82', status: 'PENDING' },
  { id: 'AUTH', name: 'Identity & JWT Token Service', type: 'AUTH', icon: KeyRound, ip: '10.0.3.11', status: 'PENDING' },
  { id: 'DATABASE', name: 'PostgreSQL Datastore / Cache Cluster', type: 'DB', icon: Database, ip: '10.0.8.44', status: 'PENDING' }
];

const DETAILED_FINDINGS = [
  {
    id: 'VULN-2026-0819',
    title: 'Hardcoded AWS Production Access Keys in Client-Side Artifacts',
    severity: 'CRITICAL',
    cvss: '9.4',
    category: 'Credential Exposure / Secret Leakage',
    mitre: 'T1552.001 - Credentials in Files',
    component: 'App Ingress / bundle.vendor.js (Line 4182)',
    blastRadius: 'Direct unrestricted read/write access to S3 cold storage buckets and DynamoDB customer indexes.',
    description: 'Decompilation and static token extraction revealed active AWS API keys (`AKIA...`) embedded directly in configuration constants without KMS protection.',
    proofSnippet: `// EXTRACTED REPRODUCTION PROOF FROM COMPILED ARTIFACT:
const awsConfig = {
  region: "us-east-1",
  accessKeyId: "AKIAIOSFODNN7EXAMPLE",
  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY", // [CONFIRMED LEAK]
  bucket: "nexora-prod-customer-documents-2026"
};
// Status: LIVE & VALIDATED against AWS IAM STS verifyToken API`,
    remediation: 'Immediately revoke AKIA credentials in AWS IAM console. Rotate all secrets into an environment-managed secrets vault (AWS Secrets Manager or HashiCorp Vault) and configure automated git pre-commit hooks (TruffleHog/Gitleaks).'
  },
  {
    id: 'VULN-2026-0824',
    title: 'Broken Object-Level Authorization (BOLA) in REST User API',
    severity: 'HIGH',
    cvss: '8.6',
    category: 'Broken Access Control',
    mitre: 'T1068 - Exploitation for Privilege Escalation',
    component: 'REST Controller: /api/v2/tenants/{tenantId}/billing-records',
    blastRadius: 'Tenant boundary breach allowing unauthenticated horizontal data exfiltration across organizational accounts.',
    description: 'The endpoint retrieves billing statements based strictly on the URL query param `tenantId` without verifying whether the requesting Bearer session token belongs to that organization.',
    proofSnippet: `HTTP REQUEST PROOF:
GET /api/v2/tenants/TENANT-99120/billing-records HTTP/1.1
Host: api.target-platform.internal
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTQxIiwidGVuYW50SWQiOiJURU5BTlQtMDAxIn0...

RESPONSE (200 OK - CROSS-TENANT DATA LEAK):
{
  "tenantId": "TENANT-99120",
  "organization": "Defense Corp International",
  "invoiceTotal": "$482,000.00",
  "corporateCards": [{ "last4": "8812", "exp": "11/28" }]
}`,
    remediation: 'Enforce strict claims validation in the API gateway filter: cross-reference `claims.tenantId` against path parameter `tenantId` before dispatching to application logic.'
  },
  {
    id: 'VULN-2026-0831',
    title: 'Missing Content-Security-Policy (CSP) & Permissive CORS Wildcard',
    severity: 'MEDIUM',
    cvss: '6.5',
    category: 'Security Misconfiguration',
    mitre: 'T1189 - Drive-by Compromise',
    component: 'HTTP Response Headers (Reverse Proxy / Web Service)',
    blastRadius: 'Susceptible to cross-origin session hijacking, XSS DOM execution, and unauthorized iframe clickjacking.',
    description: 'The web service responds with `Access-Control-Allow-Origin: *` while omitting modern anti-tamper security headers.',
    proofSnippet: `HEADER AUDIT EVIDENCE:
HTTP/1.1 200 OK
Date: Mon, 12 Oct 2026 12:44:19 GMT
Access-Control-Allow-Origin: *                  <-- [LOOSE WILDCARD]
Access-Control-Allow-Credentials: true
X-Frame-Options: [MISSING]
Content-Security-Policy: [MISSING]
Strict-Transport-Security: [MISSING]`,
    remediation: 'Configure NGINX/Cloudflare to emit `Content-Security-Policy: default-src \'self\'; script-src \'self\'` and restrict `Access-Control-Allow-Origin` strictly to verified white-listed domains.'
  },
  {
    id: 'VULN-2026-0839',
    title: 'Vulnerable NPM Package Dependency: jsonwebtoken < 9.0.0 (CVE-2022-23529)',
    severity: 'MEDIUM',
    cvss: '6.1',
    category: 'Vulnerable Third-Party Component',
    mitre: 'T1195.002 - Vulnerable Software Component',
    component: 'package-lock.json (Dependency: jsonwebtoken@8.5.1)',
    blastRadius: 'Potential arbitrary code execution if untrusted keys are passed to verify function.',
    description: 'The project bundles an outdated version of `jsonwebtoken` containing a known prototype pollution / remote code execution flaw in `jwt.verify`.',
    proofSnippet: `DEPENDENCY TREE EVIDENCE:
├─ app-server@1.4.0
│  └─ auth-module@2.1.0
│     └─ jsonwebtoken@8.5.1  <-- [VULNERABLE: CVE-2022-23529, CVSS 7.6]
Fixed in: jsonwebtoken >= 9.0.0`,
    remediation: 'Run `npm audit fix` or upgrade `jsonwebtoken` to version 9.0.2 or migrate to modern standard Web Crypto API (`jose`).'
  }
];

const LiveScreening = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const [processEvents, setProcessEvents] = useState([]);
  const [findings, setFindings] = useState([]);
  const [archNodes, setArchNodes] = useState(ARCH_NODES);
  const [activeArchIndex, setActiveArchIndex] = useState(0);
  const [report, setReport] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const logsEndRef = useRef(null);
  const activeStage = STAGES[Math.min(currentStageIndex, STAGES.length - 1)];

  // Load session from localStorage
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
    setLogs(prev => [...prev, `${getTime()} [NEXORA-CORE] ${msg}`]);
  };

  const addEvent = (msg) => {
    setProcessEvents(prev => [...prev, { time: getTime(), msg }]);
  };

  // Auto-scroll CLI terminal
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Stage execution orchestrator
  useEffect(() => {
    if (!session) return;
    if (currentStageIndex >= STAGES.length) return;

    let isMounted = true;
    const stage = STAGES[currentStageIndex];
    let timeoutIds = [];

    // Cycle active architecture node based on stage progress
    const archIdx = Math.min(Math.floor((currentStageIndex / STAGES.length) * ARCH_NODES.length), ARCH_NODES.length - 1);
    setActiveArchIndex(archIdx);
    setArchNodes(prev => prev.map((node, i) => ({
      ...node,
      status: i < archIdx ? 'VERIFIED' : i === archIdx ? 'INSPECTING' : 'PENDING'
    })));

    // Emit live CLI outputs and events according to stage
    if (stage.id === 'TARGET') {
      addLog(`screening init --session-id=${session.id} --target="${session.target}" --type=${session.type}`);
      addLog(`Verifying payload integrity: SHA-256 calculated, stream decoded successfully.`);
      addEvent(`Payload received for ${session.target}`);
      timeoutIds.push(setTimeout(() => addLog(`Target confirmed: Protocol validation accepted.`), 1200));
      timeoutIds.push(setTimeout(() => addEvent(`Integrity checksum matched.`), 2200));
    } else if (stage.id === 'DISCOVERY') {
      addLog(`traceroute --target=${session.target} --probes=3 --timeout=150ms`);
      addLog(`Discovered network ingress: Gateway layer identified on edge.`);
      addEvent(`Ingress perimeter discovered.`);
      timeoutIds.push(setTimeout(() => addLog(`Reverse proxy detected: NGINX / Cloudflare edge mesh.`), 1500));
      timeoutIds.push(setTimeout(() => addEvent(`Network endpoints mapped (3 subdomains, 14 routes).`), 3000));
    } else if (stage.id === 'ARCHITECTURE') {
      addLog(`topology-extract --depth=3 --map-protocol=all`);
      addLog(`Resolved multi-tier architecture: Web Ingress -> REST Services -> Token Authority -> Postgres.`);
      addEvent(`System topology graph constructed.`);
      timeoutIds.push(setTimeout(() => addLog(`Extracted internal service endpoints and socket paths.`), 1800));
      timeoutIds.push(setTimeout(() => addEvent(`Identity & Auth service recognized at 10.0.3.11`), 3200));
    } else if (stage.id === 'STATIC') {
      addLog(`ast-scan --mode=deep-heuristic --ruleset=owasp-top-10`);
      addLog(`Parsing source files, routes, and compiled byte blocks...`);
      timeoutIds.push(setTimeout(() => {
        addLog(`[ALERT] Flagged unencrypted credential pattern inside vendor constants!`);
        addEvent(`Secret leakage detected: AWS IAM credentials.`);
        setFindings(prev => [...prev, DETAILED_FINDINGS[0]]);
      }, 2000));
      timeoutIds.push(setTimeout(() => addEvent(`AST traversal completed across 182 code modules.`), 4000));
    } else if (stage.id === 'DEPENDENCY') {
      addLog(`sca-audit --manifests=auto --cve-database=2026-live`);
      addLog(`Analyzing 42 direct dependencies and 388 transitive libraries...`);
      timeoutIds.push(setTimeout(() => {
        addLog(`[WARN] Outdated library detected: jsonwebtoken@8.5.1 (CVE-2022-23529)`);
        setFindings(prev => [...prev, DETAILED_FINDINGS[3]]);
        addEvent(`Dependency vulnerability flagged.`);
      }, 1600));
    } else if (stage.id === 'SECURITY') {
      addLog(`headers-audit --ssl-verify --csp-check --cors-matrix`);
      addLog(`Sending OPTIONS pre-flight and evaluating response headers...`);
      timeoutIds.push(setTimeout(() => {
        addLog(`[FLAG] Insecure headers: Missing Content-Security-Policy & Wildcard CORS found.`);
        setFindings(prev => [...prev, DETAILED_FINDINGS[2]]);
        addEvent(`CORS & CSP misconfigurations confirmed.`);
      }, 2200));
    } else if (stage.id === 'VULNERABILITY') {
      addLog(`fuzz-test --auth-bypass --tenant-isolation-test`);
      addLog(`Injecting simulated cross-tenant ID tokens to /api/v2/tenants/{id}/billing-records...`);
      timeoutIds.push(setTimeout(() => {
        addLog(`[CRITICAL] Server returned 200 OK with cross-tenant data! BOLA exploit confirmed!`);
        setFindings(prev => [...prev, DETAILED_FINDINGS[1]]);
        addEvent(`Broken Object-Level Authorization verified!`);
      }, 2400));
    } else if (stage.id === 'EVIDENCE') {
      addLog(`evidence-collector --capture-packets --format=curl-raw`);
      addLog(`Capturing HTTP payloads, response bodies, and decompiled source proofs.`);
      addEvent(`Proof artifacts archived into local forensic cache.`);
    } else if (stage.id === 'RISK') {
      addLog(`cvss-calc --vector=CVSS:3.1 --mitre-correlate`);
      addLog(`Correlating 4 findings: Max CVSS 9.4 (CRITICAL), Overall Posture Score: 42/100.`);
      addEvent(`Risk score computed: High Exposure Index.`);
    } else if (stage.id === 'VALIDATION') {
      addLog(`triage-validate --confirm-exploits=true`);
      addLog(`Executing secondary validation checks to weed out false positives...`);
      timeoutIds.push(setTimeout(() => {
        addLog(`All 4 security vulnerabilities verified with 100% confirmation certainty.`);
        addEvent(`Zero false positives. Ready for executive report.`);
      }, 1800));
    } else if (stage.id === 'REPORT') {
      addLog(`compile-report --format=full --output=nexora-audit.json`);
      addLog(`Assembling executive breakdown, architecture loopholes, proofs & mitigation steps...`);
      timeoutIds.push(setTimeout(() => {
        addLog(`Screening finished successfully. Audit report ready.`);
        setReport({
          target: session.target,
          type: session.type,
          duration: '00:00:46',
          checks: 68,
          findingsTotal: 4,
          critical: 1,
          high: 1,
          medium: 2,
          confirmed: 4,
          postureScore: 42,
          architectureLoopholes: [
            'Direct database connectivity without mutual TLS (mTLS) enforcement.',
            'Unauthenticated reverse proxy routing allowing tenant ID parameter manipulation.',
            'Client artifact packaging bundles sensitive cloud deployment credentials.',
            'Absence of edge WAF rate-limiting on sensitive financial reporting endpoints.'
          ]
        });
      }, 2200));
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

  const confirmClearCache = () => {
    localStorage.removeItem(`screening_${id}`);
    setShowClearModal(false);
    navigate('/screening');
  };

  if (!session) return null;

  const isComplete = currentStageIndex >= STAGES.length;
  const progressPercent = Math.min(100, Math.round((currentStageIndex / STAGES.length) * 100));

  const filteredFindings = findings.filter(f => {
    if (filterSeverity === 'ALL') return true;
    return f.severity === filterSeverity;
  });

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', color: 'var(--text-main)' }}>
      {/* Clear Cache Confirmation Modal */}
      {showClearModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--status-danger)' }}>
              <Trash2 size={24} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Purge Temporary Cache Memory?</h2>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Purging cache memory will permanently delete all temporary session evidence, live process telemetry, decrypted token previews, and the generated vulnerability report for:
            </p>

            <div style={{
              backgroundColor: 'var(--bg-dark)',
              padding: '0.85rem 1rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem',
              fontSize: '0.85rem'
            }}>
              <div><strong>Target:</strong> {session.target}</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}><strong>Session ID:</strong> {id}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowClearModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={confirmClearCache}
                style={{ backgroundColor: 'var(--status-danger)', color: '#fff', border: 'none' }}
              >
                Clear Cache & Return to Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header: Target Info & Live Progress Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        backgroundColor: '#050608',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="live-indicator"></div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Screening Target
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {session.target}
            </div>
          </div>
          <span className="badge" style={{ backgroundColor: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-cyan)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
            {session.type}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>Current Phase</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
              {isComplete ? 'AUDIT COMPLETE' : `${activeStage.phase}: ${activeStage.name}`}
            </div>
          </div>

          <div style={{ minWidth: '160px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Progress</span>
              <strong style={{ color: 'var(--text-main)' }}>{progressPercent}%</strong>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: isComplete ? 'var(--status-success)' : 'var(--accent-cyan)',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            onClick={() => setShowClearModal(true)}
          >
            <Trash2 size={14} /> Clear Cache
          </button>
        </div>
      </div>

      {/* Real-time CLI Command Header */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', backgroundColor: '#020305' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <Terminal size={15} color="var(--accent-cyan)" />
            <span>REALTIME EXECUTION TELEMETRY & CLI COMMAND LOG</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Streaming stdout / stderr
          </div>
        </div>

        <div style={{
          height: '130px',
          overflowY: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          lineHeight: 1.6,
          backgroundColor: '#000000',
          padding: '0.85rem 1rem',
          borderRadius: '6px',
          border: '1px solid var(--border-color)',
          color: '#d1d5db'
        }}>
          {logs.map((log, i) => (
            <div key={i} style={{ color: log.includes('[ALERT]') || log.includes('[CRITICAL]') ? '#f87171' : log.includes('[WARN]') || log.includes('[FLAG]') ? '#fbbf24' : '#d1d5db' }}>
              {log}
            </div>
          ))}
          {!isComplete && (
            <div style={{ color: 'var(--accent-cyan)', animation: 'pulse 1.5s infinite' }}>
              _ executing {activeStage.name.toLowerCase()}...
            </div>
          )}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* Middle Section: Flowchart Highlights + Architecture Animation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Flowchart with Real-Time Step Highlights */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <Layers size={18} color="var(--accent-cyan)" />
              <span>TESTING PROCESS FLOWCHART</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Stage {Math.min(currentStageIndex + 1, STAGES.length)} of {STAGES.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isFuture = idx > currentStageIndex;

              return (
                <div 
                  key={stage.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    border: `1px solid ${isCurrent ? 'var(--accent-cyan)' : isPast ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
                    backgroundColor: isCurrent ? 'rgba(6, 182, 212, 0.1)' : isPast ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-dark)',
                    transition: 'all 0.3s ease',
                    boxShadow: isCurrent ? '0 0 12px rgba(6, 182, 212, 0.25)' : 'none'
                  }}
                >
                  {/* Status Circle / Node */}
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: isCurrent ? 'var(--accent-cyan)' : isPast ? 'var(--status-success)' : 'var(--bg-card)',
                    color: isCurrent || isPast ? '#000' : 'var(--text-muted)',
                    border: `1px solid ${isCurrent ? 'var(--accent-cyan)' : isPast ? 'var(--status-success)' : 'var(--border-color)'}`,
                    flexShrink: 0
                  }}>
                    {isPast ? <Check size={16} /> : isCurrent ? <Activity size={16} className="spin-icon" /> : idx + 1}
                  </div>

                  {/* Flowchart Text Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: isCurrent ? 'var(--accent-cyan)' : isPast ? 'var(--text-main)' : 'var(--text-muted)'
                      }}>
                        {stage.name}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: isCurrent ? 'rgba(6, 182, 212, 0.2)' : isPast ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                        color: isCurrent ? 'var(--accent-cyan)' : isPast ? 'var(--status-success)' : 'var(--text-muted)',
                        fontWeight: 600
                      }}>
                        {isCurrent ? 'SCREENING ACTIVE' : isPast ? 'PASSED' : 'QUEUED'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {stage.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Realtime Project Architecture Node Highlights & Live Event Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Architecture Visual Map */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <Cpu size={18} color="var(--accent-cyan)" />
                <span>PROJECT ARCHITECTURE TOPOLOGY</span>
              </div>
              <span className="badge" style={{ fontSize: '0.7rem' }}>
                LIVE HIGHLIGHT
              </span>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Dynamic tracing of the current inspection probe across target architecture tiers:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {archNodes.map((node, i) => {
                const isUnderAudit = i === activeArchIndex && !isComplete;
                const isDone = i < activeArchIndex || isComplete;

                return (
                  <div key={node.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.85rem 1rem',
                    backgroundColor: isUnderAudit ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-dark)',
                    border: `1.5px solid ${isUnderAudit ? 'var(--accent-cyan)' : isDone ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    boxShadow: isUnderAudit ? '0 0 14px rgba(6, 182, 212, 0.3)' : 'none'
                  }}>
                    <div style={{
                      padding: '0.5rem',
                      borderRadius: '6px',
                      backgroundColor: isUnderAudit ? 'var(--accent-cyan)' : 'var(--bg-card)',
                      color: isUnderAudit ? '#000' : 'var(--text-main)',
                      display: 'flex'
                    }}>
                      <node.icon size={20} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.85rem', color: isUnderAudit ? 'var(--accent-cyan)' : 'var(--text-main)' }}>
                          {node.name}
                        </strong>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: isUnderAudit ? 'var(--accent-cyan)' : isDone ? 'var(--status-success)' : 'var(--text-muted)'
                        }}>
                          {isUnderAudit ? 'INSPECTING NOW' : isDone ? 'VERIFIED' : 'WAITING'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                        Tier IP: {node.ip} &bull; Type: {node.type}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Discrete Events Stream */}
          <div className="card" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <Activity size={18} color="var(--status-info)" />
                <span>DISCRETE VERIFICATION EVENTS</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {processEvents.length} events logged
              </span>
            </div>

            <div style={{
              height: '180px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.8rem'
            }}>
              {processEvents.map((evt, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '4px',
                  backgroundColor: idx === processEvents.length - 1 ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                  borderLeft: idx === processEvents.length - 1 ? '2px solid var(--accent-cyan)' : '2px solid transparent'
                }}>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    {evt.time}
                  </span>
                  <span style={{ color: idx === processEvents.length - 1 ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {evt.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final Comprehensive Audit Report Section */}
      {report && (
        <div className="card" style={{ padding: '2.5rem 2rem', marginBottom: '2.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
          {/* Header Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--status-success)',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '0.75rem'
              }}>
                <CheckCircle2 size={14} /> COMPLETE & CONFIRMED AUDIT REPORT
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                Target Security Posture & Loopholes Assessment
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Forensic inspection results for <strong>{report.target}</strong> ({report.type}) generated on {new Date().toLocaleString()}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => window.print()}>
                <Printer size={16} /> Print Report
              </button>
              <button className="btn btn-primary" onClick={() => alert('Exporting full vulnerability proof dossier (PDF)...')}>
                <Download size={16} /> Export PDF Dossier
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--status-danger)' }}
                onClick={() => setShowClearModal(true)}
              >
                <Trash2 size={16} /> Clear Cache Memory
              </button>
            </div>
          </div>

          {/* Metric Overview Counters */}
          <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
            <div className="card stat-card">
              <span className="stat-label">Security Score</span>
              <span className="stat-value" style={{ color: report.postureScore >= 80 ? 'var(--status-success)' : report.postureScore >= 50 ? 'var(--status-warning)' : 'var(--status-danger)' }}>
                {report.postureScore}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--status-danger)' }}>High Exploitation Risk</span>
            </div>

            <div className="card stat-card">
              <span className="stat-label">Total Loophole Proofs</span>
              <span className="stat-value" style={{ color: 'var(--status-danger)' }}>
                {report.findingsTotal}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 Critical &bull; 1 High &bull; 2 Med</span>
            </div>

            <div className="card stat-card">
              <span className="stat-label">Checks Executed</span>
              <span className="stat-value" style={{ color: 'var(--accent-cyan)' }}>
                {report.checks}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across 11 testing stages</span>
            </div>

            <div className="card stat-card">
              <span className="stat-label">Audit Duration</span>
              <span className="stat-value" style={{ color: 'var(--text-main)' }}>
                {report.duration}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--status-success)' }}>Automated Verification</span>
            </div>
          </div>

          {/* Architecture Weaknesses & Loopholes Breakdown */}
          <div style={{
            backgroundColor: 'var(--bg-dark)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2.5rem'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} color="var(--status-warning)" />
              Identified Architecture Loopholes & Structural Flaws
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Topological inspection identified the following architectural design gaps in the target infrastructure:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {report.architectureLoopholes.map((loophole, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px'
                }}>
                  <div style={{ color: 'var(--status-danger)', marginTop: '2px' }}>
                    <XCircle size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Loophole #{idx + 1}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                      {loophole}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Security Findings & Proofs */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Verified Security Findings & Forensic Proofs
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Complete technical breakdown including reproduction evidence, blast radius, and remediation.
                </p>
              </div>

              {/* Severity Filter Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setFilterSeverity(sev)}
                    className="btn btn-secondary"
                    style={{
                      padding: '0.35rem 0.85rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: filterSeverity === sev ? 'var(--accent-cyan)' : 'var(--bg-dark)',
                      color: filterSeverity === sev ? '#000' : 'var(--text-muted)',
                      borderColor: filterSeverity === sev ? 'var(--accent-cyan)' : 'var(--border-color)'
                    }}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {filteredFindings.map(finding => (
                <div key={finding.id} style={{
                  backgroundColor: 'var(--bg-dark)',
                  border: `1px solid ${finding.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.5)' : 'var(--border-color)'}`,
                  borderRadius: '8px',
                  padding: '1.5rem'
                }}>
                  {/* Finding Title Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                        <span className={`badge badge-${finding.severity === 'CRITICAL' || finding.severity === 'HIGH' ? 'danger' : 'warning'}`}>
                          {finding.severity} &bull; CVSS {finding.cvss}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                          {finding.id}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          &bull; {finding.category}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {finding.title}
                      </h4>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                      <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-success)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                        EXPLOIT VERIFIED
                      </span>
                    </div>
                  </div>

                  {/* Metadata Matrix */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.85rem',
                    backgroundColor: 'var(--bg-card)',
                    padding: '1rem',
                    borderRadius: '6px'
                  }}>
                    <div>
                      <strong style={{ color: 'var(--text-muted)' }}>Affected Component:</strong>
                      <div style={{ color: 'var(--text-main)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                        {finding.component}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-muted)' }}>MITRE ATT&CK Mapping:</strong>
                      <div style={{ color: 'var(--text-main)', marginTop: '0.2rem' }}>
                        {finding.mitre}
                      </div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <strong style={{ color: 'var(--status-danger)' }}>Blast Radius & Impact:</strong>
                      <div style={{ color: 'var(--text-main)', marginTop: '0.2rem' }}>
                        {finding.blastRadius}
                      </div>
                    </div>
                  </div>

                  {/* Proof Snippet */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      <Code2 size={16} color="var(--accent-cyan)" />
                      <span>FORENSIC REPRODUCTION PROOF & RAW TELEMETRY:</span>
                    </div>
                    <pre style={{
                      backgroundColor: '#000000',
                      border: '1px solid var(--border-color)',
                      padding: '1rem',
                      borderRadius: '6px',
                      color: '#a5f3fc',
                      fontSize: '0.8rem',
                      lineHeight: 1.5,
                      overflowX: 'auto',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {finding.proofSnippet}
                    </pre>
                  </div>

                  {/* Remediation Guide */}
                  <div style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '6px',
                    fontSize: '0.85rem'
                  }}>
                    <strong style={{ color: 'var(--status-success)', display: 'block', marginBottom: '0.25rem' }}>
                      Remediation Playbook:
                    </strong>
                    <span style={{ color: 'var(--text-main)' }}>
                      {finding.remediation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action to Clear Cache */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Completed testing report archived locally. Retain for compliance or purge when done.
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => navigate('/screening')}>
                Start Another Screening
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--status-danger)' }}
                onClick={() => setShowClearModal(true)}
              >
                <Trash2 size={16} /> Clear Cache Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveScreening;
