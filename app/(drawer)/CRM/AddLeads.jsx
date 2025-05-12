import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import { API_BASE_URL } from '../../../services/api';

const AddLead = () => {
  const [image, setImage] = useState(null);
  const [imageBytes, setImageBytes] = useState(null);
  const [imageType, setImageType] = useState(null);
  const Navigation = useNavigation();
  const { user, branch } = useUser();

  const [countryOpen, setCountryOpen] = useState(false);
  const [countryValue, setCountryValue] = useState(null);
  const [countryItems, setCountryItems] = useState([]);

  const [stateOpen, setStateOpen] = useState(false);
  const [stateValue, setStateValue] = useState(null);
  const [stateItems, setStateItems] = useState([]);

  const [districtOpen, setDistrictOpen] = useState(false);
  const [districtValue, setDistrictValue] = useState(null);
  const [districtItems, setDistrictItems] = useState([]);

  const [leadDate, setLeadDate] = useState(new Date());
  const [showLeadDatePicker, setShowLeadDatePicker] = useState(false);
  const [dob, setDob] = useState(new Date());
  const [showDobPicker, setShowDobPicker] = useState(false);

  const [leadSourceOpen, setLeadSourceOpen] = useState(false);
  const [leadSourceValue, setLeadSourceValue] = useState(null);
  const [leadSourceItems, setLeadSourceItems] = useState([
    { label: 'Referral', value: 'referral' },
    { label: 'Online', value: 'online' },
    { label: 'Walk-in', value: 'walkin' },
  ]);

  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [genderItems, setGenderItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ]);

  const [addressNeeded, setAddressNeeded] = useState(false);
  const [form, setForm] = useState({
    firstName : '',
    middleName: '',
    lastName: '',
    mobileNo: '',
    emailID: '',
    fatherName: '',
    motherName: '',
    city: '',
    addressLine1: '',
    addressLine2: '',
  });

  const [errors, setErrors] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchInitialData = async () => {
    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const countryRes = await fetch(`${API_BASE_URL}/employee/countries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'secret_key': secretKey,
        },
      });
      const countryData = await countryRes.json();
      const formattedCountries = countryData.map(country => ({
        label: country.country,
        value: country.id,
      }));
      setCountryItems(formattedCountries);

      const leadRes = await fetch(`${API_BASE_URL}/leadFromCustomer/getAllLeadFromData`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'secret_key': secretKey,
        },
      });
      const leadData = await leadRes.json();
      const formattedLeads = leadData.map(lead => ({
        label: lead.leadGeneratedFrom,
        value: lead.id,
      }));
      setLeadSourceItems(formattedLeads);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (!countryValue) return;
      try {
        const secretKey = await SecureStore.getItemAsync('auth_token');
        const res = await fetch(`${API_BASE_URL}/employee/getStatesByCountryId/${countryValue}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'secret_key': secretKey,
          },
        });
        const data = await res.json();
        const formatted = data.map(state => ({
          label: state.state,
          value: state.id,
        }));
        setStateItems(formatted);
        setStateValue(null);
      } catch (err) {
        console.error('Error fetching states:', err);
      }
    };
    fetchStates();
  }, [countryValue]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!stateValue) return;
      try {
        const secretKey = await SecureStore.getItemAsync('auth_token');
        const res = await fetch(`${API_BASE_URL}/employee/getDistrictByStateId/${stateValue}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'secret_key': secretKey,
          },
        });
        const data = await res.json();
        const formatted = data.map(district => ({
          label: district.district,
          value: district.id,
        }));
        setDistrictItems(formatted);
        setDistrictValue(null);
      } catch (err) {
        console.error('Error fetching districts:', err);
      }
    };
    fetchDistricts();
  }, [stateValue]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.5,
    });
    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setImage(selectedAsset.uri);
      setImageBytes(selectedAsset.base64);
      const fileExtension = selectedAsset.uri.split('.').pop().toLowerCase();
      const mimeType = fileExtension === 'jpg' || fileExtension === 'jpeg' ? 'image/jpeg'
        : fileExtension === 'png' ? 'image/png'
        : fileExtension === 'webp' ? 'image/webp'
        : 'image/*';
      setImageType(mimeType);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    
    if (!leadDate) newErrors.leadDate = 'Lead Generation Date is required';
    if (!form.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!genderValue) newErrors.gender = 'Gender is required';
    if (!form.mobileNo.trim()) {
      newErrors.mobileNo = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(form.mobileNo)) {
      newErrors.mobileNo = 'Mobile Number must be 10 digits';
    }
    if (form.emailID && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailID)) {
      newErrors.emailID = 'Invalid email format';
    }
    if (addressNeeded) {
      if (!countryValue) newErrors.country = 'Country is required';
      if (!stateValue) newErrors.state = 'State is required';
      if (!districtValue) newErrors.district = 'District is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setImage(null);
    setImageBytes(null);
    setImageType(null);
    setLeadDate(new Date());
    setDob(new Date());
    setLeadSourceValue(null);
    setGenderValue(null);
    setCountryValue(null);
    setStateValue(null);
    setDistrictValue(null);
    setAddressNeeded(false);
    setForm({
      firstName: '',
      middleName: '',
      lastName: '',
      mobileNo: '',
      emailID: '',
      fatherName: '',
      motherName: '',
      city: '',
      addressLine1: '',
      addressLine2: '',
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
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the errors in the form');
      return;
    }

    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const leadGenerationDate = moment(leadDate).format('YYYY-MM-DD');
      const dateob = moment(dob).format('YYYY-MM-DD');
      const payload = {
        dP: imageBytes,
        dpDocumentType: imageType,
        leadGenerationDate: leadGenerationDate,
        leadGeneratedBy: { id: user.id },
        branch: { id: branch.id },
        leadFrom: { id: leadSourceValue },
        firstName: form.firstName,
        fatherName: form.fatherName,
        motherName: form.motherName,
        middleName: form.middleName,
        lastName: form.lastName,
        dob: dateob,
        mobileNo: form.mobileNo,
        emailID: form.emailID,
        gender: genderValue,
        addressDetails: addressNeeded ? {
          addressType: 'home',
          address1: form.addressLine1,
          address2: form.addressLine2,
          city: form.city,
          district: {
            id: districtValue,
            state: {
              id: stateValue,
              country: {
                id: countryValue
              }
            }
          }
        } : null,
      };

      const response = await axios.post(
        `${API_BASE_URL}/realestateCustomerLead/addRealestateCustomerLead`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'secret_key': secretKey,
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Lead added successfully!');
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      Alert.alert('Error', 'Failed to add lead. Please try again.');
    }
  };

  const RequiredLabel = ({ text, isRequired }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.label}>{text}</Text>
      {isRequired && <Text style={styles.requiredMark}>*</Text>}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={{ padding: 16 }} 
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => Navigation.openDrawer()}>
              <Ionicons name="menu" size={28} />
            </TouchableOpacity>
            <Text style={{ fontSize: 32, fontFamily: "PlusSB", marginLeft: 16 }}>
              Add <Text style={{ color: "#5aaf57" }}>Lead</Text>
            </Text>
          </View>

          <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', marginBottom: 20 }}>
            {image ? (
              <Image source={{ uri: image }} style={{ width: 120, height: 120, borderRadius: 60 }} />
            ) : (
              <View style={{
                width: 120,
                height: 120,
                backgroundColor: '#ddd',
                borderRadius: 60,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text>Select Image</Text>
              </View>
            )}
          </TouchableOpacity>

          <RequiredLabel text="Lead Date" isRequired={true} />
          <TouchableOpacity style={styles.input} onPress={() => setShowLeadDatePicker(true)}>
            <Text>{leadDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {errors.leadDate && <Text style={styles.errorText}>{errors.leadDate}</Text>}
          <Modal visible={showLeadDatePicker} transparent animationType="slide">
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000088' }}>
              <View style={{ backgroundColor: 'white', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                <DateTimePicker
                  value={leadDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowLeadDatePicker(false);
                    if (selectedDate) {
                      setLeadDate(selectedDate);
                      setErrors(prev => ({ ...prev, leadDate: '' }));
                    }
                  }}
                />
              </View>
            </View>
          </Modal>

          <RequiredLabel text="Lead Source" isRequired={false} />
          <View style={{ zIndex: 1000, marginTop: 4 }}>
            <DropDownPicker
              open={leadSourceOpen}
              value={leadSourceValue}
              items={leadSourceItems}
              setOpen={setLeadSourceOpen}
              setValue={setLeadSourceValue}
              setItems={setLeadSourceItems}
              placeholder="Select Lead Source"
              listMode="SCROLLVIEW"
              zIndex={800}
              style={[styles.input, { padding: 12 }]}
              dropDownContainerStyle={styles.dropDownContainer}
            />
          </View>

          <RequiredLabel text="First & Middle Name" isRequired={true} />
          <View style={styles.row}>
            <TextInput
              placeholder="First Name"
              value={form.firstName}
              onChangeText={text => handleChange('firstName', text)}
              style={[styles.input, errors.firstName && styles.inputError]}
            />
            <TextInput
              placeholder="Middle Name"
              value={form.middleName}
              onChangeText={text => handleChange('middleName', text)}
              style={styles.input}
            />
          </View>
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

          <RequiredLabel text="Last Name" isRequired={false} />
          <TextInput
            placeholder="Last Name"
            value={form.lastName}
            onChangeText={text => handleChange('lastName', text)}
            style={styles.input}
          />

          <RequiredLabel text="Gender" isRequired={true} />
          <View style={{ zIndex: 900, marginTop: 4 }}>
            <DropDownPicker
              open={genderOpen}
              value={genderValue}
              items={genderItems}
              setOpen={setGenderOpen}
              setValue={(value) => {
                setGenderValue(value);
                setErrors(prev => ({ ...prev, gender: '' }));
              }}
              setItems={setGenderItems}
              placeholder="Select Gender"
              placeholderStyle={styles.dropplace}
              listMode="SCROLLVIEW"
              style={[styles.input, { padding: 12 }]}
              dropDownContainerStyle={styles.dropDownContainer}
            />
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

          <RequiredLabel text="Contact Info" isRequired={true} />
          <View style={styles.row}>
            <TextInput
              placeholder="Mobile"
              value={form.mobileNo}
              onChangeText={text => handleChange('mobileNo', text)}
              style={[styles.input, errors.mobileNo && styles.inputError]}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <TextInput
              placeholder="Email"
              value={form.emailID}
              onChangeText={text => handleChange('emailID', text)}
              style={[styles.input, errors.emailID && styles.inputError]}
              keyboardType="email-address"
            />
          </View>
          {errors.mobileNo && <Text style={styles.errorText}>{errors.mobileNo}</Text>}
          {errors.emailID && <Text style={styles.errorText}>{errors.emailID}</Text>}

          <RequiredLabel text="Father's Name" isRequired={false} />
          <TextInput
            placeholder="Father's Name"
            value={form.fatherName}
            onChangeText={text => handleChange('fatherName', text)}
            style={styles.input}
          />

          <RequiredLabel text="Mother's Name" isRequired={false} />
          <TextInput
            placeholder="Mother's Name"
            value={form.motherName}
            onChangeText={text => handleChange('motherName', text)}
            style={styles.input}
          />

          <RequiredLabel text="Date of Birth" isRequired={false} />
          <TouchableOpacity style={styles.input} onPress={() => setShowDobPicker(true)}>
            <Text>{dob.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <Modal visible={showDobPicker} transparent animationType="slide">
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000088' }}>
              <View style={{ backgroundColor: 'white', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                <DateTimePicker
                  value={dob || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowDobPicker(false);
                    if (selectedDate) setDob(selectedDate);
                  }}
                />
              </View>
            </View>
          </Modal>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            <Text style={{ marginRight: 10 }}>Need Address?</Text>
            <TouchableOpacity
              style={[styles.radioBtn, addressNeeded && styles.radioBtnSelected]}
              onPress={() => setAddressNeeded(true)}
            >
              <Text style={{ color: addressNeeded ? '#fff' : '#000' }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioBtn, !addressNeeded && styles.radioBtnSelected]}
              onPress={() => setAddressNeeded(false)}
            >
              <Text style={{ color: !addressNeeded ? '#fff' : '#000' }}>No</Text>
            </TouchableOpacity>
          </View>

          {addressNeeded && (
            <>
              <RequiredLabel text="Country" isRequired={true} />
              <View style={{ zIndex: 800, marginTop: 4 }}>
                <DropDownPicker
                  open={countryOpen}
                  value={countryValue}
                  items={countryItems}
                  setOpen={setCountryOpen}
                  setValue={(value) => {
                    setCountryValue(value);
                    setErrors(prev => ({ ...prev, country: '' }));
                  }}
                  setItems={setCountryItems}
                  placeholder="Select Country"
                  listMode="SCROLLVIEW"
                  zIndex={800}
                  style={[styles.input, { padding: 12 }]}
                  dropDownContainerStyle={styles.dropDownContainer}
                />
              </View>
              {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}

              <RequiredLabel text="State" isRequired={true} />
              <View style={{ zIndex: 700, marginTop: 4 }}>
                <DropDownPicker
                  open={stateOpen}
                  value={stateValue}
                  items={stateItems}
                  setOpen={setStateOpen}
                  setValue={(value) => {
                    setStateValue(value);
                    setErrors(prev => ({ ...prev, state: '' }));
                  }}
                  setItems={setStateItems}
                  placeholder="Select State"
                  listMode="SCROLLVIEW"
                  zIndex={700}
                  style={[styles.input, { padding: 12 }]}
                  dropDownContainerStyle={styles.dropDownContainer}
                />
              </View>
              {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}

              <RequiredLabel text="District" isRequired={true} />
              <View style={{ zIndex: 600, marginTop: 4 }}>
                <DropDownPicker
                  open={districtOpen}
                  value={districtValue}
                  items={districtItems}
                  setOpen={setDistrictOpen}
                  setValue={(value) => {
                    setDistrictValue(value);
                    setErrors(prev => ({ ...prev, district: '' }));
                  }}
                  setItems={setDistrictItems}
                  placeholder="Select District"
                  listMode="SCROLLVIEW"
                  zIndex={700}
                  style={[styles.input, { padding: 12 }]}
                  dropDownContainerStyle={styles.dropDownContainer}
                />
              </View>
              {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}

              <RequiredLabel text="City" isRequired={false} />
              <TextInput
                placeholder="City"
                value={form.city}
                onChangeText={text => handleChange('city', text)}
                style={styles.input}
              />
              <RequiredLabel text="Address Line 1" isRequired={false} />
              <TextInput
                placeholder="Address Line 1"
                value={form.addressLine1}
                onChangeText={text => handleChange('addressLine1', text)}
                style={styles.input}
              />
              <RequiredLabel text="Address Line 2" isRequired={false} />
              <TextInput
                placeholder="Address Line 2"
                value={form.addressLine2}
                onChangeText={text => handleChange('addressLine2', text)}
                style={styles.input}
              />
            </>
          )}

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={{ color: '#5aaf57', fontSize: 20, fontFamily: 'PlusR' }}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: '#fff',
    flex: 1,
  },
  inputError: {
    borderColor: 'red',
  },
  radioBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  radioBtnSelected: {
    backgroundColor: '#5aaf57',
    borderColor: '#5aaf57',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  submitBtn: {
    borderColor: "#5aaf57",
    borderWidth: 1,
    padding: 10,
    width: 120,
    borderRadius: 8,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 13,
    color: '#5aaf57',
    fontFamily: 'PlusSB',
    marginRight: 4,
  },
  requiredMark: {
    color: 'red',
    fontSize: 14,
    marginTop: 13,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 8,
    marginTop: 2,
  },
  dropplace: {
    color: '#777',
    fontSize: 14,
    fontFamily: 'PlusR',
  },
  dropDownContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
};

export default AddLead;