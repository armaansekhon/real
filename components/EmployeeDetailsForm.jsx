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
import DropDownPicker from "react-native-dropdown-picker";


const { height } = Dimensions.get("window");

export default function EmployeeDetailsForm({ initialData, onNext }) {
  const [data, setData] = useState(initialData || {});
  const [imageUri, setImageUri] = useState(null);
  const [showSave, setShowSave] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const dropdownOptions = {
    department: [
      { label: "HR", value: "HR" },
      { label: "Engineering", value: "Engineering" },
      { label: "Sales", value: "Sales" },
    ],
    designation: [
      { label: "Manager", value: "Manager" },
      { label: "Developer", value: "Developer" },
      { label: "Analyst", value: "Analyst" },
    ],
    employeeType: [
      { label: "Full-Time", value: "Full-Time" },
      { label: "Part-Time", value: "Part-Time" },
    ],
    employeeCategory: [
      { label: "Permanent", value: "Permanent" },
      { label: "Contract", value: "Contract" },
    ],
    technology: [
      { label: "React", value: "React" },
      { label: "Node.js", value: "Node.js" },
      { label: "Python", value: "Python" },
    ],
  };


  const [dropdowns, setDropdowns] = useState({
    department: null,
    designation: null,
    employeeType: null,
    employeeCategory: null,
    technology: null,
  });
  
  const [openDropdown, setOpenDropdown] = useState({
    department: false,
    designation: false,
    employeeType: false,
    employeeCategory: false,
    technology: false,
  });
  
  const options = {
    department: [
      { label: "HR", value: "HR" },
      { label: "Engineering", value: "Engineering" },
      { label: "Sales", value: "Sales" },
    ],
    designation: [
      { label: "Manager", value: "Manager" },
      { label: "Developer", value: "Developer" },
      { label: "Intern", value: "Intern" },
    ],
    employeeType: [
      { label: "Full-Time", value: "Full-Time" },
      { label: "Part-Time", value: "Part-Time" },
      { label: "Contract", value: "Contract" },
    ],
    employeeCategory: [
      { label: "Permanent", value: "Permanent" },
      { label: "Temporary", value: "Temporary" },
    ],
    technology: [
      { label: "React", value: "React" },
      { label: "Node.js", value: "Node.js" },
      { label: "Python", value: "Python" },
    ],
  };
  

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

      <View style={styles.flexGrid}>
        {groupedFields.map((row, rowIndex) => (
          <View key={rowIndex} style={[styles.rowContainer, { zIndex: 1000 - rowIndex * 10 }]}>

            {row.map((item) => (
              <View key={item.key} style={[styles.inputWrapper, { flex: 1 }]}>
                <Text style={styles.label}>{item.placeholder}</Text>
                {["department", "designation", "employeeType", "employeeCategory", "technology"].includes(item.key) ? (
      <DropDownPicker
        open={openDropdown[item.key]}
        value={dropdowns[item.key]}
        items={options[item.key]}
        setOpen={(o) => setOpenDropdown({ ...openDropdown, [item.key]: o })}
        setValue={(callback) => {
          const value = callback(dropdowns[item.key]);
          setDropdowns({ ...dropdowns, [item.key]: value });
          setData({ ...data, [item.key]: value });
          setShowSave(true);
        }}
        placeholder={`Select ${item.placeholder}`}
        style={{ zIndex: 1000 , borderColor: '#ccc', backgroundColor: "#f9f9f9"}}
        containerStyle={{ zIndex: 1000 }}
        dropDownContainerStyle={{ zIndex: 999 }}
        placeholderStyle={{ color: "#999" }}
      />
                ) : 
                item.key === "joiningDate" ? (
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={[
                      styles.input,
                     
                    ]}
                  >
                    <Text style={[styles.select, { color: "#999"}]}>{data.joiningDate || "Select Date"}</Text>
                    <Ionicons name="calendar-outline" size={18} color="#777" />
                  </TouchableOpacity>
                ) : dropdownOptions[item.key] ? (
                  <RNPickerSelect
                    onValueChange={(value) =>
                      setData({ ...data, [item.key]: value })
                    }
                    items={dropdownOptions[item.key]}
                    value={data[item.key] || ""}
                    style={{
                      inputIOS: styles.input,
                      inputAndroid: styles.input,
                    }}
                    useNativeAndroidPickerStyle={false}
                    placeholder={{
                      label: `Select ${item.placeholder}`,
                      value: null,
                    }}
                  />
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

      {/* Next button replaced with icon */}
      <TouchableOpacity style={styles.nextButton} onPress={() => onNext(data)}>
        <Ionicons name="arrow-forward-circle" size={50} color="#4CAF50" />
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
    marginTop: 70,
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
    fontSize: 13,
    fontFamily: "PlusR",
    borderColor: "#ccc",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2, // subtle shadow for Android
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
});
