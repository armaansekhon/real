import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../services/api';

const API_URL = `${API_BASE_URL}/employee/save-today-attendance`;
// replace with actual secret key

const usePostAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postAttendance = async ({ latitude, longitude }) => {
    try {
      setLoading(true);
      setError(null);

      const loginUserId = await SecureStore.getItemAsync('userid');
   
        const secretKey = await SecureStore.getItemAsync('auth_token');
         const currentDayDate = await SecureStore.getItemAsync('currentDayDate');


      const payload = {
        employeeId: Number(loginUserId),
     
        currentDayDate,
        latitude: String(latitude),
        longitude: String(longitude)
      };
      console.log('Sending attendance payload:', payload);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          secret_key: secretKey,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to post attendance');
      }

      return result;
    } catch (err) {
      setError(err.message);
      console.error('Post Attendance Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postAttendance, loading, error };
};

export default usePostAttendance;
