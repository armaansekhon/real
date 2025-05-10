import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../services/api';

const API_URL = `${API_BASE_URL}/employee/today-attendance`;

const useFetchAttendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch SecureStore values
      const loginUserId = await SecureStore.getItemAsync('userid');
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const currentDayDate = await SecureStore.getItemAsync('currentDayDate');

      if (!loginUserId || !secretKey || !currentDayDate) {
        throw new Error('Missing required authentication details.');
      }

      const url = `${API_URL}/${Number(loginUserId)}/currentDayDate/${currentDayDate}`;
      console.log("url", url)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'secret_key': secretKey,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch attendance data.');
      }

      setAttendance(result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return { attendance, loading, error, refetch: fetchAttendance };
};

export default useFetchAttendance;
