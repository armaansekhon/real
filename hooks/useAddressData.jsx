// import { useState, useEffect } from 'react';
// import * as SecureStore from 'expo-secure-store';

// const BASE_URL = 'http://192.168.6.210:8686/pipl/api/v1/employee';

// const getSecretKey = async () => {
//   return await SecureStore.getItemAsync("auth_token");
// };

// export const useAddressData = () => {
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);

//   const [selectedCountryId, setSelectedCountryId] = useState(null);
//   const [selectedStateId, setSelectedStateId] = useState(null);

//   const [loading, setLoading] = useState({
//     countries: false,
//     states: false,
//     districts: false,
//   });

//   const fetchCountries = async () => {
//     try {
//       setLoading((prev) => ({ ...prev, countries: true }));
  
//       const token = await SecureStore.getItemAsync("auth_token");
//       if (!token) {
//         console.error("❌ No token found in SecureStore");
//         throw new Error("Missing token");
//       }
  
//       const res = await fetch(`${BASE_URL}/countries`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json',
//         },
//       });
  
//       const contentType = res.headers.get('content-type');
  
//       if (!contentType || !contentType.includes('application/json')) {
//         const rawText = await res.text();
//         console.error('Non-JSON response:', rawText);
//         throw new Error('Server did not return JSON');
//       }
  
//       const data = await res.json();
//       setCountries(data?.data || []);
//     } catch (error) {
//       console.error('Error fetching countries:', error);
//     } finally {
//       setLoading((prev) => ({ ...prev, countries: false }));
//     }
//   };

//   const fetchStatesByCountryId = async (countryId) => {
//     try {
//       setLoading((prev) => ({ ...prev, states: true }));
//       const token = await getSecretKey();
//       const res = await fetch(`${BASE_URL}/getStatesByCountryId/${countryId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       setStates(data?.data || []);
//     } catch (error) {
//       console.error('Error fetching states:', error);
//     } finally {
//       setLoading((prev) => ({ ...prev, states: false }));
//     }
//   };

//   const fetchDistrictsByStateId = async (stateId) => {
//     try {
//       setLoading((prev) => ({ ...prev, districts: true }));
//       const token = await getSecretKey();
//       const res = await fetch(`${BASE_URL}/getDistrictByStateId/${stateId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       setDistricts(data?.data || []);
//     } catch (error) {
//       console.error('Error fetching districts:', error);
//     } finally {
//       setLoading((prev) => ({ ...prev, districts: false }));
//     }
//   };

//   // Load countries on first render
//   useEffect(() => {
//     fetchCountries();
//   }, []);

//   // Fetch states when country changes
//   useEffect(() => {
//     if (selectedCountryId) {
//       fetchStatesByCountryId(selectedCountryId);
//       setSelectedStateId(null);
//       setDistricts([]);
//     }
//   }, [selectedCountryId]);

//   // Fetch districts when state changes
//   useEffect(() => {
//     if (selectedStateId) {
//       fetchDistrictsByStateId(selectedStateId);
//     }
//   }, [selectedStateId]);

//   return {
//     countries,
//     states,
//     districts,
//     selectedCountryId,
//     selectedStateId,
//     setSelectedCountryId,
//     setSelectedStateId,
//     loading,
//   };
// };
