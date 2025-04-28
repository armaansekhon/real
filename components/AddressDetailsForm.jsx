import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import useDropdownData from "../hooks/useDropdownData";

const CustomDropdown = ({ value, setValue, data, placeholder, labelField = "label", valueField = "value"}) => {
  const [isFocus, setIsFocus] = useState(false);

  // const [selectedCountry, setSelectedCountry] = useState(null);
  // console.log("data", data);

  return (
    <Dropdown
      style={[styles.dropdown, isFocus && { borderColor: "#5aaf57" }]}
      placeholderStyle={styles.dropdownPlaceholder}
      selectedTextStyle={styles.dropdownPlaceholder}
      data={data}
      maxHeight={200}
      // labelField={labelField}
      // valueField={valueField}
      labelField="country"
      valueField="id"
      placeholder={placeholder}
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        setValue(item[valueField]);
        setValue(item.id);
        // setSelectedCountry(item.id);
        setIsFocus(false);
      }}
    />
  );
};






export default function AddressDetailsForm({ initialData, onSubmit, onBack }) {
  const [data, setData] = useState(initialData || {});
  const [showDatePicker, setShowDatePicker] = useState(false);

  // const [dropdowns, setDropdowns] = useState({
  //   country: null,
  //   district: null,
  //   state: null,
  //   // city: null,
  //   // addressLine1: null,
  //   // addressLine2: null,
  // });
  const validateForm = () => {
    let isFormValid = true;

    // Check all required dropdowns
    Object.keys(dropdowns).forEach((key) => {
      if (!dropdowns[key]) {
        isFormValid = false;
        alert(`Please select an option for ${key.replace(/([A-Z])/g, " $1").trim()}`);
      }
    });

    // Check all required text fields
    Object.keys(data).forEach((key) => {
      if (!data[key] || data[key].trim() === "") {
        isFormValid = false;
        alert(`Please fill in the ${key.replace(/([A-Z])/g, " $1").trim()} field`);
      }
    });

    return isFormValid;
  };

  const getRequiredMark = (key) => {
    return <Text style={{ color: 'red', fontSize: 12, marginLeft: 2 }}>*</Text>;}
  const groupedFields = [
    [
      { key: "country", placeholder: "Country" },
      { key: "district", placeholder: "District" },
    ],
    [
      { key: "state", placeholder: "State" },
      { key: "city", placeholder: "City" },
    ],
    [{ key: "addressLine1", placeholder: "Address Line 1" }],
    [{ key: "addressLine2", placeholder: "Address Line 2" }],
  ];


  const options = {
    country: [
      { label: "India", value: 1 },
      { label: "Other", value: 2 },
    ],
    district: [
      { label: "Other", value: 2 },
    ],
    state: [
      { label: "Full-Time", value: "Full-Time" },
      { label: "Part-Time", value: "Part-Time" },
      { label: "Contract", value: "Contract" },
    ],
    // city: [
    //   { label: "Permanent", value: "Permanent" },
    //   { label: "Temporary", value: "Temporary" },
    // ],
    // addressLine1: [
    //   { label: "React", value: "React" },
    //   { label: "Node.js", value: "Node.js" },
    //   { label: "Python", value: "Python" },
    // ],
    // addressLine2: [
    //   { label: "React", value: "React" },
    //   { label: "Node.js", value: "Node.js" },
    //   { label: "Python", value: "Python" },
    // ],
  };


  const handleValueChange = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  
    // Additional behavior based on the field selected
    if (key === "country") {
      console.log("Country dropdown selected value:", value);
      setCountryId(value); // you must define setCountryId using useState
      setStateId(null);    // same for setStateId
    }
  };


  const { countries, states, districts } = useDropdownData(data.country, data.state);
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Address</Text>
          <Text style={styles.headerSubTitle}>Details</Text>
          <Text style={styles.headerDesc}>
            Fill out the Address Details below
          </Text>
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.flexGrid}
      >
        {groupedFields.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[styles.rowContainer, { zIndex: 1000 - rowIndex * 10 }]}
          >
             {row.map((item, itemIndex) => (
      <View key={item?.key || itemIndex} style={styles.inputWrapper}>
        <Text style={styles.label}>
          {item?.placeholder || "Unknown Field"}
          {item?.key && getRequiredMark(item.key)}
        </Text>


            {/* {row.map((item) => (
              <View key={item.key} style={styles.inputWrapper}>
              <Text style={styles.label}>
                  {item.placeholder}
                  {getRequiredMark(item.key)}
                </Text> */}

                {item.key === "addressLine1" || item.key === "addressLine2" ? (
                  <TextInput
                    style={styles.input}
                    placeholder={item.placeholder}
                    placeholderTextColor="#333"
                    value={data[item.key] || ""}
                    onChangeText={(text) =>
                      setData({ ...data, [item.key]: text })
                    }
                  />
                ) : (



                  //add this
              //     ? districts
              //     : options[item.key] || []
              // }



                  // <CustomDropdown
                  //   value={dropdowns[item.key]}
                  //   setValue={(val) => {
                  //     setDropdowns({ ...dropdowns, [item.key]: val });
                  //     setData({ ...data, [item.key]: val });
                  //   }}
                  //   data={options[item.key]}
                  //   placeholder={` ${item.placeholder}`}
                  // />



                  <CustomDropdown
                  value={data[item.key]}
                  setValue={(val) => handleValueChange(item.key, val)}
                  data={
                    item.key === "country"
                      ? countries
                      : item.key === "state"
                      ? states
                      : item.key === "district"
                      ? districts
                      : options[item.key] || []
                  }
                  placeholder={` ${item.placeholder}`}
                />
                )}
              </View>
            ))}
          </View>
        ))}

        {/* {showDatePicker && (
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
        )} */}
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button1} onPress={onBack}>
          <Ionicons
            name="chevron-back-circle-sharp"
            size={55}
            color="black"
          />
        </TouchableOpacity>



        ************NEW ON SUBMIT HANDLER***************************************************
        <TouchableOpacity
  style={styles.button2}
  onPress={() => {
    console.log("Address Data Submitted:", data);
    onSubmit(data); // make sure this is passed to parent as `addressDetails`
  }}
