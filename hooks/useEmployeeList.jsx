// hooks/useEmployeeList.js
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
// import axios from 'axios';
import { API_BASE_URL } from '../services/api';

const useEmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');
      console.log("key", secretKey);
  
      const res = await fetch(`${API_BASE_URL}/employee/emp-attendance`, {
        headers: {
          secret_key: secretKey,
        },
      });
  
      const data = await res.json(); // Correct way to parse fetch response
      console.log("Response data:", data);
  
      const list = data?.employeeAttendanceList || [];
      const mappedList = list.map((emp) => ({
        id: emp.employeeId.toString(),
        name: emp.name,
        attendance: emp.attendanceCode|| '',
      }));
  
      console.log("list", mappedList);
      setEmployees(mappedList);
    } catch (error) {
      console.error('Error fetching employee list:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return { employees, loading };
};

export default useEmployeeList;
