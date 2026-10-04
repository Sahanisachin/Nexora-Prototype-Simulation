class NexoraEngine {
  constructor() {
    this.listeners = [];
    
    // Initial State
    this.state = {
      projects: [
        { id: 'PROJ-001', name: 'Security Validation', description: 'Continuous automated testing', scenarios: [] },
        { id: 'PROJ-002', name: 'Purple Team Lab', description: 'Ad-hoc purple team exercises', scenarios: [] }
      ],
      scenarios: [
        { id: 'AUTH_BRUTE_FORCE', name: 'Authentication Brute Force', tactic: 'Credential Access', technique: 'T1110', severity: 'MEDIUM', expectedDetection: 'Failed authentication threshold', validationCriteria: 'Incident must be generated', status: 'IDLE' },
        { id: 'NETWORK_RECON', name: 'Network Reconnaissance', tactic: 'Discovery', technique: 'T1046', severity: 'LOW', expectedDetection: 'Port scan signature', validationCriteria: 'Telemetry must capture scan', status: 'IDLE' },
        { id: 'POWERSHELL_EXECUTION', name: 'Suspicious PowerShell Execution', tactic: 'Execution', technique: 'T1059.001', severity: 'HIGH', expectedDetection: 'Encoded command execution', validationCriteria: 'Incident with HIGH severity', status: 'IDLE' },
        { id: 'PRIVILEGE_ESCALATION', name: 'Privilege Escalation', tactic: 'Privilege Escalation', technique: 'T1068', severity: 'CRITICAL', expectedDetection: 'Local exploit behavior', validationCriteria: 'Detection and Incident', status: 'IDLE' }
      ],
      telemetry: [],
      detections: [],
      incidents: [],
      validations: [],
      jobs: [],
      metrics: {
        testedTechniques: 0,
        detectedTechniques: 0,
        activeSimulations: 0
      }
    };

    this.loadState();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveState();
    this.listeners.forEach(listener => listener(this.state));
  }

  loadState() {
    try {
      const saved = localStorage.getItem('nexora_state_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load state', e);
    }
  }

  saveState() {
    try {
      localStorage.setItem('nexora_state_v2', JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state', e);
    }
  }

  reset() {
    this.state.telemetry = [];
    this.state.detections = [];
    this.state.incidents = [];
    this.state.validations = [];
    this.state.jobs = [];
    this.state.metrics = { testedTechniques: 0, detectedTechniques: 0, activeSimulations: 0 };
    this.state.scenarios.forEach(s => s.status = 'IDLE');
    this.state.projects.forEach(p => p.scenarios = []);
    this.notify();
    return "Demo data reset successfully.";
  }

  generateId(prefix) {
    return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  addScenarioToProject(scenarioId, projectId) {
    const project = this.state.projects.find(p => p.id === projectId);
    if (!project) throw new Error(`Project ${projectId} not found`);
    if (project.scenarios.includes(scenarioId)) return false;
    
    project.scenarios.push(scenarioId);
    this.notify();
    return true;
  }
  
  removeScenarioFromProject(scenarioId, projectId) {
    const project = this.state.projects.find(p => p.id === projectId);
    if (project) {
      project.scenarios = project.scenarios.filter(id => id !== scenarioId);
      this.notify();
    }
  }

  runScenario(scenarioId) {
    const scenario = this.state.scenarios.find(s => s.id === scenarioId);
    if (!scenario) throw new Error(`Scenario ${scenarioId} not found`);

    if (scenario.status === 'RUNNING') return `Scenario ${scenarioId} is already running.`;

    const jobId = this.generateId('JOB');
    const simulationRunId = this.generateId('SIM');
    
    this.state.jobs.unshift({
      id: jobId,
      simulationId: simulationRunId,
      scenarioId: scenario.id,
      startedAt: new Date().toISOString(),
      status: 'RUNNING',
      logs: [`[*] Loading scenario...`, `[*] ATT&CK technique: ${scenario.technique}`, `[*] Initializing simulation...`]
    });

    scenario.status = 'RUNNING';
    this.state.metrics.activeSimulations++;
    this.notify();

    this._simulateExecution(jobId, scenario);

    return `Started scenario ${scenarioId} (Job: ${jobId})`;
  }

  _simulateExecution(jobId, scenario) {
    const appendLog = (msg) => {
      const job = this.state.jobs.find(j => j.id === jobId);
      if (job) job.logs.push(msg);
      this.notify();
    };

    setTimeout(() => {
      appendLog(`[+] Simulation started`);
      appendLog(`[>] Generating telemetry events...`);
      
      const numEvents = Math.floor(Math.random() * 5) + 3;
      for (let i = 0; i < numEvents; i++) {
        setTimeout(() => {
          const telId = this.generateId('TEL');
          this.state.telemetry.unshift({
            id: telId,
            timestamp: new Date().toISOString(),
            scenarioId: scenario.id,
            technique: scenario.technique,
            severity: scenario.severity,
            event: `Simulated event for ${scenario.technique}`,
            process: scenario.technique === 'T1059.001' ? 'powershell.exe' : 'unknown'
          });
          appendLog(`[>] Telemetry Generated: ${telId}`);
        }, i * 500);
      }

      setTimeout(() => {
        const detId = this.generateId('DET');
        this.state.detections.unshift({
          id: detId,
          timestamp: new Date().toISOString(),
          scenarioId: scenario.id,
          technique: scenario.technique
        });
        appendLog(`[+] Detection rule triggered: ${detId}`);

        const incId = this.generateId('INC');
        this.state.incidents.unshift({
          id: incId,
          timestamp: new Date().toISOString(),
          scenarioId: scenario.id,
          detectionId: detId,
          severity: scenario.severity,
          status: 'OPEN'
        });
        appendLog(`[+] Incident created: ${incId}`);

        const valId = this.generateId('VAL');
        this.state.validations.unshift({
          id: valId,
          timestamp: new Date().toISOString(),
          scenarioId: scenario.id,
          incidentId: incId,
          expected: 'Incident must be generated',
          observed: 'Incident created successfully',
          result: 'PASS'
        });
        appendLog(`[+] Validation started`);
        appendLog(`[+] Validation PASSED: ${valId}`);
        appendLog(`[+] Simulation COMPLETE`);

        scenario.status = 'COMPLETED';
        const job = this.state.jobs.find(j => j.id === jobId);
        if (job) job.status = 'COMPLETED';
        
        this.state.metrics.activeSimulations--;
        this.state.metrics.testedTechniques++;
        this.state.metrics.detectedTechniques++;

        this.notify();
      }, (numEvents * 500) + 1000);
      
    }, 1000);
  }

  searchTelemetry(query) {
    if (!query) return this.state.telemetry;
    const lower = query.toLowerCase();
    return this.state.telemetry.filter(t => 
      t.event.toLowerCase().includes(lower) || 
      t.process.toLowerCase().includes(lower) ||
      t.technique.toLowerCase().includes(lower)
    );
  }
}

const engine = new NexoraEngine();
export default engine;
