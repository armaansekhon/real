import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser } from "../../../../context/UserContext";
import MyMovements from "../../../../components/MyMovements";

import {
  getMovementReasons,
  submitMovementRequest,
} from "../../../../services/api";

const CustomDropdown = ({ value, setValue, data, placeholder, loading }) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <Dropdown
      style={[styles.dropdown, isFocus && { borderColor: "#5aaf57" }]}
      placeholderStyle={styles.dropdownPlaceholder}
      selectedTextStyle={styles.dropdownText}
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

const MovementRequest = () => {
  const navigation = useNavigation();

  const [data, setData] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [reasons, setReasons] = useState([]);
  const [loadingReasons, setLoadingReasons] = useState(true);

  const { user } = useUser();
  const [fromTime, setFromTime] = useState(new Date());
  const [toTime, setToTime] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showMyMovements, setShowMyMovements] = useState(false);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}.0000000`;
  };

  const handleValueChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetchReasons = async () => {
      setLoadingReasons(true);
      const fetchedReasons = await getMovementReasons();
      setReasons(fetchedReasons);
      setLoadingReasons(false);
    };

    fetchReasons();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInitialData();
    resetForm();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user?.id) {
      setData((prev) => ({
        ...prev,
        initiatedBy: user.id,
        employeeName: user.name || user.fullName || "",
      }));
    }
  }, [user]);

  const resetForm = () => {
    setData({
      mRequestedDate: null,
      initiatedBy: null,
      fromTime: null,
      toTime: null,
      movementReasonId: null,
      description: null,
    });
  };

  const handleSubmit = async () => {
    try {
      if (!data.initiatedBy || !data.reason) {
        throw new Error("initiatedBy or movementReasonId is missing");
      }

      const payload = {
        mRequestedDate: data.date,
        initiatedBy: Number(data.initiatedBy),
        fromTime: formatTime(new Date(data.fromTime)), // Example: "08:00"
        toTime: formatTime(new Date(data.toTime)),
        movementReasonId: Number(data.reason),
        description: data.description,
      };

      // console.log("Submitting Movement Request:", movementReasonId);
      console.log("Submitting Movement Request:", payload);

      const res = await submitMovementRequest(payload);
      alert(res.message || "Movement request submitted!");
      resetForm();
    } catch (err) {
      console.error("Error submitting movement request:", err);
      alert("Submission failed: " + err.message);
    }
  };

  console.log("User context:", user);

  const groupedFields = [
    [{ key: "employeeName", placeholder: "Employee Name" }],
    [{ key: "date", placeholder: "Date" }],

    [
      { key: "fromTime", placeholder: "From" },
      { key: "toTime", placeholder: "To" },
    ],
    [{ key: "reason", placeholder: "Reason" }],
    [{ key: "description", placeholder: "Description" }],
  ];

  return (
    <View style={styles.container}>
      {showMyMovements ? (
        <MyMovements goBack={() => setShowMyMovements(false)} />
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={26} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                onPress={() => setShowMyMovements(true)}
                style={styles.myMovements}
              >
                My Movements
              </Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.pageTitle}>
                Initiate <Text style={{ color: "#5aaf57" }}>Movement</Text>
              </Text>

              {groupedFields.map((row, rowIndex) => (
                <View
                  key={rowIndex}
                  style={[
                    row.length > 1 ? styles.horizontalRow : styles.rowContainer,
                    { zIndex: 1000 - rowIndex * 10 },
                  ]}
                >
                  {row.map((item, itemIndex) => (
                    <View
                      key={item.key}
                      style={[
                        styles.inputWrapper,
                        row.length > 1 && itemIndex === 0
                          ? { marginRight: 10 }
                          : {},
                      ]}
                    >
                      <Text style={styles.label}>{item.placeholder}</Text>

                      {/* Reason Dropdown */}
                      {["reason"].includes(item.key) ? (
                        <CustomDropdown
                          value={data[item.key]}
                          setValue={(val) => handleValueChange(item.key, val)}
                          data={reasons}
                          placeholder={item.placeholder}
                          loading={loadingReasons}
                        />
                      ) : // Date Picker
                      item.key === "date" ? (
                        <TouchableOpacity
                          onPress={() => setShowDatePicker(true)}
                          style={[styles.input, styles.dateInputContainer]}
                        >
                          <Text
                            style={[
                              styles.select,
                              {
                                color: data.date ? "#333" : "#999",
                                fontFamily: "PlusR",
                              },
                            ]}
                          >
                            {data.date || "YYYY-MM-DD"}
                          </Text>
                          <Ionicons
                            name="calendar-outline"
                            size={18}
                            color="#777"
                            style={{ marginLeft: "auto" }}
                          />
                        </TouchableOpacity>
                      ) : // Time Pickers
                      item.key === "fromTime" ? (
                        <TouchableOpacity
                          onPress={() => setShowFromPicker(true)}
                          style={[styles.input, styles.dateInputContainer]}
                        >
                          <Text
                            style={[
                              styles.select,
                              {
                                color: data.fromTime ? "#333" : "#999",
                                fontFamily: "PlusR",
                              },
                            ]}
                          >
                            {data.fromTime || "HH:MM"}
                          </Text>
                          <Ionicons
                            name="time-outline"
                            size={18}
                            color="#777"
                            style={{ marginLeft: "auto" }}
                          />
                        </TouchableOpacity>
                      ) : item.key === "toTime" ? (
                        <TouchableOpacity
                          onPress={() => setShowToPicker(true)}
                          style={[styles.input, styles.dateInputContainer]}
                        >
                          <Text
                            style={[
                              styles.select,
                              {
                                color: data.toTime ? "#333" : "#999",
                                fontFamily: "PlusR",
                              },
                            ]}
                          >
                            {data.toTime || "HH:MM"}
                          </Text>
                          <Ionicons
                            name="time-outline"
                            size={18}
                            color="#777"
                            style={{ marginLeft: "auto" }}
                          />
                        </TouchableOpacity>
                      ) : (
                        // Text Inputs
                        <TextInput
                          style={styles.input}
                          placeholder={item.placeholder}
                          placeholderTextColor="#999"
                          value={data[item.key] || ""}
                          onChangeText={(text) =>
                            handleValueChange(item.key, text)
                          }
                        />
                      )}
                    </View>
                  ))}
                </View>
              ))}

              {showDatePicker && (
                <DateTimePicker
                  value={data.date ? new Date(data.date) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setData({
                        ...data,
                        date: selectedDate.toISOString().split("T")[0],
                      });
                    }
                  }}
                />
              )}

              {showFromPicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowFromPicker(false);
                    if (selectedDate) {
                      setData({
                        ...data,
                        fromTime: selectedDate.toISOString(),
                      });
                    }
                  }}
                />
              )}

              {showToPicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowToPicker(false);
                    if (selectedDate) {
                      setData({ ...data, toTime: selectedDate.toISOString() });
                    }
                  }}
                />
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Ionicons
                name="checkmark-done-circle-sharp"
                size={55}
                color="black"
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: Platform.OS === "ios" ? 80 : 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#ccc",
  },
  myMovements: {
    color: "#5aaf57",
    fontSize: 15,
    fontFamily: "PlusR",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#5aaf57",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 32,
    fontFamily: "PlusR",
    marginBottom: 14,
    color: "#222",
  },
  label: {
    fontSize: 14,
    color: "#5aaf57",
    marginBottom: 4,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    color: "#000",
  },

  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 48,
    justifyContent: "center",
  },
  dropdownPlaceholder: {
    color: "#999",
  },
  dropdownText: {
    color: "#000",
  },
  rowContainer: {
    flexDirection: "column",
  },

  inputWrapper: {
    flex: 1,
    marginBottom: 10,
    minWidth: 100,
    paddingTop: 5,
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
    color: "#999",
    fontFamily: "PlusR",
    fontSize: 14,
  },

  dropdownText: {
    color: "#333",
    fontFamily: "PlusR",
    fontSize: 14,
  },
  horizontalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
});

export default MovementRequest;
