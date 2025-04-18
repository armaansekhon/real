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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import RNPickerSelect from "react-native-picker-select";

// ...imports stay same

const { height } = Dimensions.get("window");

export default function GeneralDetailsForm({ initialData, onNext, onBack }) {
  const [data, setData] = useState(initialData || {});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSave, setShowSave] = useState(false);

  const groupedFields = [
    [
      { key: "mobile", placeholder: "Mobile" },
      { key: "email", placeholder: "Email" },
    ],
    [
      { key: "gender", placeholder: "Gender" },
      { key: "nationality", placeholder: "Nationality" },
      
    ],
    [{ key: "officialEmail", placeholder: "Official Email" },
      { key: "officialMobile", placeholder: "Official Mobile" },
      
    ],
    [
     
      { key: "motherTongue", placeholder: "Mother Tongue" },
      { key: "dob", placeholder: "DOB" },
    ],
    [
      { key: "salary", placeholder: "Salary" },
      { key: "category", placeholder: "Category" },
      
    ],
    [
      { key: "joiningDate", placeholder: "Joining Date" },
      { key: "senior", placeholder: "Senior (Report To)" },

    ],
    [
      { key: "bloodGroup", placeholder: "Blood Group" },
      { key: "maritalStatus", placeholder: "Marital Status" },
    ],

  ];

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
    senior: [
      { label: "Manager A", value: "Manager A" },
      { label: "Manager B", value: "Manager B" },
    ],
    bloodGroup: [
      { label: "A+", value: "A+" },
      { label: "B+", value: "B+" },
      { label: "AB+", value: "AB+" },
      { label: "O+", value: "O+" },
      { label: "O-", value: "O-" },
    ],
    maritalStatus: [
      { label: "Single", value: "Single" },
      { label: "Married", value: "Married" },
    ],
  };

  const dropdownKeys = Object.keys(options);

  const [dropdowns, setDropdowns] = useState({});
  const [openDropdown, setOpenDropdown] = useState({});

  const handleDropdownChange = (key, value) => {
    setDropdowns({ ...dropdowns, [key]: value });
    setData({ ...data, [key]: value });
    setShowSave(true);
  };

  return (
    <SafeAreaView style={styles.container}>
  {/* Header stays outside ScrollView */}
  <View style={styles.headerRow}>
    <View style={styles.headerTextContainer}>
      <Text style={styles.headerTitle}>General</Text>
      <Text style={styles.headerSubTitle}>Details</Text>
      <Text style={styles.headerDesc}>
        Fill out the General Details below
      </Text>
    </View>
  </View>

  {/* ScrollView only for form fields */}
  <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
    <View style={styles.flexGrid}>
      {groupedFields.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[styles.rowContainer, { zIndex: 1000 - rowIndex * 10 }]}
        >
          {row.map((item) => (
            <View key={item.key} style={styles.inputWrapper}>
              <Text style={styles.label}>{item.placeholder}</Text>

              {dropdownKeys.includes(item.key) ? (
                <DropDownPicker
                  open={openDropdown[item.key] || false}
                  value={dropdowns[item.key] || null}
                  items={options[item.key]}
                  setOpen={(o) =>
                    setOpenDropdown({ ...openDropdown, [item.key]: o })
                  }
                  setValue={(callback) => {
                    const val = callback(dropdowns[item.key]);
                    handleDropdownChange(item.key, val);
                  }}
                  placeholder={` ${item.placeholder}`}
                  style={{
                    borderColor: "#ccc",
                    backgroundColor: "#f9f9f9",
                  }}
                  containerStyle={{ zIndex: 1000 }}
                  dropDownContainerStyle={{ zIndex: 999 }}
                  placeholderStyle={{ color: "#999" }}
                />
              ) : item.key === "joiningDate" ? (
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.input}
                >
                  <Text
                    style={{
                      color: data.joiningDate ? "#000" : "#999",
                      fontFamily: "PlusR",
                      fontSize: 13,
                    }}
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
                  placeholderTextColor="#999"
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
          data.joiningDate ? new Date(data.joiningDate) : new Date()
        }
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

  {/* Buttons */}
  <View style={styles.buttonsContainer}>
    <TouchableOpacity onPress={onBack}>
      <Text>Back</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onNext(data)}>
      <Text>Next</Text>
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
    marginTop: 70,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    fontFamily: "PlusR",
    fontWeight: "600",
    marginBottom: 4,
    color: "#444",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },




  
});
