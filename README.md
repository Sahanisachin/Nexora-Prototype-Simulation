# Nexora Prototype Simulation

**Purpose:**
A fully functional, self-contained cybersecurity validation platform prototype for demonstration purposes. This prototype simulates the complete Nexora workflow without requiring any real external infrastructure (Kubernetes, Docker, Falco, Zeek, etc.).

## Requirements
- Node.js (v16+)
- npm

## Installation
```bash
npm install
```

## Run Command
```bash
npm run dev
```

## Login Credentials
- **Username:** Capstone
- **Password:** Sachin

## Architecture
This is a React + Vite application that uses a frontend-only local simulation state. It leverages `localStorage` for data persistence across sessions, making it highly reliable for live demonstrations without any backend dependencies.

## Features
- **Dashboard:** Metrics and recent activity overview.
- **Projects:** Simulated project management.
- **Scenarios:** A library of MITRE ATT&CK mapped scenarios.
- **Execution Simulation:** Interactive, timed execution logs simulating attack and detection workflows.
- **Telemetry:** Data grid of synthetic events from Suricata, Falco, etc.
- **Incidents:** Incident management and timeline views.
- **Threat Hunting:** Search interface for querying telemetry data.
- **Validation:** Assessment results based on simulated detections.
- **Reports:** Printable executive summary generation.

## Simulation Disclaimer
This environment is exclusively a **SIMULATION**. No actual attacks are executed, and no external infrastructure is engaged. All telemetry, incidents, and validations are synthetic and generated locally within the browser to demonstrate the workflow.

## Teacher Demo Instructions
See `DEMO.md` for a step-by-step presentation script.
