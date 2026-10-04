import React, { createContext, useContext, useState, useEffect } from 'react';
import engine from '../services/NexoraEngine';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('nexora_user')) || null
  );

  const [engineState, setEngineState] = useState(engine.state);

  useEffect(() => {
    localStorage.setItem('nexora_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    // Subscribe to engine state changes
    const unsubscribe = engine.subscribe((newState) => {
      setEngineState({ ...newState });
    });
    return unsubscribe;
  }, []);

  const login = (username, password) => {
    // Mock login for simulation
    const user = { username, role: 'PURPLE_TEAM_OPERATOR' };
    setCurrentUser(user);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      engineState, engine
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
