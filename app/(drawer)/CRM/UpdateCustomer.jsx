import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, RefreshControl, Image, Alert, Platform, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../../../services/api';

const UpdateCustomer = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams(); // Retrieve only the id from router params

  const [refreshing, setRefreshing] = useState(false);
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date()); // Temporary date for picker
  const [form, setForm] = useState({
    fullName: '',
    mobileNumber: '',
    fatherName: '',
    emailId: '',
    motherName: '',
    gender: '',
    aadharNumber: '',
    panNo: '',
    dateOfBirth: null,
    maritalStatus: '',
    permanentAddress: {
      countryId: null,
      stateId: null,
      districtId: null,
      city: '',
      addressLine1: '',
      addressLine2: '',
      pincode: '',
    },
    correspondingAddress: {
      countryId: null,
      stateId: null,
      districtId: null,
      city: '',
      addressLine1: '',
      addressLine2: '',
      pincode: '',
    },
  });
  const [errors, setErrors] = useState({});
  const [isSameAddress, setIsSameAddress] = useState(true); // Will be updated based on API data
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [correspondingStates, setCorrespondingStates] = useState([]);
  const [correspondingDistricts, setCorrespondingDistricts] = useState([]);
  const [customerData, setCustomerData] = useState(null); // Store fetched customer data

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const maritalStatusOptions = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorced', value: 'Divorced' },
    { label: 'Widowed', value: 'Widowed' },
  ];

  // Fetch Customer Data
  const fetchCustomerData = async () => {
    try {
      console.log(id);
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const response = await axios.get(`${API_BASE_URL}/realestateCustomer/realEstateCustomer/${id}`,
        {
          headers: { 'secret_key': secretKey },
        }
      );
      const data = response.data;
      setCustomerData(data);

      // Map API response to form fields
      const permanentAddress = {
        countryId: data.countryId || null,
        stateId: data.stateId || null,
        districtId: data.districtId || null,
        city: data.city || '',
        addressLine1: data.address1 || '',
        addressLine2: data.address2 || '',
        pincode: data.pincode || '',
      };

      const correspondingAddress = {
        countryId: data.cCountryId || null,
        stateId: data.cStateId || null,
        districtId: data.cdistrictId || null,
        city: data.cCity || '',
        addressLine1: data.caddress1 || '',
        addressLine2: data.caddress2 || '',
        pincode: data.cPincode || '',
      };

      // Determine if addresses are the same
      const addressesAreSame = (
        permanentAddress.countryId === correspondingAddress.countryId &&
        permanentAddress.stateId === correspondingAddress.stateId &&
        permanentAddress.districtId === correspondingAddress.districtId &&
        permanentAddress.city === correspondingAddress.city &&
        permanentAddress.addressLine1 === correspondingAddress.addressLine1 &&
        permanentAddress.addressLine2 === correspondingAddress.addressLine2 &&
        permanentAddress.pincode === correspondingAddress.pincode
      );
      setIsSameAddress(addressesAreSame);

      setForm({
        fullName: data.name || '',
        mobileNumber: data.mobileNo || '',
        fatherName: data.fatherName || '',
        emailId: data.email || '',
        motherName: data.motherName || '',
        gender: data.gender || '',
        aadharNumber: data.aadhaarNo || '',
        panNo: data.panNo || '',
        dateOfBirth: data.dob ? new Date(data.dob) : null,
        maritalStatus: data.maritalStatus || '',
        permanentAddress,
        correspondingAddress,
      });
      setImage(data.profile || null);

      // Fetch states and districts for permanent address
      if (data.countryId) {
        await fetchStates(data.countryId);
      }
      if (data.stateId) {
        await fetchDistricts(data.stateId);
      }

      // Fetch states and districts for corresponding address
      if (data.cCountryId) {
        await fetchStates(data.cCountryId, true);
      }
      if (data.cStateId) {
        await fetchDistricts(data.cStateId, true);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
      Alert.alert('Error', 'Failed to fetch customer data.');
    }
  };

  // Fetch Countries
  const fetchCountries = async () => {
    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const response = await axios.get(`${API_BASE_URL}/employee/countries`, {
        headers: { 'secret_key': secretKey },
      });
      setCountries(response.data.map(item => ({ label: item.country, value: item.id })));
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch countries.');
    }
  };

  // Fetch States
  const fetchStates = async (countryId, isCorresponding = false) => {
    if (!countryId) return;
    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const response = await axios.get(`${API_BASE_URL}/employee/getStatesByCountryId/${countryId}`, {
        headers: { 'secret_key': secretKey },
      });
      const stateOptions = response.data.map(item => ({ label: item.state, value: item.id }));
      if (isCorresponding) {
        setCorrespondingStates(stateOptions);
      } else {
        setStates(stateOptions);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch states.');
    }
  };

  // Fetch Districts
  const fetchDistricts = async (stateId, isCorresponding = false) => {
    if (!stateId) return;
    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const response = await axios.get(`${API_BASE_URL}/employee/getDistrictByStateId/${stateId}`, {
        headers: { 'secret_key': secretKey },
      });
      const districtOptions = response.data.map(item => ({ label: item.district, value: item.id }));
      if (isCorresponding) {
        setCorrespondingDistricts(districtOptions);
      } else {
        setDistricts(districtOptions);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch districts.');
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchCountries();
      await fetchCustomerData();
    };
    initializeData();
  }, []);

  // Image Picker
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].base64);
    }
  };

  // Refresh Logic
  const onRefresh = () => {
    setRefreshing(true);
    setErrors({});
    fetchCustomerData(); // Refetch customer data
    fetchCountries();
    setRefreshing(false);
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!form.mobileNumber.match(/^\d{10}$/)) newErrors.mobileNumber = 'Mobile Number must be 10 digits';
    if (!form.fatherName.trim()) newErrors.fatherName = 'Father\'s Name is required';
    if (!form.emailId.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.emailId = 'Enter a valid Email ID';
    if (!form.gender) newErrors.gender = 'Gender is required';
    if (!form.permanentAddress.countryId) newErrors.permanentCountry = 'Country is required';
    if (!form.permanentAddress.stateId) newErrors.permanentState = 'State is required';
    if (!form.permanentAddress.districtId) newErrors.permanentDistrict = 'District is required';
    if (!isSameAddress) {
      if (!form.correspondingAddress.countryId) newErrors.correspondingCountry = 'Country is required';
      if (!form.correspondingAddress.stateId) newErrors.correspondingState = 'State is required';
      if (!form.correspondingAddress.districtId) newErrors.correspondingDistrict = 'District is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const payload = {
        id: id,
        name: form.fullName,
        contact: form.mobileNumber,
        father_Name: form.fatherName,
        email_Id: form.emailId,
        mother_Name: form.motherName || null,
        gender: form.gender,
        panNo: form.panNo,
        aaddharNo: form.aadharNumber || null,
        dateOfBirth: form.dateOfBirth ? form.dateOfBirth.toISOString().split('T')[0] : null,
        maritalStatus: form.maritalStatus || null,
        addressDetails: {
          country: { id: form.permanentAddress.countryId },
          state: { id: form.permanentAddress.stateId },
          district: { id: form.permanentAddress.districtId },
          city: form.permanentAddress.city || null,
          address1: form.permanentAddress.addressLine1 || null,
          address2: form.permanentAddress.addressLine2 || null,
          pincode: form.permanentAddress.pincode || null,
        },
        crcAddressDetails: {
          country: { id: isSameAddress ? form.permanentAddress.countryId : form.correspondingAddress.countryId },
          state: { id: isSameAddress ? form.permanentAddress.stateId : form.correspondingAddress.stateId },
          district: { id: isSameAddress ? form.permanentAddress.districtId : form.correspondingAddress.districtId },
          city: isSameAddress ? form.permanentAddress.city : form.correspondingAddress.city || null,
          address1: isSameAddress ? form.permanentAddress.addressLine1 : form.correspondingAddress.addressLine1 || null,
          address2: isSameAddress ? form.permanentAddress.addressLine2 : form.correspondingAddress.addressLine2 || null,
          pincode: isSameAddress ? form.permanentAddress.pincode : form.correspondingAddress.pincode || null,
        },
        dp: image || null,
      };

      await axios.post(`${API_BASE_URL}/realestateCustomer/addRealEstateCustomer`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'secret_key': secretKey,
        },
      });

      Alert.alert('Success', 'Customer updated successfully!');
      onRefresh();
      navigation.goBack();
    } catch (error) {
      console.error('Error updating customer:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        JSON.stringify(error.response?.data) ||
        'Failed to update the customer';
      Alert.alert('Error', errorMessage);
    }
  };

  // Handle Same Address Checkbox
  const handleSameAddress = () => {
    setIsSameAddress(!isSameAddress);
    if (!isSameAddress) {
      setForm(prev => ({
        ...prev,
        correspondingAddress: { ...prev.permanentAddress },
      }));
      setCorrespondingStates(states);
      setCorrespondingDistricts(districts);
    }
  };

  // Open Date Picker and Set Initial Date
  const openDatePicker = () => {
    setTempDate(form.dateOfBirth || new Date()); // Use current date if no date is set
    setShowDatePicker(true);
  };

  // Handle Date Change
  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  // Confirm Date Selection
  const confirmDate = () => {
    setForm({ ...form, dateOfBirth: tempDate });
    setShowDatePicker(false);
  };

  // Cancel Date Selection
  const cancelDate = () => {
    setShowDatePicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Drawer Button */}
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <Text style={styles.header}>
          Update <Text style={{ color: '#5aaf57' }}>Customer</Text>
        </Text>

        {/* Image Picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image
              source={{ uri: image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}` }}
              style={styles.image}
            />
          ) : (
            <Ionicons name="camera" size={50} color="#5aaf57" />
          )}
          <Text style={styles.imagePickerText}>Select Profile Image</Text>
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Full Name (Full Width) */}
          <View style={[styles.inputContainer, styles.fullWidth]}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Full Name </Text>
              <Text style={styles.required}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              value={form.fullName}
              onChangeText={text => setForm({ ...form, fullName: text })}
              placeholder="Enter Full Name"
            />
            {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}
          </View>

          {/* Mobile Number and Pan Number (Half Width) */}
          <View style={styles.row}>
            {/* Mobile Number */}
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Mobile Number </Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                style={styles.input}
                value={form.mobileNumber}
                onChangeText={text => setForm({ ...form, mobileNumber: text })}
                placeholder="Enter Mobile Number"
                keyboardType="numeric"
                maxLength={10}
              />
              {errors.mobileNumber && <Text style={styles.error}>{errors.mobileNumber}</Text>}
            </View>

            {/* Pan Number */}
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Pan Number</Text>
              <TextInput
                style={styles.input}
                value={form.panNo}
                onChangeText={text => setForm({ ...form, panNo: text })}
                placeholder="Enter Pan Number"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Father's Name (Full Width) */}
          <View style={[styles.inputContainer, styles.fullWidth]}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Father's Name </Text>
              <Text style={styles.required}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              value={form.fatherName}
              onChangeText={text => setForm({ ...form, fatherName: text })}
              placeholder="Enter Father's Name"
            />
            {errors.fatherName && <Text style={styles.error}>{errors.fatherName}</Text>}
          </View>

          {/* Mother's Name (Full Width) */}
          <View style={[styles.inputContainer, styles.fullWidth]}>
            <Text style={styles.label}>Mother's Name</Text>
            <TextInput
              style={styles.input}
              value={form.motherName}
              onChangeText={text => setForm({ ...form, motherName: text })}
              placeholder="Enter Mother's Name"
            />
          </View>

          {/* Email ID (Full Width) */}
          <View style={[styles.inputContainer, styles.fullWidth]}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Email ID </Text>
              <Text style={styles.required}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              value={form.emailId}
              onChangeText={text => setForm({ ...form, emailId: text })}
              placeholder="Enter Email ID"
              keyboardType="email-address"
            />
            {errors.emailId && <Text style={styles.error}>{errors.emailId}</Text>}
          </View>

          {/* Gender and Marital Status (Half Width) */}
          <View style={styles.row}>
            {/* Gender */}
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Gender </Text>
                <Text style={styles.required}>*</Text>
              </View>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={{ color: "#bbb" }}
                data={genderOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Gender"
                value={form.gender}
                onChange={item => setForm({ ...form, gender: item.value })}
              />
              {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}
            </View>

            {/* Marital Status */}
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Marital Status</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={{ color: "#bbb" }}
                data={maritalStatusOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Marital Status"
                value={form.maritalStatus}
                onChange={item => setForm({ ...form, maritalStatus: item.value })}
              />
            </View>
          </View>

          {/* Aadhar Number and Date of Birth (Half Width) */}
          <View style={styles.row}>
            {/* Aadhar Number */}
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Aadhar Number</Text>
              <TextInput
                style={styles.input}
                value={form.aadharNumber}
                onChangeText={text => setForm({ ...form, aadharNumber: text })}
                placeholder="Enter Aadhar Number"
                keyboardType="numeric"
              />
            </View>

            {/* Date of Birth */}
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={openDatePicker}
              >
                <Text style={styles.dateText}>
                  {form.dateOfBirth ? form.dateOfBirth.toLocaleDateString() : 'Select Date'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Picker Modal */}
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={cancelDate}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()} // Prevent future dates
                />
                <View style={styles.datePickerButtons}>
                  <TouchableOpacity onPress={cancelDate} style={styles.datePickerButton}>
                    <Text style={styles.datePickerButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={confirmDate} style={styles.datePickerButton}>
                    <Text style={styles.datePickerButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Permanent Address */}
          <Text style={styles.sectionTitle}>Permanent Address</Text>
          <View style={styles.addressContainer}>
            {/* Country and State (Half Width) */}
            <View style={styles.row}>
              {/* Country */}
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Country </Text>
                  <Text style={styles.required}>*</Text>
                </View>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={{ color: "#bbb" }}
                  data={countries}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Country"
                  value={form.permanentAddress.countryId}
                  onChange={item => {
                    setForm(prev => ({
                      ...prev,
                      permanentAddress: { ...prev.permanentAddress, countryId: item.value, stateId: null, districtId: null },
                    }));
                    fetchStates(item.value);
                    setStates([]);
                    setDistricts([]);
                  }}
                />
                {errors.permanentCountry && <Text style={styles.error}>{errors.permanentCountry}</Text>}
              </View>

              {/* State */}
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>State </Text>
                  <Text style={styles.required}>*</Text>
                </View>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={{ color: "#bbb" }}
                  data={states}
                  labelField="label"
                  valueField="value"
                  placeholder="Select State"
                  value={form.permanentAddress.stateId}
                  onChange={item => {
                    setForm(prev => ({
                      ...prev,
                      permanentAddress: { ...prev.permanentAddress, stateId: item.value, districtId: null },
                    }));
                    fetchDistricts(item.value);
                    setDistricts([]);
                  }}
                />
                {errors.permanentState && <Text style={styles.error}>{errors.permanentState}</Text>}
              </View>
            </View>

            {/* District and Pincode (Half Width) */}
            <View style={styles.row}>
              {/* District */}
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>District </Text>
                  <Text style={styles.required}>*</Text>
                </View>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={{ color: "#bbb" }}
                  data={districts}
                  labelField="label"
                  valueField="value"
                  placeholder="Select District"
                  value={form.permanentAddress.districtId}
                  onChange={item => {
                    setForm(prev => ({
                      ...prev,
                      permanentAddress: { ...prev.permanentAddress, districtId: item.value },
                    }));
                  }}
                />
                {errors.permanentDistrict && <Text style={styles.error}>{errors.permanentDistrict}</Text>}
              </View>

              {/* Pincode */}
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Pincode</Text>
                <TextInput
                  style={styles.input}
                  value={form.permanentAddress.pincode}
                  onChangeText={text =>
                    setForm(prev => ({
                      ...prev,
                      permanentAddress: { ...prev.permanentAddress, pincode: text },
                    }))
                  }
                  placeholder="Enter Pincode"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* City (Full Width) */}
            <View style={[styles.inputContainer, styles.fullWidth]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={form.permanentAddress.city}
                onChangeText={text =>
                  setForm(prev => ({
                    ...prev,
                    permanentAddress: { ...prev.permanentAddress, city: text },
                  }))
                }
                placeholder="Enter City"
              />
            </View>

            {/* Address Line 1 (Full Width) */}
            <View style={[styles.inputContainer, styles.fullWidth]}>
              <Text style={styles.label}>Address Line 1</Text>
              <TextInput
                style={styles.input}
                value={form.permanentAddress.addressLine1}
                onChangeText={text =>
                  setForm(prev => ({
                    ...prev,
                    permanentAddress: { ...prev.permanentAddress, addressLine1: text },
                  }))
                }
                placeholder="Enter Address Line 1"
              />
            </View>

            {/* Address Line 2 (Full Width) */}
            <View style={[styles.inputContainer, styles.fullWidth]}>
              <Text style={styles.label}>Address Line 2</Text>
              <TextInput
                style={styles.input}
                value={form.permanentAddress.addressLine2}
                onChangeText={text =>
                  setForm(prev => ({
                    ...prev,
                    permanentAddress: { ...prev.permanentAddress, addressLine2: text },
                  }))
                }
                placeholder="Enter Address Line 2"
              />
            </View>
          </View>

          {/* Corresponding Address */}
          <Text style={styles.sectionTitle}>Corresponding Address</Text>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={handleSameAddress}
            >
              <Ionicons
                name={isSameAddress ? 'checkbox' : 'square-outline'}
                size={24}
                color="#5aaf57"
              />
              <Text style={styles.checkboxText}>Same as Permanent Address</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addressContainer}>
            {/* Country and State (Half Width) */}
            <View style={styles.row}>
              {/* Country */}
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Country </Text>
                  <Text style={styles.required}>*</Text>
                </View>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={{ color: "#bbb" }}
                  data={countries}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Country"
                  value={form.correspondingAddress.countryId}
                  onChange={item => {
                    setForm(prev => ({
                      ...prev,
                      correspondingAddress: { ...prev.correspondingAddress, countryId: item.value, stateId: null, districtId: null },
                    }));
                    fetchStates(item.value, true);
                    setCorrespondingStates([]);
                    setCorrespondingDistricts([]);
                  }}
                  disable={isSameAddress}
                />
                {errors.correspondingCountry && <Text style={styles.error}>{errors.correspondingCountry}</Text>}
              </View>

              {/* State */}
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>State </Text>
                  <Text style={styles.required}>*</Text>
                </View>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={{ color: "#bbb" }}
                  data={correspondingStates}
                  labelField="label"
                  valueField="value"
                  placeholder="Select State"
                  value={form.correspondingAddress.stateId}
                  onChange={item => {
                    setForm(prev => ({
                      ...prev,
                      correspondingAddress: { ...prev.correspondingAddress, stateId: item.value, districtId: null },
                    }));
                    fetchDistricts(item.value, true);
                    setCorrespondingDistricts([]);
                  }}
                  disable={isSameAddress}
                />
                {errors.correspondingState && <Text style={styles.error}>{errors.correspondingState}</Text>}
              </View>
            </View>

            {/* District and Pincode (Half Width) */}
            <View style={styles.row}>
              {/* District */}
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>District </Text>
                  <Text style={styles.required}>*</Text>
                </View>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={{ color: "#bbb" }}
                  data={correspondingDistricts}
                  labelField="label"
                  valueField="value"
                  placeholder="Select District"
                  value={form.correspondingAddress.districtId}
                  onChange={item => {
                    setForm(prev => ({
                      ...prev,
                      correspondingAddress: { ...prev.correspondingAddress, districtId: item.value },
                    }));
                  }}
                  disable={isSameAddress}
                />
                {errors.correspondingDistrict && <Text style={styles.error}>{errors.correspondingDistrict}</Text>}
              </View>

              {/* Pincode */}
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Pincode</Text>
                <TextInput
                  style={styles.input}
                  value={form.correspondingAddress.pincode}
                  onChangeText={text =>
                    setForm(prev => ({
                      ...prev,
                      correspondingAddress: { ...prev.correspondingAddress, pincode: text },
                    }))
                  }
                  placeholder="Enter Pincode"
                  keyboardType="numeric"
                  editable={!isSameAddress}
                />
              </View>
            </View>

            {/* City (Full Width) */}
            <View style={[styles.inputContainer, styles.fullWidth]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={form.correspondingAddress.city}
                onChangeText={text =>
                  setForm(prev => ({
                    ...prev,
                    correspondingAddress: { ...prev.correspondingAddress, city: text },
                  }))
                }
                placeholder="Enter City"
                editable={!isSameAddress}
              />
            </View>

            {/* Address Line 1 (Full Width) */}
            <View style={[styles.inputContainer, styles.fullWidth]}>
              <Text style={styles.label}>Address Line 1</Text>
              <TextInput
                style={styles.input}
                value={form.correspondingAddress.addressLine1}
                onChangeText={text =>
                  setForm(prev => ({
                    ...prev,
                    correspondingAddress: { ...prev.correspondingAddress, addressLine1: text },
                  }))
                }
                placeholder="Enter Address Line 1"
                editable={!isSameAddress}
              />
            </View>

            {/* Address Line 2 (Full Width) */}
            <View style={[styles.inputContainer, styles.fullWidth]}>
              <Text style={styles.label}>Address Line 2</Text>
              <TextInput
                style={styles.input}
                value={form.correspondingAddress.addressLine2}
                onChangeText={text =>
                  setForm(prev => ({
                    ...prev,
                    correspondingAddress: { ...prev.correspondingAddress, addressLine2: text },
                  }))
                }
                placeholder="Enter Address Line 2"
                editable={!isSameAddress}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateCustomer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  menuContainer: {
    marginBottom: 10,
  },
  header: {
    fontSize: 32,
    fontFamily: 'PlusR',
    marginVertical: 10,
  },
  imagePicker: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePickerText: {
    fontSize: 16,
    fontFamily: 'PlusR',
    color: '#5aaf57',
    marginTop: 10,
  },
  formContainer: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  fullWidth: {
    width: '100%',
  },
  halfWidth: {
    width: '48%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontFamily: 'PlusSB',
    color: '#5aaf57',
  },
  required: {
    fontSize: 16,
    fontFamily: 'PlusSB',
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    fontFamily: 'PlusR',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontFamily: 'PlusR',
  },
  dateText: {
    fontSize: 15,
    fontFamily: 'PlusR',
    color: '#333',
  },
  error: {
    fontSize: 12,
    fontFamily: 'PlusR',
    color: 'red',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'PlusSB',
    color: '#333',
    marginVertical: 15,
  },
  addressContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#5aaf57',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 16,
    fontFamily: 'PlusR',
    color: '#333',
    marginLeft: 10,
  },
  submitBtn: {
    backgroundColor: '#5aaf57',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: {
    fontSize: 18,
    fontFamily: 'PlusSB',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  datePickerButton: {
    padding: 10,
  },
  datePickerButtonText: {
    fontSize: 16,
    fontFamily: 'PlusR',
    color: '#5aaf57',
  },
});