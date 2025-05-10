import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { Dimensions } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../services/api";

import useDropdownData from "../hooks/useDropdownData";

const { height } = Dimensions.get("window");

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
    if (typeof data === "object")
      return Object.entries(data).map(([label, value]) => ({ label, value }));

    return [];
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err.message);
    return [];
  }
};

const CustomDropdown = ({ value, setValue, data, placeholder, loading }) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <Dropdown
      style={[styles.dropdown, isFocus && { borderColor: "#5aaf57" }]}
      placeholderStyle={styles.dropdownPlaceholder}
      selectedTextStyle={styles.dropdownPlaceholder}
      data={data}
      maxHeight={200}
      labelField="label"
      valueField="value"
      placeholder={loading ? "Loading..." : placeholder}
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        setValue(item.value);
        setIsFocus(false);
      }}
    />
  );
};

export default function EmployeeDetailsForm({ initialData, onNext }) {
  const [data, setData] = useState(initialData || {});
  const [image, setImage] = useState(null);
  const [imagebyte,setimagebyte]=useState(null)



  const [imagetype,setimageType]=useState(null);

  const [showSave, setShowSave] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [seniors, setSeniors] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [loadingSeniors, setLoadingSeniors] = useState(false);

  const { employeeTypes, loading } = useDropdownData();

  const formatDropdown = (dataList = [], labelKey = "name", valueKey = "id") =>
    dataList.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));

  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingDepartments(true);
      const deptData = await fetchData("departments");
      setDepartments(formatDropdown(deptData, "department", "id"));
      setLoadingDepartments(false);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadByDepartment = async () => {
      if (data.department && data.department !== "") {
        setLoadingDesignations(true);
        const desigData = await fetchData(
          `getDesignationByDepartmentId/${data.department}`
        );
        console.log(
          "Mapped designations:",
          desigData.map((item) => ({
            label: item.name || item.designation || "Unknown",
            value: item.id,
          }))
        );
        setDesignations(
          formatDropdown(desigData, "name", "id")
        );
        setLoadingDesignations(false);
      } else {
        setDesignations([]);
      }
    };
    loadByDepartment();
  }, [data.department]);

  useEffect(() => {
    console.log("Fetching seniors for designationId:", data.designation);
    const loadSeniors = async () => {
      if (data.designation) {
        setLoadingSeniors(true);
        const seniorData = await fetchData(`seniors/${data.designation}`);
        const mappedSeniors = Array.isArray(seniorData)
          ? seniorData.map((item, index) => ({
              label:
                item.name ||
                item.senior ||
                item.fullName ||
                item.n ||
                `Senior ${index + 1}`,
              value: item.id || item.employeeId || index,
            }))
          : [];
        console.log("Mapped seniors:", mappedSeniors);
        setSeniors(mappedSeniors);
        setLoadingSeniors(false);
      } else {
        console.log("Clearing seniors: designationId is invalid");
        setSeniors([]);
      }
    };
    loadSeniors();
  }, [data.designation]);

  const handleValueChange = (key, value) => {
    console.log(`handleValueChange: key=${key}, value=${value}`);
    setData((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "department" && { designation: null, senior: null }),
      ...(key === "designation" && { senior: null }),
    }));
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const validateFields = () => {
    const requiredFields = [
      "department",
      "designation",
      "employeeType",
      "name",
      "joiningDate",
    ];

    for (const field of requiredFields) {
      const value = data[field];
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        Alert.alert("Missing Field", `Please fill in ${field}`);
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.5,
    });
  
    if (!result.canceled) {
      const seluri = result.assets[0];
      setImage(seluri.uri);
      const byte=seluri.base64;
      setimagebyte(seluri.base64);
  
      // Update data with seluri.base64 directly instead of imagebyte
     // setData({ ...data, employeePic: byte });
      // console.log(" data printed :",data);
  
      if (seluri.uri) {
        const fileExtension = seluri.uri.split('.').pop().toLowerCase();
        const mimeType =
          fileExtension === 'jpg' || fileExtension === 'jpeg'
            ? 'image/jpeg'
            : fileExtension === 'png'
            ? 'image/png'
            : fileExtension === 'webp'
            ? 'image/webp'
            : 'image/*';
      //  console.log("mimeType :", mimeType);
       // console.log("seluri.base64 :", seluri.base64);
       const userSelectedImageType=mimeType;
        setimageType(mimeType);
    // Use mimeType directly

        //console.log("byte :", byte);
        setData({ ...data, employeePic: byte , pictureType: userSelectedImageType});
        // setData({ ...data, });
        //console.log(" data printed :",...data);
       // setShowSave(true);
      }
    }
  };

  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
      
  //     base64:true,
  //     quality: 0.5,
  //   });

  //   if (!result.canceled) {
  //     const seluri = result.assets[0];
  //     setImage(seluri.uri);
  //     setimagebyte(seluri.base64)
  //     setData({ ...data, employeePic:imagebyte});
  //     console.log(" seluri.base64 :",data);

  //     console.log(" seluri.base64 :",imagebyte);
     
    

  //   if(seluri.uri){
  //     const fileExtension=seluri.uri.split('.').pop.toLowerCase();
  //     const mimeType=fileExtension==='jpg'||fileExtension==='jpeg'?'image/jpeg':fileExtension==='png'?'image/png':fileExtension ==='webp'?'image/webp':'image/*';
  //     console.log(" mimeType :"+mimeType);
  //     console.log(" seluri.base64 :"+seluri.base64);
  //     console.log(mimeType);
  //     setimageType(mimeType);
  //     setData({...data, pictureType:imagetype});
      
  //     setShowSave(true);
  //   }
  // }
  // };

  const groupedFields = [
    [
      { key: "department", placeholder: "Department" },
      { key: "designation", placeholder: "Designation" },
    ],
    [{ key: "senior", placeholder: "Report To" }],
    [{ key: "employeeType", placeholder: "Employee Type" }],
    [
      { key: "name", placeholder: "Name" },
      { key: "joiningDate", placeholder: "Joining Date" },
    ],
    [
      { key: "fatherName", placeholder: "Father Name" },
      { key: "motherName", placeholder: "Mother Name" },
    ],
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Employee</Text>
          <Text style={styles.headerSubTitle}>Details</Text>
          <Text style={styles.headerDesc}>
            Fill out the Employee Details below
          </Text>
        </View>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholder]}>
              <Ionicons name="person-circle-outline" size={60} color="#ccc" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {showSave && (
        <TouchableOpacity
          style={styles.saveIconButton}
          onPress={() => alert("Image saved locally!")}
        >
          <Ionicons name="save-outline" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.flexGrid}>
          {groupedFields.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={[styles.rowContainer, { zIndex: 1000 - rowIndex * 10 }]}
            >
              {row.map((item) => (
                <View key={item.key} style={[styles.inputWrapper, { flex: 1 }]}>
                  <Text style={styles.label}>
                    {item.placeholder}
                    {[
                      "department",
                      "designation",
                      "employeeType",
                      "name",
                      "joiningDate",
                    ].includes(item.key) && (
                      <Text style={{ color: "red" }}>*</Text>
                    )}
                  </Text>
                  {["department", "designation", "senior", "employeeType"].includes(
                    item.key
                  ) ? (
                    <CustomDropdown
                      value={data[item.key]}
                      setValue={(val) => handleValueChange(item.key, val)}
                      data={
                        item.key === "department"
                          ? departments
                          : item.key === "designation"
                          ? designations
                          : item.key === "senior"
                          ? seniors
                          : item.key === "employeeType"
                          ? employeeTypes
                          : []
                      }
                      placeholder={item.placeholder}
                      loading={
                        item.key === "department"
                          ? loadingDepartments
                          : item.key === "designation"
                          ? loadingDesignations
                          : item.key === "senior"
                          ? loadingSeniors
                          : loading
                      }
                    />
                  ) : item.key === "joiningDate" ? (
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      style={[styles.input]}
                    >
                      <Text
                        style={[
                          styles.select,
                          { color: "#333", fontFamily: "PlusR" },
                        ]}
                      >
                        {data.joiningDate || "Select Date"}
                      </Text>
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#777"
                      />
                    </TouchableOpacity>
                  ) : (
                    <TextInput
                      style={styles.input}
                      placeholder={item.placeholder}
                      value={data[item.key] || ""}
                      onChangeText={(text) =>
                        setData({ ...data, [item.key]: text })
                      }
                    />
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={data.joiningDate ? new Date(data.joiningDate) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setData({
                  ...data,
                  joiningDate: selectedDate.toISOString().split("T")[0],
                });
              }
            }}
          />
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => {
          if (validateFields()) {
            onNext(data);
          }
        }}
      >
        <Ionicons name="arrow-forward-circle" size={55} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  nextButton: {
    alignItems: "center",
    marginTop: 20,
  },
  saveIconButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 50,
    position: "absolute",
    right: 20,
    top: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: Platform.OS === "ios" ? 60 : 70,
  },
  headerTextContainer: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 70,
    resizeMode: "cover",
  },
  placeholder: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 35,
    fontFamily: "PlusSB",
  },
  headerSubTitle: {
    fontSize: 30,
    fontFamily: "PlusSB",
    color: "#5aaf57",
    marginTop: -5,
  },
  headerDesc: {
    fontSize: 13,
    fontFamily: "PlusR",
    marginTop: 5,
  },
  flexGrid: {
    flexDirection: "column",
    gap: 16,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    marginBottom: 4,
    minWidth: 100,
  },
  input: {
    height: 42,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: "PlusR",
    borderColor: "#ccc",
    borderWidth: 1,
    elevation: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    fontFamily: "PlusSB",
    marginBottom: 4,
    color: "#5aaf57",
  },
  dropdown: {
    height: 42,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 13,
    fontFamily: "PlusR",
    justifyContent: "center",
    zIndex: 1000,
  },
  dropdownPlaceholder: {
    color: "#333",
    fontFamily: "PlusR",
    fontSize: 14,
  },
});