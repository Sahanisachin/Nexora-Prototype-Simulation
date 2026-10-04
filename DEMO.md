# Nexora Prototype Demo Script

Follow this script during your teacher presentation to demonstrate the complete cybersecurity validation lifecycle. The prototype is designed to work seamlessly by simulating the backend logic locally in the browser.

## Preparation
1. Ensure the app is running (`npm run dev`).
2. Open the prototype in your browser (usually `http://localhost:5173`).
3. (Optional) Go to **System Status** and click **Reset Demo Data** to start with a clean state.

---

## The Presentation Flow

### 1. Login (0:00)
- Navigate to the login page.
- Explain: *"This is the entry point to the Nexora platform."*
- Enter Credentials:
  - **Username:** Capstone
  - **Password:** Sachin
- Click **Sign In**.

### 2. Dashboard Overview (1:00)
- You land on the Dashboard.
- Explain: *"Here we can see our overall security posture. Notice the total detections, open incidents, and our current security score."*
- Point out the "Simulation Environment" badge at the top to clarify this is a safe prototype.

### 3. Projects (2:00)
- Click **Projects** in the sidebar.
- Explain: *"We organize our validation assessments into projects. Here we have a few simulated projects like an Enterprise Network Assessment."*

### 4. Scenario Library (2:30)
- Click **Scenario Library**.
- Explain: *"This is our catalog of simulated MITRE ATT&CK techniques. Today, we'll run the 'Suspicious PowerShell Execution' scenario to see if our defenses can catch it."*
- Find the **Suspicious PowerShell Execution** card and click **Execute Simulation**.

### 5. Scenario Execution (3:30)
- You are now on the Execution view.
- Click the blue **Execute** button.
- **Watch the Live Logs:** Describe what's happening as the text appears.
  - *"It's initializing the simulation..."*
  - *"It executes the technique..."*
  - *"A telemetry event is generated locally..."*
  - *"Our detection rules matched the telemetry and created an incident..."*
  - *"Validation completes."*
- Once finished, highlight the green **Validation Passed** card at the bottom right.

### 6. Telemetry (5:00)
- Click **Telemetry** in the sidebar.
- Explain: *"Let's look at the raw data. This simulates logs from Suricata, Falco, and Zeek."*
- Point out the newly generated 'Suspicious PowerShell' event at the top of the table.

### 7. Threat Hunting (6:00)
- Click **Threat Hunting**.
- Explain: *"Analysts can query this data."*
- Type `powershell` in the Hunt Query box and click **Run Query**.
- Show how it filters down to the exact telemetry events containing that keyword.

### 8. Incidents (7:00)
- Click **Incidents**.
- Point out the newly created incident at the top.
- Click **View** on that row.
- Explain: *"The detection engine automatically escalated that telemetry into a tracked incident. Here we can see the timeline, source, and severity."*

### 9. Validation Results (8:00)
- Click **Validation**.
- Explain: *"Because the expected detection occurred, the scenario is marked as PASSED. This updates our overall security score."*
- Show that the overall score has dynamically updated.

### 10. Executive Reports (9:00)
- Click **Reports**.
- Click **Create Report**.
- Explain: *"Finally, we generate a comprehensive executive summary."*
- Show the printable view with the metrics and validation details.

### 11. Conclusion (10:00)
- Briefly show the **Processes** and **System Status** pages to demonstrate depth.
- Click **Logout** at the bottom of the sidebar to finish the demo.
