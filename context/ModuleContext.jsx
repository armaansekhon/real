import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDynamicModules } from '../utils/getDynamicModules';

const ModuleContext = createContext();



export const ModuleProvider = ({ children }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchModules = async () => {
    setLoading(true);
    console.log("evoked")
    const fetchedModules = await getDynamicModules();
    setModules(fetchedModules);
    setLoading(false);
  };

  

  return (
    <ModuleContext.Provider value={{ modules, loading, refreshModules: fetchModules }}>
      {children}
    </ModuleContext.Provider>
  );
};
export const useModules = () => useContext(ModuleContext);