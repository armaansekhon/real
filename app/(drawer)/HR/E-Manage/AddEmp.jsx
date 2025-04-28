import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import EmployeeDetailsForm from "../../../../components/EmployeeDetailsForm";
import GeneralDetailsForm from "../../../../components/GeneralDetailsForm";
import AddressDetailsForm from "../../../../components/AddressDetailsForm";
import Stepper from "../../../../components/Stepper";
import { useNavigation, useLocalSearchParams } from "expo-router";

import { addNewEmployee, getAllEmployeesbyId, updateEmployee } from "../../../../services/api";

const { height, width } = Dimensions.get("window");



export default function AddEmployee({ navigation }) {
  const [step, setStep] = useState(0);


  const Navigation = useNavigation();
  const { id, isEdit = false } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    employeeDetails: {},
    generalDetails: {},
    addressDetails: {},
  });



   // when editing, fetch existing and prefill
   useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const emp = await getAllEmployeesbyId(id);
          // split emp into your three sections:
          setFormData({
            employeeDetails: {
              department: emp.department,
              designation: emp.designation,
              employeeType: emp.employeeType,
              name: emp.name,
              usercode: emp.usercode,
              joiningDate: emp.joiningDate,
              fatherName: emp.fatherName,
              motherName: emp.motherName,
              profileImage: emp.employeePic
                ? { uri: `data:image/jpeg;base64,${emp.employeePic}` }
                : null,
            },
            generalDetails: {
              contact: emp.contact,
              email: emp.email,
              mobile: emp.mobile,
              dob: emp.dob,
              joiningDate: emp.joiningDate,
              gender: emp.gender,
              salary: emp.salary,
              nationality: emp.nationality,
              senior: emp.senior,
              category: emp.category,
              bloodGroup: emp.bloodGroup,
              maritalStatus: emp.maritalStatus,
            },
            addressDetails: {
              address1: emp.employeeAddress?.[0]?.address1,
              address2: emp.employeeAddress?.[0]?.address2,
              city: emp.employeeAddress?.[0]?.city,
              pincode: emp.employeeAddress?.[0]?.pincode,
              // country: emp.employeeAddress?.[0]?.state?.[1]?.country,
            },
          });
        } catch (e) {
          console.error("Failed to load employee for edit:", e);
        }
      })();
    }
  }, [id, isEdit]);


  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (finalData) => {
    console.log("Submit button clicked");
    try {
      // Destructure nested sections
      const { employeeDetails, generalDetails, addressDetails } = finalData;

      // Combine into a flat object
      const mergedData = {
        ...employeeDetails,
        ...generalDetails,
        ...addressDetails,
      };

      const image = employeeDetails?.profileImage;

      // Log flat merged data for verification
      console.log("Final Payload to API:", mergedData);

      // Submit the merged data
      const result = await addNewEmployee(mergedData, image);
      Alert.alert("Success!", "Employee added successfully.");
      console.log("API Result:", result);

      // Reset form and step
      setFormData({
        employeeDetails: {},
        generalDetails: {},
        addressDetails: {},
      });
      setStep(0);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to add employee.");
    }
  };

  // const handleSubmit = async (finalData) => {

  //   console.log('Submit button clicked');
  //   try {
  //     const image = finalData.employeeDetails.profileImage; // assume this field is added in the form
  //     const result = await addNewEmployee(finalData, image);
  //     Alert.alert('Success!', 'Employee added successfully.');
  //     console.log('API Result:', result);

  //     setFormData({
  //       employeeDetails: {},
  //       generalDetails: {},
  //       addressDetails: {},
  //     });
  //     setStep(0);
  //   } catch (err) {
  //     console.error(err);
  //     Alert.alert('Error', err.message || 'Failed to add employee.');
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => Navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>

        <View style={styles.stepperContainer}>
          <Stepper
            currentStep={step}
            labels={["Employee", "General", "Address"]}
            onStepPress={(index) => setStep(index)}
          />
        </View>

        {/* <TouchableOpacity onPress={() => Alert.alert('Notifications')}>
          <Ionicons name="notifications-outline" size={26} color="#333" />
        </TouchableOpacity> */}
      </View>

      {/* Step Forms */}
      {step === 0 && (
        <EmployeeDetailsForm
          initialData={formData.employeeDetails}
          onNext={(data) => {
            updateFormData("employeeDetails", data);
            goNext();
          }}
        />
      )}
      {step === 1 && (
        <GeneralDetailsForm
          initialData={formData.generalDetails}
          onNext={(data) => {
            updateFormData("generalDetails", data);
            goNext();
          }}
          onBack={goBack}
        />
      )}
      {step === 2 && (
        <AddressDetailsForm
          initialData={formData.addressDetails}
          onBack={goBack}
          onSubmit={(addressData) => {
            const finalData = {
              ...formData,
              addressDetails: addressData,
            };
            console.log("final data", finalData);
            setFormData(finalData);
            handleSubmit(finalData);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    // elevation: 4,
    zIndex: 10,
  },

  stepperContainer: {
    position: "absolute",
    left: 38,
    right: 0,
    alignItems: "center",
    zIndex: -1,
  },
});
