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
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { Dimensions } from "react-native";

import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";

import useDropdownData from "../hooks/useDropdownData";

const { height } = Dimensions.get("window");

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
        setValue(item.value);
        setIsFocus(false);
      }}
    />
  );
};

export default function EmployeeDetailsForm({ initialData, onNext }) {
  const [data, setData] = useState(initialData || {});
  const [imageUri, setImageUri] = useState(null);
  const [showSave, setShowSave] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
 

  const { departments, designations, employeeTypes, loading } = useDropdownData(
    data.department
  );

  const handleValueChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "department" && { designation: null }), // reset designation if department changes
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);  // Store the URI properly
      setData({ ...data, profileImage: uri }); // Save in data
      setShowSave(true);
    }
  };

  const groupedFields = [
    [
      { key: "department", placeholder: "Department" },
      { key: "designation", placeholder: "Designation" },
    ],
    [
      { key: "employeeType", placeholder: "Employee Type" },
      // { key: "employeeCategory", placeholder: "Employee Category" },
    ],
    [
      // { key: "technology", placeholder: "Technology" },
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
      {/* Header */}
      {/* Header Row with Avatar */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Employee</Text>
          <Text style={styles.headerSubTitle}>Details</Text>
          <Text style={styles.headerDesc}>
            Fill out the Employee Details below
          </Text>
        </View>

        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {data.profileImage ? (
            <Image source={{ uri: data.profileImage }} style={styles.avatar} />
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
                  <Text style={styles.label}>{item.placeholder}</Text>
                  {["department", "designation", "employeeType"].includes(item.key) ? (
  <CustomDropdown
    value={data[item.key]}
    setValue={(val) => handleValueChange(item.key, val)}
    data={
      item.key === "department"
        ? departments
        : item.key === "designation"
        ? designations
        : item.key === "employeeType"
        ? employeeTypes
        : options[item.key] || []
    }
    placeholder={item.placeholder}
  />
) : item.key === "joiningDate" ? (
  <TouchableOpacity
    onPress={() => setShowDatePicker(true)}
    style={[styles.input]}
  >
    <Text style={[styles.select, { color: "#333", fontFamily: "PlusR" }]}>
      {data.joiningDate || "Select Date"}
    </Text>
    <Ionicons name="calendar-outline" size={18} color="#777" />
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

      {/* Next button replaced with icon */}
      <TouchableOpacity style={styles.nextButton} onPress={() => onNext(data)}>
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

  saveButton: {
    marginTop: 8,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    // marginTop: 70,
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
    backgroundColor: "#eee",
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
    paddingHorizontal: 16, // adds side spacing
    marginTop: 10,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12, // more space between items
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
    fontSize: 14,
    fontFamily: "PlusR",
    borderColor: "#ccc",
    borderWidth: 1,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
    elevation: 0, // subtle shadow for Android
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 12,
    fontFamily: "PlusSB",
    marginBottom: 4,
    color: "#444",
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
    zIndex: 1000,
  },

  // dropdownContainer: {
  //   backgroundColor: "#fff",
  //   borderColor: "#ccc",
  //   borderRadius: 10,
  //   zIndex: 999,
  // },

  dropdownPlaceholder: {
    color: "#333",
    fontFamily: "PlusR",
    fontSize: 14,
  },
});
