import engine from './NexoraEngine';

export class CLIParser {
  static parse(commandStr) {
    if (!commandStr || !commandStr.trim()) return '';

    const args = commandStr.trim().split(/\s+/);
    const cmd = args[0].toLowerCase();
    
    try {
      switch (cmd) {
        case 'help':
          return `Available commands:
  scenario list
  scenario show <id>
  scenario run <id>
  telemetry search <query>
  incident list
  validation run <simulation_id>
  system status
  clear
  help`;
          
        case 'scenario':
          if (args[1] === 'list') {
            const sc = engine.state.scenarios;
            if (sc.length === 0) return 'No scenarios found.';
            return sc.map(s => `${s.id.padEnd(25)} | ${s.technique.padEnd(10)} | ${s.status}`).join('\n');
          }
          if (args[1] === 'show' && args[2]) {
            const sc = engine.state.scenarios.find(s => s.id === args[2]);
            if (!sc) return `Scenario ${args[2]} not found.`;
            return JSON.stringify(sc, null, 2);
          }
          if (args[1] === 'run' && args[2]) {
            return engine.runScenario(args[2]);
          }
          return 'Usage: scenario [list | show <id> | run <id>]';

        case 'telemetry':
          if (args[1] === 'search') {
            const query = args.slice(2).join(' ');
            const results = engine.searchTelemetry(query);
            if (results.length === 0) return 'No telemetry found.';
            return results.map(t => `${t.timestamp} | ${t.id} | ${t.severity} | ${t.technique} | ${t.process}`).join('\n');
          }
          return 'Usage: telemetry search <query>';

        case 'incident':
          if (args[1] === 'list') {
            const inc = engine.state.incidents;
            if (inc.length === 0) return 'No incidents found.';
            return inc.map(i => `${i.timestamp} | ${i.id} | ${i.severity} | ${i.status}`).join('\n');
          }
          return 'Usage: incident list';

        case 'validation':
          if (args[1] === 'run') {
            return `Validation executed for ${args[2] || 'latest'}. See GUI for details.`;
          }
          return 'Usage: validation run <simulation_id>';

        case 'system':
          if (args[1] === 'status') {
            return `APPLICATION
Frontend              ONLINE
Backend               SIMULATED
Simulation Engine     ONLINE

SECURITY INTEGRATIONS
Falco                 SIMULATED
Zeek                  SIMULATED
Suricata              SIMULATED`;
          }
          return 'Usage: system status';

        case 'clear':
          return 'CLEAR'; // Special signal to UI

        case 'reset':
          return engine.reset();

        default:
          return `Command not found: ${cmd}. Type 'help' for available commands.`;
      }
    } catch (err) {
      return `Error executing command: ${err.message}`;
    }
  }
}
