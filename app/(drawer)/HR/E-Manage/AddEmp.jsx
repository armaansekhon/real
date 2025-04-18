import React, { useState } from 'react';
import { View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import EmployeeDetailsForm from '../../../../components/EmployeeDetailsForm';
import GeneralDetailsForm from '../../../../components/GeneralDetailsForm';
import AddressDetailsForm from '../../../../components/AddressDetailsForm';

import Stepper from '../../../../components/Stepper';

export default function AddEmployee() {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    employeeDetails: {},
    generalDetails: {},
    addressDetails: {},
  });

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
    <Stepper
    currentStep={step}
    labels={['Employee', 'General', 'Address']}
    onStepPress={(index) => setStep(index)} // allows backward navigation
    />

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
            setFormData(finalData); // optional for future reuse
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
    // padding: 16,
    // paddingVertical: 16,
    backgroundColor: '#fff', // light background
    justifyContent: 'center',
  },
});
