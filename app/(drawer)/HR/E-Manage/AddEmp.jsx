import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import EmployeeDetailsForm from '../../../../components/EmployeeDetailsForm';
import GeneralDetailsForm from '../../../../components/GeneralDetailsForm';
import AddressDetailsForm from '../../../../components/AddressDetailsForm';
import Stepper from '../../../../components/Stepper';
import { useNavigation } from 'expo-router';

const { height, width } = Dimensions.get('window');

export default function AddEmployee({ navigation }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    employeeDetails: {},
    generalDetails: {},
    addressDetails: {},
  });
  const Navigation=useNavigation();

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  const goNext = () => setStep(prev => prev + 1);
  const goBack = () => setStep(prev => prev - 1);

  const handleSubmit = (finalData) => {
    console.log('Final Submitted Data: ', finalData);
    Alert.alert('Success!', 'All data submitted.');
    setFormData({
      employeeDetails: {},
      generalDetails: {},
      addressDetails: {},
    });
    setStep(0);
  };

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
            labels={['Employee', 'General', 'Address']}
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
          onNext={data => {
            updateFormData('employeeDetails', data);
            goNext();
          }}
        />
      )}
      {step === 1 && (
        <GeneralDetailsForm
          initialData={formData.generalDetails}
          onNext={data => {
            updateFormData('generalDetails', data);
            goNext();
          }}
          onBack={goBack}
        />
      )}
      {step === 2 && (
        <AddressDetailsForm
          initialData={formData.addressDetails}
          onBack={goBack}
          onSubmit={data => {
            const finalData = {
              ...formData,
              addressDetails: data,
            };
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
    backgroundColor: '#fff',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    // elevation: 4,
    zIndex: 10,
  },

  stepperContainer: {
    position: 'absolute',
    left: 38,
    right: 0,
    alignItems: 'center',
    zIndex: -1,

  },
});
