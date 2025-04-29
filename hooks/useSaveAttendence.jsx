// hooks/useSaveAttendance.js
import { useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Alert } from 'react-native';

const useSaveAttendance = () => {
  // Accepts an array of attendance data (employeeId + colorCode)
  const saveAttendance = useCallback(async (attendanceList) => {
    try {
      const loginUserId = await SecureStore.getItemAsync('userid');
      const currentDayDate = await SecureStore.getItemAsync('currentDayDate');
      const secretKey = await SecureStore.getItemAsync('auth_token');

      if (!loginUserId || !currentDayDate || !secretKey) {
        throw new Error('Missing authentication data');
      }

      // Create the final payload array
      const payload = attendanceList.map(({ employeeId, colorCode }) => ({
        employeeId: Number(employeeId),
        loginUserId: Number(loginUserId),
        currentDayDate,
        attendanceNotationId: colorCode,
      }));

      console.log('Sending attendance payload:', payload); // Debug log

      const response = await axios.post(
        'http://192.168.6.210:8686/pipl/api/v1/employee/save-emp-attendance',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            secret_key: secretKey,
          },
        }
      );

      Alert.alert('Success', 'Attendance saved successfully!');
      return response.data;
    } catch (error) {
      

      Alert.alert('Error', 'Failed to save attendance.');
      throw error;
    }
  }, []);

  return saveAttendance;
};

export default useSaveAttendance;
