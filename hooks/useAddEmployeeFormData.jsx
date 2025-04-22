// import { useEffect, useState } from "react";
// import * as SecureStore from "expo-secure-store";

// const BASE_URL = "http://192.168.6.210:8686/pipl/api/v1/employee";

// // Get the secret key from SecureStore
// const getSecretKey = async () => {
//   const key = await SecureStore.getItemAsync("auth_token");
//   return key;
// };

// const useAddEmployeeFormData = () => {
//   const [departments, setDepartments] = useState([]);
//   const [designations, setDesignations] = useState([]);
//   const [employeeTypes, setEmployeeTypes] = useState([]);
//   const [bloodGroups, setBloodGroups] = useState([]);
//   const [maritalStatus, setMaritalStatus] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [nationalities, setNationalities] = useState([]);
//   const [genders, setGenders] = useState([]);
//   const [seniors, setSeniors] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);

//   // Fetch base data on mount
//   useEffect(() => {
//     fetchData(`${BASE_URL}/departments`, setDepartments);
//     fetchData(`${BASE_URL}/designations`, setDesignations);
//     fetchData(`${BASE_URL}/employeeTypes`, setEmployeeTypes);
//     fetchData(`${BASE_URL}/bloodGroups`, setBloodGroups);
//     fetchData(`${BASE_URL}/getMaritalStatus`, setMaritalStatus);
//     fetchData(`${BASE_URL}/categories`, setCategories);
//     fetchData(`${BASE_URL}/nationality`, setNationalities);
//     fetchData(`${BASE_URL}/genders`, setGenders);
//     fetchData(`${BASE_URL}/countries`, setCountries);
//     fetchData(`${BASE_URL}/states`, setStates);
//     fetchData(`${BASE_URL}/districts`, setDistricts);
//   }, []);
  

//   // Generic fetch helper with secret_key
//   const fetchData = async (url, setter) => {
//     try {
//       const secretKey = await getSecretKey();

//       if (!secretKey) {
//         console.error("No secret_key found in SecureStore");
//         return;
//       }

//       const response = await fetch(url, {
//         headers: {
//           "Content-Type": "application/json",
//           secret_key: secretKey,
//         },
//       });

//       const text = await response.text();

//       console.log(`Raw response from ${url}:\n`, text);

//       if (!response.ok) {
//         console.error("Error fetching data from", url, text);
//         return;
//       }

//       const contentType = response.headers.get("content-type");
//     if (contentType && contentType.includes("application/json")) {
//       const data = JSON.parse(text);
//       setter(Array.isArray(data) ? data : data.data || []);
//     } else {
//       console.warn(`Unexpected response format from ${url}:`, text);
//     }
//   } catch (error) {
//     console.error(`Error fetching data from ${url}`, error);
//   }
// };

//   // Dependent fetch: Designations by Department ID
//   const fetchDesignationsByDepartment = async (departmentId) => {
//     const url = `${BASE_URL}/getDesignationByDepartmentId/${departmentId}`;
//     fetchData(url, setDesignations);
//   };

//   // Dependent fetch: Seniors by Designation ID
//   const fetchSeniorsByDesignation = async (designationId) => {
//     const url = `${BASE_URL}/seniors/${designationId}`;
//     fetchData(url, setSeniors);
//   };

//   // Dependent fetch: States by Country ID
//   const fetchStatesByCountry = async (countryId) => {
//     const url = `${BASE_URL}/getStatesByCountryId/${countryId}`;
//     fetchData(url, setStates);
//   };

//   // Dependent fetch: Districts by State ID
//   const fetchDistrictsByState = async (stateId) => {
//     const url = `${BASE_URL}/getDistrictByStateId/${stateId}`;
//     fetchData(url, setDistricts);
//   };

//   return {
//     // Data
//     departments,
//     designations,
//     employeeTypes,
//     bloodGroups,
//     maritalStatus,
//     categories,
//     nationalities,
//     genders,
//     seniors,
//     countries,
//     states,
//     districts,

//     // Fetchers for dependent data
//     fetchDesignationsByDepartment,
//     fetchSeniorsByDesignation,
//     fetchStatesByCountry,
//     fetchDistrictsByState,
//   };
// };

// export default useAddEmployeeFormData;
