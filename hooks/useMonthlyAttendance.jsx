// hooks/useMonthlyAttendance.js
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../services/api';

const useMonthlyAttendance = (employeeId, month, year) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!employeeId || !month || !year) return;

      setLoading(true);
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        const response = await fetch(
          `${API_BASE_URL}/employee/getMonthlyAttendance/employeeId/${employeeId}/month/${month}/year/${year}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'secret_key': token,
            },
          }
        );
        const data = await response.json();
        setAttendanceData(data || []);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [employeeId, month, year]);

  return { attendanceData, loading };
};

export default useMonthlyAttendance;
