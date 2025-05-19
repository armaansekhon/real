import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
  ScrollView,
  SafeAreaView,
  Modal,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import moment from "moment";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useUser } from "../../../context/UserContext";
import { API_BASE_URL } from "../../../services/api";

const Followup = () => {
  const navigation = useNavigation();
  const { leadData } = useLocalSearchParams();
  const { user, branch, date } = useUser();

  const [parsedLeadData, setParsedLeadData] = useState(null);
  const [followUpDate, setFollowUpDate] = useState(date);
  const [showFollowUpDatePicker, setShowFollowUpDatePicker] = useState(false);
  const [nextFollowUpDate, setNextFollowUpDate] = useState(null);
  const [showNextFollowUpDatePicker, setShowNextFollowUpDatePicker] =
    useState(false);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [showAppointmentDatePicker, setShowAppointmentDatePicker] =
    useState(false);

  const [followUpStatusOpen, setFollowUpStatusOpen] = useState(false);
  const [followUpStatusValue, setFollowUpStatusValue] = useState(null);
  const [followUpStatusItems, setFollowUpStatusItems] = useState([
    { label: "Interested", value: "interested" },
    { label: "Not Interested", value: "not_interested" },
    { label: "Follow Up", value: "follow_up" },
    { label: "Converted", value: "converted" },
  ]);

  const [followUpViaOpen, setFollowUpViaOpen] = useState(false);
  const [followUpViaValue, setFollowUpViaValue] = useState(null);
  const [followUpViaItems, setFollowUpViaItems] = useState([
    { label: "Phone", value: "phone" },
    { label: "Email", value: "email" },
    { label: "In Person", value: "in_person" },
  ]);

  const [countryOpen, setCountryOpen] = useState(false);
  const [countryValue, setCountryValue] = useState(null);
  const [countryItems, setCountryItems] = useState([]);

  const [stateOpen, setStateOpen] = useState(false);
  const [stateValue, setStateValue] = useState(null);
  const [stateItems, setStateItems] = useState([]);

  const [districtOpen, setDistrictOpen] = useState(false);
  const [districtValue, setDistrictValue] = useState(null);
  const [districtItems, setDistrictItems] = useState([]);

  const [form, setForm] = useState({
    remarks: "",
    appointmentRemarks: "",
    city: "",
    addressLine1: "",
    addressLine2: "",
  });

  const [gotAppointment, setGotAppointment] = useState(false);
  const [errors, setErrors] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  // Parse lead data
  useEffect(() => {
    if (!leadData) {
      console.error("leadData is undefined");
      Alert.alert("Error", "No lead data received. Please try again.");
      navigation.goBack();
      return;
    }

    try {
      const parsed = JSON.parse(leadData);
      setParsedLeadData(parsed);
    } catch (e) {
      console.error("Error parsing leadData:", e);
      Alert.alert("Error", "Failed to parse lead data. Please try again.");
      navigation.goBack();
    }
  }, [leadData]);

  // Fetch initial dropdown data
  const fetchInitialData = async () => {
    try {
      const secretKey = await SecureStore.getItemAsync("auth_token");
      const countryRes = await fetch(
        `${API_BASE_URL}/employee/countries`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            secret_key: secretKey,
          },
        }
      );
      const countryData = await countryRes.json();
      const formattedCountries = countryData.map((country) => ({
        label: country.country,
        value: country.id,
      }));
      setCountryItems(formattedCountries);
    } catch (err) {
      console.error("Error fetching initial data:", err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchFollowUpStatus = async () => {
      try {
        const secretKey = await SecureStore.getItemAsync("auth_token");
        const res = await fetch(
          `${API_BASE_URL}/followUpStatus/followUpStatusFrom`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );
        const data = await res.json();
        const formatted = data.map((status) => ({
          label: status.status,
          value: status.id,
        }));
        setFollowUpStatusItems(formatted);
        setFollowUpStatusValue(null);
      } catch (err) {
        console.error("Error fetching status", err);
      }
    };
    fetchFollowUpStatus();
  }, []);

  useEffect(() => {
    const fetchFollowUpVia = async () => {
      try {
        const secretKey = await SecureStore.getItemAsync("auth_token");
        const res = await fetch(
          `${API_BASE_URL}/followUpVia/followUpViaForm`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );
        const data = await res.json();
        const formatted = data.map((via) => ({
          label: via.via,
          value: via.id,
        }));
        setFollowUpViaItems(formatted);
        setFollowUpViaValue(null);
      } catch (err) {
        console.error("Error fetching via", err);
      }
    };
    fetchFollowUpVia();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (!countryValue) return;
      try {
        const secretKey = await SecureStore.getItemAsync("auth_token");
        const res = await fetch(
          `${API_BASE_URL}/employee/getStatesByCountryId/${countryValue}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );
        const data = await res.json();
        const formatted = data.map((state) => ({
          label: state.state,
          value: state.id,
        }));
        setStateItems(formatted);
        setStateValue(null);
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };
    fetchStates();
  }, [countryValue]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!stateValue) return;
      try {
        const secretKey = await SecureStore.getItemAsync("auth_token");
        const res = await fetch(
          `${API_BASE_URL}/employee/getDistrictByStateId/${stateValue}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              secret_key: secretKey,
            },
          }
        );
        const data = await res.json();
        const formatted = data.map((district) => ({
          label: district.district,
          value: district.id,
        }));
        setDistrictItems(formatted);
        setDistrictValue(null);
      } catch (err) {
        console.error("Error fetching districts:", err);
      }
    };
    fetchDistricts();
  }, [stateValue]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!followUpStatusValue)
      newErrors.followUpStatus = "Follow Up Status is required";
    if (!followUpViaValue) newErrors.followUpVia = "Follow Up Via is required";
    if (!nextFollowUpDate)
      newErrors.nextFollowUpDate = "Next Follow Up Date is required";
    if (!form.remarks.trim()) newErrors.remarks = "Remarks are required";

    if (gotAppointment) {
      if (!appointmentDate)
        newErrors.appointmentDate = "Appointment Date is required";
      if (!form.appointmentRemarks.trim())
        newErrors.appointmentRemarks = "Appointment Remarks are required";
      if (!countryValue) newErrors.country = "Country is required";
      if (!stateValue) newErrors.state = "State is required";
      if (!districtValue) newErrors.district = "District is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFollowUpDate(date);
    setNextFollowUpDate(null);
    setAppointmentDate(null);
    setFollowUpStatusValue(null);
    setFollowUpViaValue(null);
    setCountryValue(null);
    setStateValue(null);
    setDistrictValue(null);
    setGotAppointment(false);
    setForm({
      remarks: "",
      appointmentRemarks: "",
      city: "",
      addressLine1: "",
      addressLine2: "",
    });
    setErrors({});
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInitialData();
    resetForm();
    setRefreshing(false);
  };

  const handleSubmit = async () => {
    if (!parsedLeadData) {
      Alert.alert("Error", "Lead data is missing.");
      return;
    }

    if (!validateForm()) {
      Alert.alert("Validation Error", "Please correct the errors in the form");
      return;
    }

    try {
      const payload = {
        realEstateCustomerLead: { id: parsedLeadData.id },
        followUpDate: moment(followUpDate).format("YYYY-MM-DD"),
        followUpStatus: { id: followUpStatusValue },
        followUpVia: { id: followUpViaValue },
        nextFollowUpDate: moment(nextFollowUpDate).format("YYYY-MM-DD"),
        remarks: form.remarks,
        appointment: gotAppointment
          ? [
              {
                appointementDate: moment(appointmentDate).format("YYYY-MM-DD"),
                remarks: form.appointmentRemarks,
                addressDetails: {
                  address1: form.addressLine1,
                  address2: form.addressLine2,
                  city: form.city,
                  district: {
                    id: districtValue,
                    state: {
                      id: stateValue,
                      country: {
                        id: countryValue,
                      },
                    },
                  },
                },
              },
            ]
          : [],
        entryBy: { id: user.id },
      };

      console.log("Data Sending .......", payload);

      const secretKey = await SecureStore.getItemAsync("auth_token");
      const response = await axios.post(
        `${API_BASE_URL}/realestateCustomerLead/addFollowUpCustomerLead`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            secret_key: secretKey,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Follow-up added successfully!");
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting follow-up:", error);
      Alert.alert("Error", "Failed to add follow-up. Please try again.");
    }
  };

  const RequiredLabel = ({ text, isRequired }) => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={styles.label}>{text}</Text>
      {isRequired && <Text style={styles.requiredMark}>*</Text>}
    </View>
  );

  if (!parsedLeadData) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 180 }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} />
          </TouchableOpacity>
          <Text style={styles.header}>
            Follow <Text style={{ color: "#5aaf57" }}>-Ups</Text>
          </Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Lead Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>
              {parsedLeadData.name ||
                `${form.firstName} ${form.lastName}`.trim()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Father's Name:</Text>
            <Text style={styles.detailValue}>
              {parsedLeadData.fatherName || "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mobile Number:</Text>
            <Text style={styles.detailValue}>
              {parsedLeadData.mobileNo || "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Lead Generation Date:</Text>
            <Text style={styles.detailValue}>
              {parsedLeadData.leadGenerationDate
                ? moment(parsedLeadData.leadGenerationDate).format("MM/DD/YYYY")
                : "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last Updated:</Text>
            <Text style={styles.detailValue}>
              {parsedLeadData.updatedAt
                ? moment(parsedLeadData.updatedAt).format("MM/DD/YYYY")
                : "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Lead From:</Text>
            <Text style={styles.detailValue}>
              {parsedLeadData.leadFrom || "N/A"}
            </Text>
          </View>
        </View>

        <RequiredLabel text="Follow Up Date" isRequired={false} />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowFollowUpDatePicker(true)}
        >
          <Text>{moment(followUpDate).format("MM/DD/YYYY")}</Text>
        </TouchableOpacity>
        <Modal
          visible={showFollowUpDatePicker}
          transparent
          animationType="slide"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "#00000088",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 16,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              <DateTimePicker
                value={followUpDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowFollowUpDatePicker(false);
                  if (selectedDate) {
                    setFollowUpDate(selectedDate);
                  }
                }}
              />
            </View>
          </View>
        </Modal>

        <RequiredLabel text="Follow Up Status" isRequired={true} />
        <View style={{ zIndex: 1000, marginTop: 4 }}>
          <DropDownPicker
            open={followUpStatusOpen}
            value={followUpStatusValue}
            items={followUpStatusItems}
            setOpen={setFollowUpStatusOpen}
            setValue={(value) => {
              setFollowUpStatusValue(value);
              setErrors((prev) => ({ ...prev, followUpStatus: "" }));
            }}
            setItems={setFollowUpStatusItems}
            placeholder="Select Follow Up Status"
            listMode="SCROLLVIEW"
            zIndex={1000}
            style={[styles.input, errors.followUpStatus && styles.inputError]}
            dropDownContainerStyle={styles.dropDownContainer}
          />
        </View>
        {errors.followUpStatus && (
          <Text style={styles.errorText}>{errors.followUpStatus}</Text>
        )}

        <RequiredLabel text="Follow Up Via" isRequired={true} />
        <View style={{ zIndex: 900, marginTop: 4 }}>
          <DropDownPicker
            open={followUpViaOpen}
            value={followUpViaValue}
            items={followUpViaItems}
            setOpen={setFollowUpViaOpen}
            setValue={(value) => {
              setFollowUpViaValue(value);
              setErrors((prev) => ({ ...prev, followUpVia: "" }));
            }}
            setItems={setFollowUpViaItems}
            placeholder="Select Follow Up Via"
            listMode="SCROLLVIEW"
            zIndex={900}
            style={[styles.input, errors.followUpVia && styles.inputError]}
            dropDownContainerStyle={styles.dropDownContainer}
          />
        </View>
        {errors.followUpVia && (
          <Text style={styles.errorText}>{errors.followUpVia}</Text>
        )}

        <RequiredLabel text="Next Follow Up Date" isRequired={true} />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowNextFollowUpDatePicker(true)}
        >
          <Text>
            {nextFollowUpDate
              ? moment(nextFollowUpDate).format("MM/DD/YYYY")
              : "Select Date"}
          </Text>
        </TouchableOpacity>
        <Modal
          visible={showNextFollowUpDatePicker}
          transparent
          animationType="slide"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "#00000088",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 16,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              <DateTimePicker
                value={nextFollowUpDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowNextFollowUpDatePicker(false);
                  if (selectedDate) {
                    setNextFollowUpDate(selectedDate);
                    setErrors((prev) => ({ ...prev, nextFollowUpDate: "" }));
                  }
                }}
              />
            </View>
          </View>
        </Modal>
        {errors.nextFollowUpDate && (
          <Text style={styles.errorText}>{errors.nextFollowUpDate}</Text>
        )}

        <RequiredLabel text="Remarks" isRequired={true} />
        <TextInput
          placeholder="Enter Remarks"
          value={form.remarks}
          onChangeText={(text) => handleChange("remarks", text)}
          style={[styles.input, errors.remarks && styles.inputError]}
          multiline
        />
        {errors.remarks && (
          <Text style={styles.errorText}>{errors.remarks}</Text>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Text style={{ marginRight: 10 }}>Got Appointment?</Text>
          <TouchableOpacity
            style={[styles.radioBtn, gotAppointment && styles.radioBtnSelected]}
            onPress={() => setGotAppointment(true)}
          >
            <Text style={{ color: gotAppointment ? "#fff" : "#000" }}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioBtn,
              !gotAppointment && styles.radioBtnSelected,
            ]}
            onPress={() => setGotAppointment(false)}
          >
            <Text style={{ color: !gotAppointment ? "#fff" : "#000" }}>No</Text>
          </TouchableOpacity>
        </View>

        {gotAppointment && (
          <>
            <RequiredLabel text="Appointment Date" isRequired={true} />
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowAppointmentDatePicker(true)}
            >
              <Text>
                {appointmentDate
                  ? moment(appointmentDate).format("MM/DD/YYYY")
                  : "Select Date"}
              </Text>
            </TouchableOpacity>
            <Modal
              visible={showAppointmentDatePicker}
              transparent
              animationType="slide"
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  backgroundColor: "#00000088",
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 16,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                >
                  <DateTimePicker
                    value={appointmentDate || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowAppointmentDatePicker(false);
                      if (selectedDate) {
                        setAppointmentDate(selectedDate);
                        setErrors((prev) => ({ ...prev, appointmentDate: "" }));
                      }
                    }}
                  />
                </View>
              </View>
            </Modal>
            {errors.appointmentDate && (
              <Text style={styles.errorText}>{errors.appointmentDate}</Text>
            )}

            <RequiredLabel text="Appointment Remarks" isRequired={true} />
            <TextInput
              placeholder="Enter Appointment Remarks"
              value={form.appointmentRemarks}
              onChangeText={(text) => handleChange("appointmentRemarks", text)}
              style={[
                styles.input,
                errors.appointmentRemarks && styles.inputError,
              ]}
              multiline
            />
            {errors.appointmentRemarks && (
              <Text style={styles.errorText}>{errors.appointmentRemarks}</Text>
            )}

            <RequiredLabel text="Country" isRequired={true} />
            <View style={{ zIndex: 800, marginTop: 4 }}>
              <DropDownPicker
                open={countryOpen}
                value={countryValue}
                items={countryItems}
                setOpen={setCountryOpen}
                setValue={(value) => {
                  setCountryValue(value);
                  setErrors((prev) => ({ ...prev, country: "" }));
                }}
                setItems={setCountryItems}
                placeholder="Select Country"
                listMode="SCROLLVIEW"
                zIndex={800}
                style={[styles.input, errors.country && styles.inputError]}
                dropDownContainerStyle={styles.dropDownContainer}
              />
            </View>
            {errors.country && (
              <Text style={styles.errorText}>{errors.country}</Text>
            )}

            <RequiredLabel text="State" isRequired={true} />
            <View style={{ zIndex: 700, marginTop: 4 }}>
              <DropDownPicker
                open={stateOpen}
                value={stateValue}
                items={stateItems}
                setOpen={setStateOpen}
                setValue={(value) => {
                  setStateValue(value);
                  setErrors((prev) => ({ ...prev, state: "" }));
                }}
                setItems={setStateItems}
                placeholder="Select State"
                listMode="SCROLLVIEW"
                zIndex={700}
                style={[styles.input, errors.state && styles.inputError]}
                dropDownContainerStyle={styles.dropDownContainer}
              />
            </View>
            {errors.state && (
              <Text style={styles.errorText}>{errors.state}</Text>
            )}

            <RequiredLabel text="District" isRequired={true} />
            <View style={{ zIndex: 600, marginTop: 4 }}>
              <DropDownPicker
                open={districtOpen}
                value={districtValue}
                items={districtItems}
                setOpen={setDistrictOpen}
                setValue={(value) => {
                  setDistrictValue(value);
                  setErrors((prev) => ({ ...prev, district: "" }));
                }}
                setItems={setDistrictItems}
                placeholder="Select District"
                listMode="SCROLLVIEW"
                zIndex={600}
                style={[styles.input, errors.district && styles.inputError]}
                dropDownContainerStyle={styles.dropDownContainer}
              />
            </View>
            {errors.district && (
              <Text style={styles.errorText}>{errors.district}</Text>
            )}

            <RequiredLabel text="City" isRequired={false} />
            <TextInput
              placeholder="City"
              value={form.city}
              onChangeText={(text) => handleChange("city", text)}
              style={styles.input}
            />

            <RequiredLabel text="Address Line 1" isRequired={false} />
            <TextInput
              placeholder="Address Line 1"
              value={form.addressLine1}
              onChangeText={(text) => handleChange("addressLine1", text)}
              style={styles.input}
            />

            <RequiredLabel text="Address Line 2" isRequired={false} />
            <TextInput
              placeholder="Address Line 2"
              value={form.addressLine2}
              onChangeText={(text) => handleChange("addressLine2", text)}
              style={styles.input}
            />
          </>
        )}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={{ color: "#5aaf57", fontSize: 20, fontFamily: "PlusR" }}>
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 32,
    fontFamily: "PlusR",
    marginLeft: 10,
    marginBottom: 10,
  },
  detailCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#5aaf57",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "#ddd",
  },
  detailTitle: {
    fontSize: 18,
    fontFamily: "PlusSB",
    color: "#5aaf57",
    marginBottom: 10,
    marginLeft: 10,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: "PlusSB",
    color: "#333",
    marginLeft: 10,
    width: 210,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "PlusR",
    color: "#555",
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "red",
  },
  radioBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  radioBtnSelected: {
    backgroundColor: "#5aaf57",
    borderColor: "#5aaf57",
  },
  submitBtn: {
    borderColor: "#5aaf57",
    borderWidth: 1,
    padding: 10,
    width: 120,
    borderRadius: 8,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  dropDownContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 13,
    color: "#5aaf57",
    fontFamily: "PlusSB",
    marginRight: 4,
  },
  requiredMark: {
    color: "red",
    fontSize: 14,
    marginTop: 13,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 8,
    marginTop: 2,
  },
});

export default Followup;