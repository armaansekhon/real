import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../services/api";

const BASE_URL = `${API_BASE_URL}/employee`;

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
    console.log(`Raw response from ${endpoint}:`, rawText);
    let data;

    try {
      data = JSON.parse(rawText);
    } catch (err1) {
      console.error(`First parse failed for ${endpoint}:`, err1.message);
      return [];
    }

    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (err2) {
        console.error(`Second parse failed for ${endpoint}:`, err2.message);
        return [];
      }
    }

    console.log(`Parsed data from ${endpoint}:`, data);
    if (Array.isArray(data)) return data;
    if (typeof data === "object" && data.error) {
      console.warn(`API error for ${endpoint}:`, data.error);
      return [];
    }
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
  const [maritalStatuses, setMaritalStatuses] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [genders, setGenders] = useState([]);
  const [seniors, setSeniors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setDepartments(await fetchData("departments"));
      setEmployeeTypes(await fetchData("employeeTypes"));
      setBloodGroups(await fetchData("bloodGroups"));
      setCountries(
        (await fetchData("countries")).map((item) => ({
          label: item.country || item.name || "Unknown",
          value: item.id,
        }))
      );
      setMaritalStatuses(await fetchData("getMaritalStatus"));
      setNationalities(await fetchData("nationality"));
      setGenders(await fetchData("genders"));
      setCategories(await fetchData("categories"));
      // CHANGE: Removed pincodes fetch since it's a normal input field
      setLoading(false);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadByDepartment = async () => {
      if (selectedDepartmentId && selectedDepartmentId !== "") {
        const data = await fetchData(`getDesignationByDepartmentId/${selectedDepartmentId}`);
        console.log("Mapped designations:", data.map((item) => ({
          label: item.name || item.designation || "Unknown",
          value: item.id,
        }))); // CHANGE: Added debug log for designations
        setDesignations(data);
        // CHANGE: Removed setSeniors(data) to avoid overwriting seniors
      }
    };
    loadByDepartment();
  }, [selectedDepartmentId]);

  useEffect(() => {
    console.log("Fetching seniors for selectedDesignationId:", selectedDesignationId);
    const loadSeniors = async () => {
      if (selectedDesignationId) {
        setLoading(true);
        const data = await fetchData(`seniors/${selectedDesignationId}`);
        // CHANGE: More flexible mapping with additional fallbacks
        const mappedSeniors = Array.isArray(data) ? data.map((item, index) => ({
          label: item.name || item.employeeName || item.fullName || item.n || `Senior ${index + 1}`,
          value: item.id || item.employeeId || index,
        })) : [];
        console.log("Mapped seniors:", mappedSeniors);
        setSeniors(mappedSeniors);
        setLoading(false);
      } else {
        console.log("Clearing seniors: selectedDesignationId is invalid");
        setSeniors([]);
      }
    };
    loadSeniors();
  }, [selectedDesignationId]);

  useEffect(() => {
    const loadStates = async () => {
      if (countryId) {
        setLoading(true);
        const data = await fetchData(`getStatesByCountryId/${countryId}`);
        console.log("Mapped states:", data.map((item) => ({
          label: item.state || item.name || "Unknown",
          value: item.id,
        })));
        setStates(
          data.map((item) => ({
            label: item.state || item.name || "Unknown",
            value: item.id,
          }))
        );
        setDistricts([]);
        setLoading(false);
      } else {
        setStates([]);
      }
    };
    loadStates();
  }, [countryId]);

  useEffect(() => {
    const loadDistricts = async () => {
      if (stateId) {
        setLoading(true);
        const data = await fetchData(`getDistrictByStateId/${stateId}`);
        console.log("Mapped districts:", data.map((item) => ({
          label: item.district || item.name || "Unknown",
          value: item.id,
        })));
        setDistricts(
          data.map((item) => ({
            label: item.district || item.name || "Unknown",
            value: item.id,
          }))
        );
        setLoading(false);
      } else {
        setDistricts([]);
      }
    };
    loadDistricts();
  }, [stateId]);

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
    maritalStatuses,
    nationalities,
    genders,
    // CHANGE: Removed pincodes from return since it's a normal input field
    categories: formatDropdown(categories, "category", "id"),
    seniors: seniors,
  };
}