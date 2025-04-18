import * as SecureStore from 'expo-secure-store';
import { defaultModules } from '../constants/modules.jsx';
export const getDynamicModules = async () => {
    const userType = await SecureStore.getItemAsync('userType');
    const privilegeString = await SecureStore.getItemAsync('privileges');
    const privileges = privilegeString ? JSON.parse(privilegeString) : [];
  
    console.log("📦 userType:", userType);
    console.log("🔐 Privileges:", privileges);
  
    const isAdmin = userType === '0';
  
    if (isAdmin) {
      console.log("🛡️ Admin detected — returning all modules.");
      return defaultModules;
    }
  
    console.log("👤 Non-admin detected");
  
    const filterModules = (modules) =>
      modules
        .map((mod) => {
          const isAlwaysVisible = mod.alwaysVisible === true;
          const isPrivileged = privileges.includes(mod.path);
  
          if (mod.children) {
            const filteredChildren = filterModules(mod.children);
            const shouldInclude = isAlwaysVisible || isPrivileged || filteredChildren.length > 0;
  
            if (shouldInclude) {
              return { ...mod, children: filteredChildren };
            }
            return null;
          }
  
          return isAlwaysVisible || isPrivileged ? mod : null;
        })
        .filter(Boolean);
  
    const filteredModules = filterModules(defaultModules);
    console.log("📦 Filtered Modules for non-admin:", filteredModules);
    return filteredModules;
  };
  