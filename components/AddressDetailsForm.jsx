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
import { Dimensions } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const { height } = Dimensions.get("window");

export default function AddressDetailsForm({ initialData, onSubmit, onBack }) {
  const [data, setData] = useState(initialData || {});
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const groupedFields = [
    [
      { key: "department", placeholder: "Department" },
      { key: "designation", placeholder: "Designation" },
    ],
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
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Employee</Text>
          <Text style={styles.headerSubTitle}>Details</Text>
          <Text style={styles.headerDesc}>
            Fill out the Employee Details below
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.flexGrid}>
        {groupedFields.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[styles.rowContainer, { zIndex: 1000 - rowIndex * 10 }]}
          >
            {row.map((item) => (
              <View key={item.key} style={styles.inputWrapper}>
                <Text style={styles.label}>{item.placeholder}</Text>

                {["department", "designation", "employeeType", "employeeCategory", "technology"].includes(item.key) ? (
                  <DropDownPicker
                    open={openDropdown[item.key]}
                    value={dropdowns[item.key]}
                    items={options[item.key]}
                    setOpen={(o) =>
                      setOpenDropdown({ ...openDropdown, [item.key]: o })
                    }
                    setValue={(callback) => {
                      const value = callback(dropdowns[item.key]);
                      setDropdowns({ ...dropdowns, [item.key]: value });
                      setData({ ...data, [item.key]: value });
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
                    style={styles.dateInput}
                  >
                    <Text style={styles.selectText}>
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
      </ScrollView>

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

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const updatedData = { ...data };
            onSubmit(updatedData);
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
    paddingBottom: 16,
  },
  headerRow: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  headerTextContainer: {
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  headerSubTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
  },
  headerDesc: {
    marginTop: 4,
    fontSize: 14,
    color: "#777",
  },
  flexGrid: {
    padding: 16,
  },
  rowContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  selectText: {
    color: "#666",
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#5aaf57",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
