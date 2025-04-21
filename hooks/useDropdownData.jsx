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
      console.error(" No secret_key found in SecureStore");
      return [];
    }

    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        secret_key: secretKey,
      },
    });

    const text = await response.text();

    if (!response.ok) {
      console.error(`Error response from ${endpoint}:`, text);
      return [];
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const json = JSON.parse(text);

      if (typeof json === "object" && !Array.isArray(json)) {
        return Object.entries(json).map(([key, value]) => ({ label: value, value: key }));
      }
      return Array.isArray(json) ? json : json.data || [];
    } else {
      console.warn(` Unexpected response type from ${endpoint}:`, text);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

export default function useDropdownData(selectedDepartmentId, selectedCountryId, selectedStateId, selectedDesignationId) {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [maritalStatuses, setMaritalStatuses] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [genders, setGenders] = useState([]);
  const [seniors, setSeniors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setDepartments(await fetchData("departments"));
      setDesignations(await fetchData("designations"));
      setEmployeeTypes(await fetchData("employeeTypes"));
      setBloodGroups(await fetchData("bloodGroups"));
      setCountries(await fetchData("countries"));
      setStates(await fetchData("states"));
      setDistricts(await fetchData("districts"));
      setMaritalStatuses(await fetchData("getMaritalStatus"));
      setNationalities(await fetchData("nationality"));
      setGenders(await fetchData("genders"));
      setLoading(false);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadByDepartment = async () => {
      if (selectedDepartmentId) {
        const data = await fetchData(`getDesignationByDepartmentId/${selectedDepartmentId}`);
        setDesignations(data);
      }
    };
    loadByDepartment();
  }, [selectedDepartmentId]);

  useEffect(() => {
    const loadByCountry = async () => {
      if (selectedCountryId) {
        const data = await fetchData(`getStatesByCountryId/${selectedCountryId}`);
        setStates(data);
      }
    };
    loadByCountry();
  }, [selectedCountryId]);

  useEffect(() => {
    const loadByState = async () => {
      if (selectedStateId) {
        const data = await fetchData(`getDistrictByStateId/${selectedStateId}`);
        setDistricts(data);
      }
    };
    loadByState();
  }, [selectedStateId]);


  useEffect(() => {
    const loadSeniors = async () => {
      if (selectedDesignationId) {
        const data = await fetchData(`seniors/${selectedDesignationId}`);
        setSeniors(data);
      }
    };
    loadSeniors();
  }, [selectedDesignationId]);

  const formatDropdown = (dataList, labelKey = "name", valueKey = "id") =>
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
    countries: formatDropdown(countries, "country", "id"),
    states: formatDropdown(states, "state", "id"),
    districts: formatDropdown(districts, "district", "id"),
    maritalStatuses,
    nationalities,
    genders,
    seniors: formatDropdown(seniors, "name", "id"),
  };
}
