// hooks/useLogin.js
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../services/api'; // adjust path as needed
import { Alert } from 'react-native';
import { useUser } from '../context/UserContext';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setUser, setUserType ,setimg,setdate} = useUser(); 

  const login = async (usercode, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usercode, password })
      });
  
      const data = await response.json();
      // console.log(" Login Response:", data);
  
      if (response.ok && data.secretKey) {
        await SecureStore.setItemAsync('auth_token', data.secretKey);
        setUser(data.user);
        setUserType(data.user.userCategoryCode);
        setimg(data.employeePic)
        setdate(data.currentDay)
   
        await SecureStore.setItemAsync('userType', data.user.userCategoryCode);
        await SecureStore.setItemAsync('userid', JSON.stringify(data.user.id));
        await SecureStore.setItemAsync('currentDayDate', (data.currentDay));
        await SecureStore.setItemAsync('privileges', JSON.stringify(data.privileges || []))
        console.log('Token stored:', data.secretKey, "type:",data.user.userCategoryCode,"acess:",data.user.privileges, data.currentDay);

        return { success: true,
          privileges: data.privileges || [],
         };
      } else {
        throw new Error(data.error || "Token not found in response");
      }
    } catch (error) {
      console.error(" Login error:", error.message);
      return false;
    }
    finally {
      setLoading(false); // ✅ always reset loading, success or error
    }
  };
  

//   const login = async (usercode, password) => {
//     setLoading(true);

//     try {
//       const response = await fetch(`${API_BASE_URL}/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ usercode, password }),
//       });

//       const data = await response.json();
//       console.log("Login Response:", data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       if (data?.token) {
//         await SecureStore.setItemAsync('userToken', data.token);
//         await SecureStore.setItemAsync('userInfo', JSON.stringify(data.user));
//         return { success: true };
//       } else {
//         Alert.alert('Login Failed', 'Token not found in response.');
//         return { success: false };
//       }

//     } catch (error) {
//       Alert.alert('Login Error', error.message || 'Something went wrong');
//       return { success: false };
//     } finally {
//       setLoading(false);
//     }
//   };


const fetchWithAuth = async (url: string, options: any = {}) => {
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



  const getUserData = async () => {
    try {
      const response = await fetchWithAuth('http://192.168.6.210:8686/pipl/api/v1/user-details');
  
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error('API error:', err);
    }
  };


  

  return { login, loading };
};

export default useLogin;
