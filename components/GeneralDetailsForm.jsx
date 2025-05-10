import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import RNPickerSelect from "react-native-picker-select";

import useDropdownData from "../hooks/useDropdownData";

const { height } = Dimensions.get("window");



const CustomDropdown = ({ value, setValue, data, placeholder }) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <Dropdown
      style={[styles.dropdown, isFocus && { borderColor: "#5aaf57", }]}
      placeholderStyle={styles.dropdownPlaceholder}
      selectedTextStyle={styles.dropdownPlaceholder}
      data={data}
      maxHeight={200}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
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


export default function GeneralDetailsForm({ initialData, onNext, onBack }) {
  const [data, setData] = useState(initialData || {});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSave, setShowSave] = useState(false);
  // const [bloodGroups, setBloodGroups] = useState(false);
  // const [maritalStatuses, setMaritalStatuses] = useState(false);
  // const [nationalities, setNationalities] = useState(false);
  // const [genders, setGenders] = useState(false);
  // const [seniors, setSeniors] = useState(false);


  const { bloodGroups , maritalStatuses, nationalities, genders, seniors, categories, loading } = useDropdownData(
    data.department
  );

  const handleValueChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "department" && { designation: null }), // reset designation if department changes
    }));
  };

  const groupedFields = [
    [
      { key: "mobile",  placeholder: " Mobile " },
      { key: "email",  placeholder: " Email " },
      
    ],
    [
      { key: "gender", placeholder: "Gender" },
      { key: "nationality", placeholder: "Nationality" },
      
    ],
    [ { key: "category", placeholder: "Category" },],
    [{ key: "officialEmail", placeholder: "Official Email" },
     
      
    ],
    [
      { key: "officialMobile", placeholder: "Official Mobile" },
      
    ],
    [
      { key: "salary", placeholder: "Salary" },
    
      
      
    ],
    [
     
      { key: "motherTongue", placeholder: "Mother Tongue" },
      { key: "dob", placeholder: "DOB" },
    ],


    [
      { key: "bloodGroup", placeholder: "Blood Group" },
      { key: "maritalStatus", placeholder: "Marital Status" },
    ],

  ];
  const requiredFields = ['mobile', 'email']; 
  const options = {
    gender: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Other", value: "Other" },
    ],
    nationality: [
      { label: "Indian", value: "Indian" },
      { label: "Other", value: "Other" },
    ],
    category: [
      { label: "General", value: "General" },
      { label: "OBC", value: "OBC" },
      { label: "SC", value: "SC" },
      { label: "ST", value: "ST" },
    ],
    // senior: [
    //   { label: "Manager A", value: "Manager A" },
    //   { label: "Manager B", value: "Manager B" },
    // ],
    bloodGroup: [
      { label: "A+", value: "A+" },
      // { label: "B+", value: "B+" },
      // { label: "AB+", value: "AB+" },
      // { label: "O+", value: "O+" },
      // { label: "O-", value: "O-" },
    ],
    maritalStatus: [
      { label: "Single", value: "Single" },
      // { label: "Married", value: "Married" },
    ],
  };

  const dropdownKeys = Object.keys(options);

  // const [dropdowns, setDropdowns] = useState({});
  // const [openDropdown, setOpenDropdown] = useState({});

  const handleDropdownChange = (key, value) => {
    setDropdowns({ ...dropdowns, [key]: value });
    setData({ ...data, [key]: value });
    setShowSave(true);
  };
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
  
    if (!data.email || !emailRegex.test(data.email)) {
      alert("Please enter a valid email address.");
      return false;
    }
  
    if (!data.mobile || !mobileRegex.test(data.mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return false;
    }
  
    return true;
  };
  const getRequiredMark = (key) => {
    return requiredFields.includes(key) ? (
      <Text style={{ color: 'red', fontSize: 12, marginLeft: 2 }}>
        *
      </Text>
    ) : null;
  };
  

  return (
    <SafeAreaView style={styles.container}>
  {/* Header stays outside ScrollView */}
  <View style={styles.headerRow}>
    <View style={styles.headerTextContainer}>
      <Text style={styles.headerTitle}>General <Text style={styles.greenText}>Details</Text></Text>
      {/* <Text style={styles.headerSubTitle}>Details</Text> */}
      <Text style={styles.headerDesc}>
        Fill out the General Details below
      </Text>

      
    </View>
  
  </View>

  {/* ScrollView only for form fields */}
  <ScrollView 
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode="on-drag"
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 80 }}>

    
    <View style={styles.flexGrid}>
      {groupedFields.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[styles.rowContainer, { zIndex: 1000 - rowIndex * 10 }]}
        >
          {row.map((item) => (
            <View key={item.key} style={styles.inputWrapper}>
        <Text style={[styles.label, item.key === 'mobile' || item.key === 'email' ? styles.requiredLabel : null]}>
  {item.placeholder}
  {getRequiredMark(item.key)}
</Text>

              {dropdownKeys.includes(item.key) ? (
  <CustomDropdown
    value={data[item.key]}
    setValue={(val) => handleValueChange(item.key, val)}
    data={
      item.key === "bloodGroup"
        ? bloodGroups
        : item.key === "maritalStatus"
        ? maritalStatuses
        : item.key === "nationality"
        ? nationalities
        : item.key === "gender"
        ? genders
        // : item.key === "senior"
        // ? seniors
        : item.key === "category"
        ? categories
        : options[item.key] || []
    }
    placeholder={` ${item.placeholder}`}
  />
) : item.key === "dob" ? (
  <TouchableOpacity
    onPress={() => setShowDatePicker("dob")}
    style={styles.input}
  >
    <Text
      style={{
        color: data.dob ? "#000" : "#333",
        fontFamily: "PlusR",
        fontSize: 13,
      }}
    >
      {data.dob || "Select Date"}
    </Text>
    <Ionicons name="calendar-outline" size={18} color="#777" />
  </TouchableOpacity>
// ) : item.key === "joiningDate" ? (
  // <TouchableOpacity
  //   onPress={() => setShowDatePicker("joiningDate")}
  //   style={styles.input}
  // >
  //   <Text
  //     style={{
  //       color: data.joiningDate ? "#000" : "#333",
  //       fontFamily: "PlusR",
  //       fontSize: 13,
  //     }}
  //   >
  //     {data.joiningDate || "Select Date"}
  //   </Text>
  //   <Ionicons name="calendar-outline" size={18} color="#777" />
  // </TouchableOpacity>
) : (
  <TextInput
    style={styles.input}
    placeholder={item.placeholder}
    placeholderTextColor="#333"
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
      value={
        data[showDatePicker]
          ? new Date(data[showDatePicker])
          : new Date()
      }
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          setShowDatePicker(false);
          if (selectedDate) {
            setData({
              ...data,
              [showDatePicker]: selectedDate.toISOString().split("T")[0],
            });
          }
        }}
      />
    )}
  </ScrollView>

  {/* Buttons */}
  <View style={styles.buttonsContainer}>
    <TouchableOpacity onPress={onBack}>
    <Ionicons
              name="chevron-back-circle-sharp"
              size={55}
              color="black"
            />

  
      {/* <Text>Back</Text> */}
    </TouchableOpacity>
    {/* <TouchableOpacity onPress={() => {
  if (validateForm()) {
    onNext(data);
  }
}}> */}
      <TouchableOpacity onPress={async () => {
  if (validateForm()) {
    try {
      const response = await onNext(data); // assuming onNext returns a response object
      if (
        response?.status === "warning" &&
        response?.message?.toLowerCase().includes("contact number already exists")
      ) {
        alert("This mobile number already exists. Please use a different one.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Something went wrong. Please try again.");
    }
  }
}}
>
  
    <Ionicons
              name="chevron-forward-circle-sharp"
              size={55}
              color="black"
            />
      
    </TouchableOpacity>
  </View>
</SafeAreaView>
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
   
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    // marginTop: 50,
    marginTop: Platform.OS === 'ios' ? 60 : 50,
  },

  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 35,
    fontFamily: "PlusSB",
  },
  
  greenText: {
    color: "#5aaf57",
    // fontFamily: "PlusSB",
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
    fontSize: 13,
    fontFamily: "PlusR",
    borderColor: "#ccc",
    borderWidth: 1,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
    // elevation: 2,
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },






  dropdown: {
    height: 42,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 14,
    fontFamily: "PlusR",
    justifyContent: "center",
    zIndex: 1000,
  },
  
  dropdownContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 10,
    zIndex: 999,
  },
  
  dropdownPlaceholder: {
    color: "#333",
    fontFamily: "PlusR",
    fontSize: 14
  }
  




  
});