import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Platform,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useLocalSearchParams } from "expo-router";
import { getMovementById } from "../../../../services/api";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import { getLeaveApprovalAuthority } from "../../../../services/api";
import { useUser } from '../../../../context/UserContext';
import { submitMovementAction } from "../../../../services/api";

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

const MovementDetails = () => {
  const { user, date } = useUser();
  const { mId } = useLocalSearchParams();
  const [movementDetails, setMovementDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [statusLoading, setStatusLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [data, setData] = useState({
    status: null,
    date: null,
    remarks: null,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMovementDetails();
    setRefreshing(false);
  };

  const groupedFields = [
    [{ key: "status", placeholder: "Update Status" }],
    [{ key: "date", placeholder: "Update Date" }],
    [{ key: "remarks", placeholder: "Remarks" }],
  ];

  useEffect(() => {
    if (date && !data.date) {
      setData((prev) => ({ ...prev, date }));
    }
  }, [date]);

  const fetchMovementDetails = async () => {
    if (!mId) return;
    setLoading(true);
    console.log("User context:", user);
    console.log("Employee ID:", user?.id);
    const data = await getMovementById(mId);
    setMovementDetails(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovementDetails();
  }, [mId]);

  useEffect(() => {
    if (!user || !user.id) {
      console.warn("User or employeeId not available yet.");
      return;
    }

    const fetchStatusOptions = async () => {
      try {
        setStatusLoading(true);
        console.log("Fetching approval authority for employeeId:", user.id);
        const response = await getLeaveApprovalAuthority(user.id);
        console.log("Approval authority response:", response);
        const formatted = response.roles.map((role) => ({
          label: role.role,
          value: role.role,
        }));
        setStatusOptions(formatted);
      } catch (error) {
        console.error("Error fetching status options:", error);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchStatusOptions();
  }, [user?.id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#5aaf57" />
      </SafeAreaView>
    );
  }

  if (!movementDetails) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Failed to load movement details.</Text>
      </SafeAreaView>
    );
  }

  const handleValueChange = (field, val) => {
    setData((prev) => ({ ...prev, [field]: val }));
  };

  const resetForm = () => {
    setData({
      status: null,
      date: null,
      remarks: null,
    });
  };

  const handleSubmit = async () => {
    if (!data.status || !data.date || !data.remarks) {
      alert("Please fill all fields.");
      return;
    }
    try {
      const payload = {
        movementRequestId: Number(mId),
        status: data.status,
        remarks: data.remarks,
        updatedBy: user?.id,
        updateDate: data.date,
      };
      console.log("Payload being sent:", payload);
      const res = await submitMovementAction(payload);
      alert(res.message || "Movement action successful!");
      resetForm();
    } catch (err) {
      alert("Submission failed: " + err.message);
      console.error("Error during movement submission:", err);
    }
  };

  const statuses = [
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "Pending", value: "pending" },
  ];

  const dates = [
    { label: "Today", value: new Date().toISOString().split("T")[0] },
    { label: "Tomorrow", value: new Date(Date.now() + 86400000).toISOString().split("T")[0] },
  ];

  const remarks = [
    { label: "Approved by Manager", value: "Approved by Manager" },
    { label: "Needs clarification", value: "Needs clarification" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Movement</Text>
          <Text style={styles.headerSubTitle}>Details</Text>
        </View>
        <LottieView
          source={require("../../../../assets/svg/EMP.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Detail label="Status" value={movementDetails["Status"]} />
        <Detail label="Requested On" value={movementDetails["Movement Requested Date"]} />
        <Detail label="From Time" value={movementDetails["fromTime"]} />
        <Detail label="To Time" value={movementDetails["toTime"]} />
        <Detail label="Initiated By" value={movementDetails["Initiated By"]} />
        <Detail label="Currently At" value={movementDetails["Currently At"]} />
        <Detail label="Reason" value={movementDetails["Movement Reason "]?.trim()} />
        <Detail label="Description" value={movementDetails["description"] || "N/A"} />

        {groupedFields.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[styles.rowContainer, { zIndex: 1000 - rowIndex * 10 }]}
          >
            {row.map((item, itemIndex) => (
              <View key={item.key} style={styles.inputWrapper}>
                <Text style={styles.label}>
                  {item.placeholder}
                </Text>
                {["status"].includes(item.key) ? (
                  <CustomDropdown
                    value={data[item.key]}
                    setValue={(val) => handleValueChange(item.key, val)}
                    data={
                      item.key === "status"
                        ? statusOptions
                        : []
                    }
                    placeholder={` ${item.placeholder}`}
                    loading={item.key === "status" && statusLoading}
                  />
                ) : item.key === "date" ? (
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={[styles.input, styles.dateInputContainer]}
                  >
                    <Text
                      style={[
                        styles.select,
                        { color: data.date ? "#333" : "#999", fontFamily: "PlusR" },
                      ]}
                    >
                      {data.date || "YYYY-MM-DD"}
                    </Text>
                    <View style={{ marginLeft: "auto" }}>
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#777"
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TextInput
                    style={styles.input}
                    placeholder={item.placeholder}
                    placeholderTextColor="#999"
                    value={data[item.key] || ""}
                    onChangeText={(text) => handleValueChange(item.key, text)}
                  />
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Ionicons name="checkmark-done-circle-sharp" size={55} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const Detail = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 10 : 0,
   
  },
  content: {
    padding: 20,
   
    
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: "PlusSB",
    color: "#555",
    maxWidth: "40%",
  },
  value: {
    fontSize: 13,
    fontFamily: "PlusR",
    color: "#222",
    maxWidth: "55%",
    textAlign: "right",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    fontFamily: "PlusR",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: Platform.OS === "ios" ? 60 : 60,
    marginBottom: 5,
  },
  headerTextContainer: {
    flex: 1,
    bottom: 30,
  },
  headerTitle: {
    fontSize: 37,
    fontFamily: "PlusSB",
  },
  headerSubTitle: {
    fontSize: 32,
    fontFamily: "PlusSB",
    color: "#5aaf57",
    marginTop: -7,
  },
  lottie: {
    width: 90,
    height: 70,
    transform: [{ scale: 2 }],
    bottom: 15,
    top: -25,
    marginRight: 20,
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
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  submitButton: {
    alignItems: "center",
    marginTop: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
});

export default MovementDetails;