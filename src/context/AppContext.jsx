import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultProjects, defaultScenarios, defaultTelemetry, defaultIncidents, defaultValidations } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('nexora_user')) || null
  );

  const [projects, setProjects] = useState(() => JSON.parse(localStorage.getItem('nexora_projects')) || defaultProjects);
  const [scenarios, setScenarios] = useState(() => JSON.parse(localStorage.getItem('nexora_scenarios')) || defaultScenarios);
  const [telemetry, setTelemetry] = useState(() => JSON.parse(localStorage.getItem('nexora_telemetry')) || defaultTelemetry);
  const [incidents, setIncidents] = useState(() => JSON.parse(localStorage.getItem('nexora_incidents')) || defaultIncidents);
  const [validations, setValidations] = useState(() => JSON.parse(localStorage.getItem('nexora_validations')) || defaultValidations);
  const [scenarioRuns, setScenarioRuns] = useState(() => JSON.parse(localStorage.getItem('nexora_scenarioRuns')) || []);

  useEffect(() => {
    localStorage.setItem('nexora_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => { localStorage.setItem('nexora_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('nexora_scenarios', JSON.stringify(scenarios)); }, [scenarios]);
  useEffect(() => { localStorage.setItem('nexora_telemetry', JSON.stringify(telemetry)); }, [telemetry]);
  useEffect(() => { localStorage.setItem('nexora_incidents', JSON.stringify(incidents)); }, [incidents]);
  useEffect(() => { localStorage.setItem('nexora_validations', JSON.stringify(validations)); }, [validations]);
  useEffect(() => { localStorage.setItem('nexora_scenarioRuns', JSON.stringify(scenarioRuns)); }, [scenarioRuns]);

  const login = (username, password) => {
    if (username === 'Capstone' && password === 'Sachin') {
      const user = { username, role: 'Administrator' };
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const resetData = () => {
    setProjects(defaultProjects);
    setScenarios(defaultScenarios);
    setTelemetry(defaultTelemetry);
    setIncidents(defaultIncidents);
    setValidations(defaultValidations);
    setScenarioRuns([]);
    // Leave user logged in
  };

  const addTelemetryEvent = (event) => {
    setTelemetry(prev => [event, ...prev]);
  };

  const addIncident = (incident) => {
    setIncidents(prev => [incident, ...prev]);
  };

  const addValidation = (validation) => {
    setValidations(prev => [validation, ...prev]);
  };

  const addScenarioRun = (run) => {
    setScenarioRuns(prev => [run, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, logout, resetData,
      projects, scenarios, telemetry, incidents, validations, scenarioRuns,
      addTelemetryEvent, addIncident, addValidation, addScenarioRun
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
