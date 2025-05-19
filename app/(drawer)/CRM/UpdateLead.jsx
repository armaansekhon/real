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
import { useLocalSearchParams } from 'expo-router';
import { API_BASE_URL } from '../../../services/api';

const UpdateLead = () => {
  const [image, setImage] = useState(null);
  const [imageBytes, setImageBytes] = useState(null);
  const [imageType, setImageType] = useState(null);
  const navigation = useNavigation();
  const { user, branch } = useUser();
  const { leadData } = useLocalSearchParams();

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
  const [dob, setDob] = useState(null);
  const [showDobPicker, setShowDobPicker] = useState(false);

  const [leadSourceOpen, setLeadSourceOpen] = useState(false);
  const [leadSourceValue, setLeadSourceValue] = useState(null);
  const [leadSourceItems, setLeadSourceItems] = useState([
    { label: 'Referral', value: 'referral' },
    { label: 'Online', value: 'online' },
    { label: 'Walk In', value: 'walkin' },
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

  const [errors, setErrors] = useState({});

  // Store parsed lead data to use in fetch functions
  const [parsedLeadData, setParsedLeadData] = useState(null);

  // Prefill form with leadData
  useEffect(() => {
    if (!leadData) {
      console.error('leadData is undefined');
      Alert.alert('Error', 'No lead data received. Please try again.');
      navigation.goBack();
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(leadData);
      console.log('Parsed leadData:', parsedData);
      setParsedLeadData(parsedData);
    } catch (e) {
      console.error('Error parsing leadData:', e);
      Alert.alert('Error', 'Failed to parse lead data. Please try again.');
      navigation.goBack();
      return;
    }

    setForm({
      firstName: parsedData.name?.split(' ')[0] || '',
      middleName: parsedData.middleName || '',
      lastName: parsedData.lastName || parsedData.name?.split(' ').slice(1).join(' ') || '',
      mobileNo: parsedData.mobileNo || '',
      emailID: parsedData.emailID || '',
      fatherName: parsedData.fatherName || '',
      motherName: parsedData.motherName || '',
      city: parsedData.city || '',
      addressLine1: parsedData.address1 || '',
      addressLine2: parsedData.address2 || '',
    });

    setCountryValue(parsedData.countryId || null);
    setStateValue(parsedData.stateId || null);

    const leadSourceMatch = leadSourceItems.find(item => 
      item.label.toLowerCase() === parsedData.leadFrom?.toLowerCase()
    );
    setLeadSourceValue(leadSourceMatch ? leadSourceMatch.value : parsedData.leadFrom || null);

    const genderMatch = genderItems.find(item => 
      item.value.toLowerCase() === parsedData.gender?.toLowerCase()
    );
    setGenderValue(genderMatch ? genderMatch.value : parsedData.gender || null);

    if (parsedData.leadGenerationDate) {
      const leadGenDate = new Date(parsedData.leadGenerationDate);
      if (!isNaN(leadGenDate.getTime())) {
        setLeadDate(leadGenDate);
      }
    }

    if (parsedData.dob) {
      const dobDate = new Date(parsedData.dob);
      if (!isNaN(dobDate.getTime())) {
        setDob(dobDate);
      }
    }

    if (parsedData.profile) {
      setImage(`data:image/jpeg;base64,${parsedData.profile}`);
    }

    setAddressNeeded(
      !!parsedData.city || 
      !!parsedData.address1 || 
      !!parsedData.address2 || 
      !!parsedData.country || 
      !!parsedData.state || 
      !!parsedData.district
    );
  }, [leadData, leadSourceItems, genderItems]);

  // Fetch initial dropdown data
  useEffect(() => {
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
        if (parsedLeadData && parsedLeadData.countryId === countryValue) {
          setStateValue(parsedLeadData.stateId || null);
        } else {
          setStateValue(null);
        }
      } catch (err) {
        console.error('Error fetching states:', err);
      }
    };

    fetchStates();
  }, [countryValue, parsedLeadData]);

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
        if (parsedLeadData && parsedLeadData.stateId === stateValue) {
          console.log("Setting districtValue to:", parsedLeadData.districtId);
          setDistrictValue(parsedLeadData.districtId || null);
        } else {
          setDistrictValue(null);
        }
      } catch (err) {
        console.error('Error fetching districts:', err);
      }
    };

    fetchDistricts();
  }, [stateValue, parsedLeadData]);

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
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!leadDate || isNaN(leadDate.getTime())) {
      newErrors.leadDate = 'Lead Date is required';
    }

    if (!form.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }

    if (!genderValue) {
      newErrors.gender = 'Gender is required';
    }

    if (!form.mobileNo.trim() && !form.emailID.trim()) {
      newErrors.contactInfo = 'At least one of Mobile or Email is required';
    } else {
      if (form.mobileNo && !form.mobileNo.match(/^\d{10}$/)) {
        newErrors.mobileNo = 'Mobile number must be 10 digits';
      }
      if (form.emailID && !form.emailID.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.emailID = 'Enter a valid email address';
      }
    }

    if (addressNeeded) {
      if (!countryValue) {
        newErrors.country = 'Country is required';
      }
      if (!stateValue) {
        newErrors.state = 'State is required';
      }
      if (!districtValue) {
        newErrors.district = 'District is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!leadData) {
      Alert.alert('Error', 'Lead data is missing.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const leadGenerationDate = moment(leadDate).format('YYYY-MM-DD');
      const dobFormatted = dob ? moment(dob).format('YYYY-MM-DD') : null;
      let parsedLeadData = JSON.parse(leadData);
      const leadId = parsedLeadData.id;

      const payload = {
        id: leadId,
        dP: imageBytes || parsedLeadData.profile || parsedLeadData.dP,
        dpDocumentType: imageType,
        leadGenerationDate: leadGenerationDate,
        dob: dobFormatted,
        leadGeneratedBy: { id: user.id },
        branch: { id: branch.id },
        leadFrom: { id: leadSourceValue || parsedLeadData.leadFrom },
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        mobileNo: form.mobileNo,
        emailID: form.emailID,
        gender: genderValue,
        addressDetails: {
          addressType: 'home',
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
      };

      const secretKey = await SecureStore.getItemAsync('auth_token');
      const response = await axios.post(
        `${API_BASE_URL}/realestateCustomerLead/addRealestateCustomerLead`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'secret_key': secretKey
          }
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Lead updated successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      Alert.alert('Error', 'An error occurred while updating the lead.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={28} />
            </TouchableOpacity>
            <Text style={{ fontSize: 32, fontFamily: 'PlusSB', marginLeft: 16 }}>
              Update <Text style={{ color: '#5aaf57' }}>Lead</Text>
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
                alignItems: 'center',
              }}>
                <Text>Select Image</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.labelContainer}>
            <Text style={styles.label}>Lead Date</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <TouchableOpacity 
            style={[styles.input, errors.leadDate && styles.inputError]} 
            onPress={() => setShowLeadDatePicker(true)}
          >
            <Text>{moment(leadDate).format('MM/DD/YYYY')}</Text>
          </TouchableOpacity>
          {errors.leadDate && <Text style={styles.errorText}>{errors.leadDate}</Text>}
          <Modal visible={showLeadDatePicker} transparent animationType="slide">
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000088' }}>
              <View style={{ backgroundColor: 'white', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                <DateTimePicker
                  value={leadDate}
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

          <Text style={styles.label}>Lead Source</Text>
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
              style={[styles.dropdown]}
              dropDownContainerStyle={styles.dropDownContainer}
            />
          </View>

          <View style={styles.labelContainer}>
            <Text style={styles.label}>First & Middle Name</Text>
            <Text style={styles.required}>*</Text>
          </View>
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

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            placeholder="Last Name"
            value={form.lastName}
            onChangeText={text => handleChange('lastName', text)}
            style={styles.input}
          />

          <View style={styles.labelContainer}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <View style={{ zIndex: 900, marginTop: 4 }}>
            <DropDownPicker
              open={genderOpen}
              value={genderValue}
              items={genderItems}
              setOpen={setGenderOpen}
              setValue={(callback) => {
                const value = callback();
                setGenderValue(value);
                setErrors(prev => ({ ...prev, gender: '' }));
              }}
              setItems={setGenderItems}
              placeholder="Select Gender"
              placeholderStyle={styles.dropplace}
              listMode="SCROLLVIEW"
              style={[styles.dropdown, errors.gender && styles.inputError]}
              dropDownContainerStyle={styles.dropDownContainer}
            />
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

          <View style={styles.labelContainer}>
            <Text style={styles.label}>Contact Info</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <View style={styles.row}>
            <TextInput
              placeholder="Mobile"
              value={form.mobileNo}
              onChangeText={text => handleChange('mobileNo', text)}
              style={[styles.input, errors.mobileNo && styles.inputError]}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Email"
              value={form.emailID}
              onChangeText={text => handleChange('emailID', text)}
              style={[styles.input, errors.emailID && styles.inputError]}
              keyboardType="email-address"
            />
          </View>
          {(errors.contactInfo || errors.mobileNo || errors.emailID) && (
            <Text style={styles.errorText}>
              {errors.contactInfo || errors.mobileNo || errors.emailID}
            </Text>
          )}

          <Text style={styles.label}>Father's Name</Text>
          <TextInput
            placeholder="Father's Name"
            value={form.fatherName}
            onChangeText={text => handleChange('fatherName', text)}
            style={styles.input}
          />

          <Text style={styles.label}>Mother's Name</Text>
          <TextInput
            placeholder="Mother's Name"
            value={form.motherName}
            onChangeText={text => handleChange('motherName', text)}
            style={styles.input}
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowDobPicker(true)}>
            <Text>{dob ? moment(dob).format('MM/DD/YYYY') : 'Select Date of Birth'}</Text>
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
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Country</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <View style={{ zIndex: 800, marginTop: 4 }}>
                <DropDownPicker
                  open={countryOpen}
                  value={countryValue}
                  items={countryItems}
                  setOpen={setCountryOpen}
                  setValue={(callback) => {
                    const value = callback();
                    setCountryValue(value);
                    setErrors(prev => ({ ...prev, country: '' }));
                  }}
                  setItems={setCountryItems}
                  placeholder="Select Country"
                  listMode="SCROLLVIEW"
                  zIndex={800}
                  style={[styles.dropdown, errors.country && styles.inputError]}
                  dropDownContainerStyle={styles.dropDownContainer}
                />
              </View>
              {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}

              <View style={styles.labelContainer}>
                <Text style={styles.label}>State</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <View style={{ zIndex: 700, marginTop: 4 }}>
                <DropDownPicker
                  open={stateOpen}
                  value={stateValue}
                  items={stateItems}
                  setOpen={setStateOpen}
                  setValue={(callback) => {
                    const value = callback();
                    setStateValue(value);
                    setErrors(prev => ({ ...prev, state: '' }));
                  }}
                  setItems={setStateItems}
                  placeholder="Select State"
                  listMode="SCROLLVIEW"
                  zIndex={700}
                  style={[styles.dropdown, errors.state && styles.inputError]}
                  dropDownContainerStyle={styles.dropDownContainer}
                />
              </View>
              {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}

              <View style={styles.labelContainer}>
                <Text style={styles.label}>District</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <View style={{ zIndex: 600, marginTop: 4 }}>
                <DropDownPicker
                  open={districtOpen}
                  value={districtValue}
                  items={districtItems}
                  setOpen={setDistrictOpen}
                  setValue={(callback) => {
                    const value = callback();
                    setDistrictValue(value);
                    setErrors(prev => ({ ...prev, district: '' }));
                  }}
                  setItems={setDistrictItems}
                  placeholder="Select District"
                  listMode="SCROLLVIEW"
                  zIndex={700}
                  style={[styles.dropdown, errors.district && styles.inputError]}
                  dropDownContainerStyle={styles.dropDownContainer}
                />
              </View>
              {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}

              <Text style={styles.label}>City</Text>
              <TextInput
                placeholder="City"
                value={form.city}
                onChangeText={text => handleChange('city', text)}
                style={styles.input}
              />
              <Text style={styles.label}>Address Line 1</Text>
              <TextInput
                placeholder="Address Line 1"
                value={form.addressLine1}
                onChangeText={text => handleChange('addressLine1', text)}
                style={styles.input}
              />
              <Text style={styles.label}>Address Line 2</Text>
              <TextInput
                placeholder="Address Line 2"
                value={form.addressLine2}
                onChangeText={text => handleChange('addressLine2', text)}
                style={styles.input}
              />
            </>
          )}

          <TouchableOpacity style={styles.submitBtn} onPress={handleUpdate}>
            <Text style={{ color: '#5aaf57', fontSize: 20, fontFamily: 'PlusR' }}>Update</Text>
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
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
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
    borderColor: '#5aaf57',
    borderWidth: 1,
    padding: 10,
    width: 120,
    borderRadius: 8,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 13,
    color: '#5aaf57',
    fontFamily: 'PlusSB',
    marginLeft: 8,
  },
  required: {
    color: 'red',
    fontSize: 14,
    marginLeft: 4,
  },
  dropplace: {
    color: '#777',
    fontSize: 14,
    fontFamily: 'PlusR',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 8,
    marginTop: 4,
  },
  dropDownContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
};

export default UpdateLead;