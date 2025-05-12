import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import useDropdownData from "../hooks/useDropdownData";

const CustomDropdown = ({ value, setValue, data, placeholder }) => {
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
      placeholder={placeholder}
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        console.log(`CustomDropdown: ${placeholder} selected value:`, item.value); // ADDED: Debug log
        setValue(item.value);
        setIsFocus(false);
      }}
    />
  );
};

export default function AddressDetailsForm({ initialData, onSubmit, onBack }) {
  const [data, setData] = useState({
    country: null,
    state: null,
    district: null,
    addressLine1: "",
    addressLine2: "",
    city: "",
    pincode: "",
    ...initialData,
  });

  console.log("useDropdownData inputs:", { country: data.country, state: data.state }); // ADDED: Debug log

  const { countries, states, districts } = useDropdownData(
    null, // Pass null for selectedDepartmentId (not used in this form)
    data.country,
    data.state,
    null // Pass null for selectedDesignationId (not used in this form)
  );

  const handleValueChange = (key, value) => {
    console.log(`handleValueChange: key=${key}, value=${value}`); // ADDED: Debug log
    setData((prevData) => ({
      ...prevData,
      [key]: value,
      ...(key === "country" && { state: null, district: null }),
      ...(key === "state" && { district: null }),
    }));
  };

  const validateForm = () => {
    const requiredFields = ["country", "state", "district", "addressLine1", "city", "pincode"];
    for (const key of requiredFields) {
      if (!data[key] || data[key].toString().trim() === "") {
        alert(`Please fill in the ${key.replace(/([A-Z])/g, " $1").trim()} field`);
        return false;
      }
    }
    return true;
  };

  const getRequiredMark = () => <Text style={{ color: "red", fontSize: 12, marginLeft: 2 }}>*</Text>;

  const groupedFields = [
    [
      { key: "country", placeholder: "Country" },
      { key: "state", placeholder: "State" },
    ],
    [
      { key: "district", placeholder: "District" },
  
      { key: "city", placeholder: "City" },
    ],
    [{ key: "addressLine1", placeholder: "Address Line 1" }],
    [
      { key: "addressLine2", placeholder: "Address Line 2" },
      { key: "pincode", placeholder: "Pincode" },
    ],
  ];

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
              <View key={item.key} style={styles.inputWrapper}>
                <Text style={styles.label}>
                  {item.placeholder}
                  {getRequiredMark()}
                </Text>
                {["addressLine1", "addressLine2", "pincode", "city"].includes(item.key) ? (
                  <TextInput
                    style={styles.input}
                    placeholder={item.placeholder}
                    placeholderTextColor="#333"
                    value={data[item.key] || ""}
                    onChangeText={(text) => handleValueChange(item.key, text)}
                    keyboardType={item.key === "pincode" ? "numeric" : "default"}
                  />
                ) : (
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
                        : []
                    }
                    placeholder={` ${item.placeholder}`}
                  />
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button1} onPress={onBack}>
          <Ionicons
            name="chevron-back-circle-sharp"
            size={55}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => {
            if (validateForm()) {
              const finalPayload = {
                ...data,
                stateId: data.state,
              };
              delete finalPayload.state;
              console.log("Final Payload to API:", finalPayload);
              onSubmit(finalPayload);
            }
          }}
        >
          <Text style={styles.buttonText}>Submit</Text>
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
    backgroundColor: "#fff",
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