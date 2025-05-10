// utils/fetchMonthlyAttendance.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../services/api';

const fetchMonthlyAttendance = async (employeeId, month, year) => {
  try {
    const token = await SecureStore.getItemAsync('auth_token');

    const response = await axios.get(
      `${API_BASE_URL}/employee/getMonthlyAttendance/employeeId/${employeeId}/month/${month}/year/${year}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'secret_key': token,
        },
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
};

export default fetchMonthlyAttendance;
