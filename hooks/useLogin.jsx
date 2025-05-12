import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../services/api';
import { Alert } from 'react-native';
import { useUser } from '../context/UserContext';
import { useModules } from '../context/ModuleContext';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setUser, setUserType, setimg, setdate, setbranch } = useUser();
  const { refreshModules } = useModules();

  const login = async (usercode, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usercode, password }),
      });

      const data = await response.json();

      if (response.ok && data.secretKey) {
        // Ensure privileges is an array
        const privileges = Array.isArray(data.privileges) ? data.privileges : [];

        // Log values to debug types
        console.log('Storing values:', {
          secretKey: typeof data.secretKey,
          userCategoryCode: typeof data.user.userCategoryCode,
          userId: typeof data.user.id,
          userName: typeof data.user.name,
          currentDay: typeof data.currentDay,
          privileges: typeof privileges,
          privilegesValue: privileges,
          employeePic: typeof data.employeePic,
          branch: typeof data.branch,
          designation: data.user.designation,
        });

        // Store values in SecureStore, ensuring strings
        await SecureStore.setItemAsync('ggender', String(data.user.gender));
        await SecureStore.setItemAsync('auth_token', String(data.secretKey));
        await SecureStore.setItemAsync('userType', String(data.user.userCategoryCode || ''));
        await SecureStore.setItemAsync('userid', JSON.stringify(data.user.id ?? ''));
        await SecureStore.setItemAsync('userName', String(data.user.name || ''));
        await SecureStore.setItemAsync('currentDayDate', String(data.currentDay || ''));
        await SecureStore.setItemAsync('privileges', JSON.stringify(privileges));
        await SecureStore.setItemAsync('employeePic', String(data.employeePic || ''));
        await SecureStore.setItemAsync('branch', String(data.branch || ''));
        await SecureStore.setItemAsync('designation', JSON.stringify(data.user.designation || {}));

        // Update UserContext
        setUser({

          gender :data.user.gender??null,
          id: data.user.id ?? null,
          userCategoryCode: data.user.userCategoryCode || null,
          name: data.user.name || null,
          designation: data.user.designation || null,
        });
        setUserType(data.user.userCategoryCode || null);
        setimg(data.employeePic || null);
        setdate(data.currentDay || null);
        setbranch(data.branch || null);

        // Fetch modules after successful login
        console.log('Fetching modules in login...');
        await refreshModules();
        console.log('Modules fetched in login');

        console.log('Token stored:', data.secretKey, 'type:', data.user.userCategoryCode, 'access:', privileges, data.currentDay);

        return { success: true, privileges };
      } else {
        // Clear SecureStore on failed login
        await SecureStore.deleteItemAsync('auth_token');
         await SecureStore.deleteItemAsync('ggender');
        await SecureStore.deleteItemAsync('userType');
        await SecureStore.deleteItemAsync('userid');
        await SecureStore.deleteItemAsync('userName');
        await SecureStore.deleteItemAsync('currentDayDate');
        await SecureStore.deleteItemAsync('privileges');
        await SecureStore.deleteItemAsync('employeePic');
        await SecureStore.deleteItemAsync('branch');
        await SecureStore.deleteItemAsync('designation');

        throw new Error(data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
        return { isAuthenticated: false };
      }

      // Load user data from SecureStore
      const gen=await SecureStore.getItemAsync('ggender');
      const userType = await SecureStore.getItemAsync('userType');
      const userid = await SecureStore.getItemAsync('userid');
      const userName = await SecureStore.getItemAsync('userName');
      const currentDayDate = await SecureStore.getItemAsync('currentDayDate');
      const privilegesRaw = await SecureStore.getItemAsync('privileges');
      const employeePic = await SecureStore.getItemAsync('employeePic');
      const branch = await SecureStore.getItemAsync('branch');
      const designationRaw = await SecureStore.getItemAsync('designation');

      // Parse privileges with robust error handling
      let privileges = [];
      if (privilegesRaw) {
        try {
          privileges = JSON.parse(privilegesRaw);
          if (!Array.isArray(privileges)) {
            console.warn('Privileges is not an array:', privileges);
            privileges = [];
            await SecureStore.deleteItemAsync('privileges');
          }
        } catch (parseError) {
          console.error('Error parsing privileges:', parseError.message);
          privileges = [];
          await SecureStore.deleteItemAsync('privileges');
        }
      }

      // Parse designation with error handling
      let designation = null;
      if (designationRaw) {
        try {
          designation = JSON.parse(designationRaw);
          if (!designation || typeof designation !== 'object') {
            console.warn('Designation is invalid:', designation);
            designation = null;
            await SecureStore.deleteItemAsync('designation');
          }
        } catch (parseError) {
          console.error('Error parsing designation:', parseError.message);
          designation = null;
          await SecureStore.deleteItemAsync('designation');
        }
      }

      console.log('Retrieved privileges:', privileges);
      console.log('Retrieved designation:', designation);

      // Update UserContext
      setUserType(userType || null);
      setimg(employeePic || null);
      setdate(currentDayDate || null);
      setbranch(branch || null);
      setUser({
        gender:gen,
        id: userid ? JSON.parse(userid) : null,
        userCategoryCode: userType || null,
        name: userName || null,
        designation,
      });

      // Fetch modules after successful auth check
      console.log('Fetching modules in checkAuth...');
      await refreshModules();
      console.log('Modules fetched in checkAuth');

      return {
        isAuthenticated: true,
        privileges,
      };
    } catch (error) {
      console.error('Check auth error:', error.message);
      return { isAuthenticated: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        const response = await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            "secret_key":token,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.warn('Logout API failed:', response.status);
        }
      }

      // Clear SecureStore
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('userType');
      await SecureStore.deleteItemAsync('userid');
      await SecureStore.deleteItemAsync('userName');
      await SecureStore.deleteItemAsync('currentDayDate');
      await SecureStore.deleteItemAsync('privileges');
      await SecureStore.deleteItemAsync('employeePic');
      await SecureStore.deleteItemAsync('branch');
      await SecureStore.deleteItemAsync('designation');

      // Reset UserContext
      setUser(null);
      setUserType(null);
      setimg(null);
      setdate(null);
      setbranch(null);

      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error.message);
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('userType');
      await SecureStore.deleteItemAsync('userid');
      await SecureStore.deleteItemAsync('userName');
      await SecureStore.deleteItemAsync('currentDayDate');
      await SecureStore.deleteItemAsync('privileges');
      await SecureStore.deleteItemAsync('employeePic');
      await SecureStore.deleteItemAsync('branch');
      await SecureStore.deleteItemAsync('designation');

      setUser(null);
      setUserType(null);
      setimg(null);
      setdate(null);
      setbranch(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithAuth = async (url, options = {}) => {
    const token = await SecureStore.getItemAsync('auth_token');

    const headers = {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return { login, checkAuth, logout, loading, fetchWithAuth };
};

export default useLogin;