// hooks/useAttendanceNotations.js
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const useAttendanceNotations = () => {
  const [notations, setNotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotations = async () => {
      try {
        const secretKey = await SecureStore.getItemAsync('auth_token');
        console.log("key",secretKey )
        const response = await fetch('http://192.168.6.210:8686/pipl/api/v1/employee/attendanceNotations', {
            headers: {
              
                    "Content-Type": "application/json",
                    secret_key: secretKey,

                  
            },
          });
          
          console.log("Status code:", response.status);
          const text = await response.text();
          console.log("Raw response:", text);
          
          if (!response.ok) throw new Error('Failed to fetch notations');
          const data = JSON.parse(text);
          setNotations(data);
      } catch (err) {
        console.error('Error fetching attendance notations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotations();
  }, []);

  return { notations, loading };
};

export default useAttendanceNotations;
