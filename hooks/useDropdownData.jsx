import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://192.168.6.210:8686/pipl/api/v1/employee";



// Helper to fetch secret_key from SecureStore
const getSecretKey = async () => {
  const key = await SecureStore.getItemAsync("auth_token");
  return key;
};


const fetchData = async (endpoint) => {
  try {
    const secretKey = await getSecretKey();


    if (!secretKey) {
      console.error("No secret_key found in SecureStore");
      return [];
    }

    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        secret_key: secretKey,
      },
    });

    const rawText = await response.text();

    // console.log(`🧾 Raw response from ${endpoint}:`, rawText); // <-- Add this line

    let data;

    // Try parsing once
    try {
      data = JSON.parse(rawText);
    } catch (err1) {
      console.error(` First parse failed from ${endpoint}:`, err1.message);
      return [];
    }

    // Try parsing again if it's still a string
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (err2) {
        console.error(` Second parse failed from ${endpoint}:`, err2.message);
        return [];
      }
    }

    // Just return a fallback if still not usable
    if (Array.isArray(data)) return data;
    if (typeof data === "object") return Object.entries(data).map(([label, value]) => ({ label, value }));

    return [];
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err.message);
    return [];
  }
};


export default function useDropdownData(selectedDepartmentId, countryId, stateId, selectedDesignationId) {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  // const [countries, setCountries] = useState<{ id: number, country: string }[]>([]);
  // const [states, setStates] = useState<{ id: number, state: string }[]>([]);
  // const [districts, setDistricts] = useState<{ id: number, district: string }[]>([]);

  const [maritalStatuses, setMaritalStatuses] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [genders, setGenders] = useState([]);
  const [seniors, setSeniors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pincode, setPincode] = useState([]);
  const [loading, setLoading] = useState(true);


  const [value, setValue] = useState({
    country: "",
    state: "",
    district: "",
  });

  

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setDepartments(await fetchData("departments"));
      setDesignations(await fetchData("designations"));
      setEmployeeTypes(await fetchData("employeeTypes"));
      setBloodGroups(await fetchData("bloodGroups"));
      setCountries(await fetchData("countries"));
      // setStates(await fetchData("states"));
      // setDistricts(await fetchData("districts"));
      setMaritalStatuses(await fetchData("getMaritalStatus"));
      setNationalities(await fetchData("nationality"));
      setGenders(await fetchData("genders"));
      setCategories(await fetchData("categories"));
      setPincodes(await fetchData("pincodes"));
      setLoading(false);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadByDepartment = async () => {
      if (selectedDepartmentId && selectedDepartmentId !== "") {
        const data = await fetchData(`getDesignationByDepartmentId/${selectedDepartmentId}`);
        setDesignations(data);
      }
    };
    loadByDepartment();
  }, [selectedDepartmentId]);

  useEffect(() => {
    const loadCountries = async () => {
      const data = await fetchData("countries");
      setCountries(data);
    };
    loadCountries();
  }, []);

  // const onCountryChange = async (countryId) => {
  //   setValue((prev) => ({ ...prev, country: countryId, state: "", district: "" }));
  //   const data = await fetchData(`getStatesByCountryId/${countryId}`);
  //   setStates(data);
  //   setDistricts([]);
  // };



  const onCountryChange = async (countryId) => {
    if (!countryId) {
      console.error("Invalid countryId:", countryId);
      return;
    }
  
    setValue((prev) => ({ ...prev, country: countryId, state: "", district: "" }));
  
    try {
      const data = await fetchData(`getStatesByCountryId/${countryId}`);
      setStates(data);
      setDistricts([]); // Clear districts when country changes
    } catch (error) {
      console.error("Error fetching states:", error.message);
      setStates([]); // Reset states on error
    }
  };

  // const onStateChange = async (stateId) => {
  //   setValue((prev) => ({ ...prev, state: stateId, district: "" }));
  //   const data = await fetchData(`getDistrictByStateId/${stateId}`);
  //   setDistricts(data);
  // };


  const onStateChange = async (stateId) => {
    if (!stateId) {
      console.error("Invalid stateId:", stateId);
      return;
    }
  
    setValue((prev) => ({ ...prev, state: stateId, district: "" }));
  
    try {
      const data = await fetchData(`getDistrictByStateId/${stateId}`);
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts:", error.message);
      setDistricts([]); // Reset districts on error
    }
  };



  // // Fetch countries
  // useEffect(() => {
  //   const loadCountries = async () => {
  //     setLoading(true);
  //     const data = await fetchData("countries");
  //     setCountries(data); // where item = { id, country }
  //     // setCountries(
  //     //   data.map((item) => ({
  //     //     label: item.countryName,
  //     //     value: item.id,
  //     //   }))
  //     // );
  //     setLoading(false);
  //   };
  //   loadCountries();
  // }, []);








  // Fetch states by country
  // useEffect(() => {
  //   const loadStates = async () => {
  //     if (countryId) {
  //       setLoading(true);
  //       const data = await fetchData(`getStatesByCountryId/${countryId}`);
  //       setStates(data);    // where item = { id, state }
  //       // setStates(
  //       //   data.map((item) => ({
  //       //     label: item.stateName,
  //       //     value: item.id,
  //       //   }))
  //       // );
  //       setDistricts([]); // Clear districts when country changes
  //       setLoading(false);
  //     }
  //   };
  //   loadStates();
  // }, [countryId]);








  
  // // Fetch districts by state
  // useEffect(() => {
  //   const loadDistricts = async () => {
  //     if (stateId) {
  //       setLoading(true);
  //       const data = await fetchData(`getDistrictByStateId/${stateId}`);
  //       setDistricts(data); // where item = { id, district }
  //       // setDistricts(
  //       //   data.map((item) => ({
  //       //     label: item.districtName,
  //       //     value: item.id,
  //       //   }))
  //       // );
  //       setLoading(false);
  //     }
  //   };
  //   loadDistricts();
  // }, [stateId]);




  useEffect(() => {
    const loadSeniors = async () => {
      if (selectedDesignationId) {
        const data = await fetchData(`seniors/${selectedDesignationId}`);
        setSeniors(data);
      }
    };
    loadSeniors();
  }, [selectedDesignationId]);



  const formatDropdown = (dataList = [], labelKey = "name", valueKey = "id") =>
    dataList.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  return {
    loading,
    departments: formatDropdown(departments, "department", "id"),
    designations: formatDropdown(designations, "name", "id"),
    employeeTypes: formatDropdown(employeeTypes, "employeeType", "id"),
    bloodGroups: formatDropdown(bloodGroups, "bloodGroup", "id"),
    countries,
    states,
    districts,
    // countries: formatDropdown(countries, "country", "id"),
    // states: formatDropdown(states, "state", "id"),
    // districts: formatDropdown(districts, "district", "id"),
    maritalStatuses,
    nationalities,
    genders,
    pincodes: formatDropdown(pincode, "pincode", "id"), // Ensure this is returned
    categories: formatDropdown(categories, "category", "id"),
    seniors: formatDropdown(seniors, "name", "id"),
  };
}
