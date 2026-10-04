export const defaultProjects = [
  {
    id: 'proj-001',
    name: 'Enterprise Network Assessment',
    status: 'Active',
    description: 'Internal corporate network validation against common external threats.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'proj-002',
    name: 'Web Application Assessment',
    status: 'Completed',
    description: 'Security validation for the customer-facing web portal.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'proj-003',
    name: 'Cloud Security Validation',
    status: 'Planned',
    description: 'Testing IAM roles and bucket misconfigurations.',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  }
];

export const defaultScenarios = [
  {
    id: 'scen-001',
    name: 'Authentication Brute Force Simulation',
    description: 'Simulates a rapid sequence of failed login attempts against a target service.',
    target: 'Auth Service',
    technique: 'T1110 - Brute Force',
    tactic: 'Credential Access',
    severity: 'Medium',
    expectedDetections: ['Multiple failed logins', 'Brute Force Detection'],
  },
  {
    id: 'scen-002',
    name: 'Network Reconnaissance Simulation',
    description: 'Performs a mock nmap-style scan against local subnets.',
    target: 'Internal Subnet',
    technique: 'T1046 - Network Service Discovery',
    tactic: 'Discovery',
    severity: 'Low',
    expectedDetections: ['Port scan detected', 'Reconnaissance Detection'],
  },
  {
    id: 'scen-003',
    name: 'Suspicious PowerShell Execution',
    description: 'Executes an encoded PowerShell command mimicking malicious activity.',
    target: 'Windows Endpoint',
    technique: 'T1059.001 - PowerShell',
    tactic: 'Execution',
    severity: 'High',
    expectedDetections: ['Encoded PowerShell execution', 'PowerShell Execution Detection'],
  },
  {
    id: 'scen-004',
    name: 'Privilege Escalation Simulation',
    description: 'Attempts to modify permissions of a critical file (mock).',
    target: 'Linux Server',
    technique: 'T1068 - Exploitation for Privilege Escalation',
    tactic: 'Privilege Escalation',
    severity: 'Critical',
    expectedDetections: ['Unexpected shell execution', 'Privilege Escalation Detection'],
  }
];

export const generateMockTelemetry = (type, message, severity, source = 'Suricata') => {
  return {
    id: 'tel-' + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    source,
    type,
    severity,
    message,
    host: 'host-' + Math.floor(Math.random() * 100),
    ip: '192.168.1.' + Math.floor(Math.random() * 255)
  };
};

export const defaultTelemetry = [
  generateMockTelemetry('Auth', 'Multiple failed login attempts', 'Medium', 'Application'),
  generateMockTelemetry('Network', 'Potential SSH scan detected', 'Low', 'Suricata'),
  generateMockTelemetry('Process', 'Unexpected shell execution', 'High', 'Falco'),
];

export const defaultIncidents = [
  {
    id: 'INC-2026-001',
    title: 'Suspicious Network Reconnaissance',
    severity: 'Low',
    status: 'Open',
    source: 'Suricata',
    firstSeen: new Date(Date.now() - 3600000).toISOString(),
    assignee: 'Unassigned',
  }
];

export const defaultValidations = [];