>
  <Text style={styles.buttonText}>Submit</Text>
</TouchableOpacity>

        {/* <TouchableOpacity
  style={styles.button2}
  onPress={() => {
    const updatedData = { ...data };

    // Flatten nested formData here
    const { employeeDetails, generalDetails, addressDetails } = updatedData;
    const mergedData = {
      ...employeeDetails,
      ...generalDetails,
      ...addressDetails,
    };

    console.log("Flattened merged data", mergedData);

    onSubmit(mergedData); // Pass flattened data to the final submit handler
  }}
>
  <Text style={styles.buttonText}>Submit</Text>
</TouchableOpacity> */}

{/* 
        <TouchableOpacity
          style={styles.button2}
          onPress={() => {
            const updatedData = { ...data };
            onSubmit(updatedData);
          }}`
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity> */}
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
    marginTop: Platform.OS === "ios" ? 60 : 70,
    marginBottom: 20,
  },

  headerTextContainer: {
    flex: 1,
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
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 13,
    fontFamily: "PlusR",
    borderColor: "#ccc",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  label: {
    fontSize: 12,
    fontFamily: "PlusSB",
    fontWeight: "600",
    marginBottom: 4,
    color: "#222",
  },

  dropdown: {
    height: 42,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingHorizontal: 14,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 13,
    fontFamily: "PlusR",
    justifyContent: "center",
  },

  dropdownPlaceholder: {
    color: "#333",
    fontFamily: "PlusR",
    fontSize: 14,
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  button1: {
    alignSelf: "flex-start",
  },

  button2: {
    alignSelf: "flex-end",
  },

  buttonText: {
    color: "#fff",
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 26,
    fontFamily: "PlusSB",
    fontSize: 17,
    textAlign: "center",
  },
});