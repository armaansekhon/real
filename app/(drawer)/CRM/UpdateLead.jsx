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
  const [dob, setDob] = useState(null); // Changed to null initially
  const [showDobPicker, setShowDobPicker] = useState(false);

  const [leadSourceOpen, setLeadSourceOpen] = useState(false);
  const [leadSourceValue, setLeadSourceValue] = useState(null);
  const [leadSourceItems, setLeadSourceItems] = useState([
    { label: 'Referral', value: 'referral' },
    { label: 'Online', value: 'online' },
    { label: 'Walk In', value: 'walkin' }, // Changed to match received data
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

  // Prefill form with leadData
  useEffect(() => {
    if (!leadData) {
      console.error('leadData is undefined');
      Alert.alert('Error', 'No lead data received. Please try again.');
      navigation.goBack();
      return;
    }

    let parsedLeadData;
    try {
      parsedLeadData = JSON.parse(leadData);
      console.log('Parsed leadData:', parsedLeadData);
    } catch (e) {
      console.error('Error parsing leadData:', e);
      Alert.alert('Error', 'Failed to parse lead data. Please try again.');
      navigation.goBack();
      return;
    }

    setForm({
      firstName: parsedLeadData.name?.split(' ')[0] || '',
      middleName: parsedLeadData.middleName || '',
      lastName: parsedLeadData.lastName || parsedLeadData.name?.split(' ').slice(1).join(' ') || '',
      mobileNo: parsedLeadData.mobileNo || '',
      emailID: parsedLeadData.emailID || '',
      fatherName: parsedLeadData.fatherName || '',
      motherName: parsedLeadData.motherName || '',
      city: parsedLeadData.city || '',
      addressLine1: parsedLeadData.address1 || '',
      addressLine2: parsedLeadData.address2 || '',
    });

    setCountryValue(parsedLeadData.countryId || null);
    setStateValue(parsedLeadData.stateId || null);
    setDistrictValue(parsedLeadData.districtId || null);

    const leadSourceMatch = leadSourceItems.find(item => 
      item.label.toLowerCase() === parsedLeadData.leadFrom?.toLowerCase()
    );
    setLeadSourceValue(leadSourceMatch ? leadSourceMatch.value : parsedLeadData.leadFrom || null);

    const genderMatch = genderItems.find(item => 
      item.value.toLowerCase() === parsedLeadData.gender?.toLowerCase()
    );
    setGenderValue(genderMatch ? genderMatch.value : parsedLeadData.gender || null);

    if (parsedLeadData.leadGenerationDate) {
      const leadGenDate = new Date(parsedLeadData.leadGenerationDate);
      if (!isNaN(leadGenDate.getTime())) {
        setLeadDate(leadGenDate);
      }
    }

    if (parsedLeadData.dob) {
      const dobDate = new Date(parsedLeadData.dob);
      if (!isNaN(dobDate.getTime())) {
        setDob(dobDate);
      }
    }

    if (parsedLeadData.profile) {
      setImage(`data:image/jpeg;base64,${parsedLeadData.profile}`);
    }

    setAddressNeeded(
      !!parsedLeadData.city || 
      !!parsedLeadData.address1 || 
      !!parsedLeadData.address2 || 
      !!parsedLeadData.country || 
      !!parsedLeadData.state || 
      !!parsedLeadData.district
    );
  }, [leadData, leadSourceItems, genderItems]);

  // Fetch initial dropdown data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const secretKey = await SecureStore.getItemAsync('auth_token');

        const countryRes = await fetch('http://192.168.6.210:8686/pipl/api/v1/employee/countries', {
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

        const leadRes = await fetch('http://192.168.6.210:8000/pipl/api/v1/leadFromCustomer/getAllLeadFromData', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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
        const res = await fetch(`http://192.168.6.210:8686/pipl/api/v1/employee/getStatesByCountryId/${countryValue}`, {
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
        const res = await fetch(`http://192.168.6.210:8686/pipl/api/v1/employee/getDistrictByStateId/${stateValue}`, {
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
  };

  const handleUpdate = async () => {
    if (!leadData) {
      Alert.alert('Error', 'Lead data is missing.');
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
        'http://192.168.6.210:8000/pipl/api/v1/realestateCustomerLead/addRealestateCustomerLead',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            // 'secret_key': token if needed
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

          <Text style={styles.label}>Lead Date</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowLeadDatePicker(true)}>
            <Text>{moment(leadDate).format('MM/DD/YYYY')}</Text>
          </TouchableOpacity>
          <Modal visible={showLeadDatePicker} transparent animationType="slide">
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000088' }}>
              <View style={{ backgroundColor: 'white', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                <DateTimePicker
                  value={leadDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowLeadDatePicker(false);
                    if (selectedDate) setLeadDate(selectedDate);
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
            />
          </View>

          <Text style={styles.label}>First & Middle Name</Text>
          <View style={styles.row}>
            <TextInput
              placeholder="First Name"
              value={form.firstName}
              onChangeText={text => handleChange('firstName', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Middle Name"
              value={form.middleName}
              onChangeText={text => handleChange('middleName', text)}
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            placeholder="Last Name"
            value={form.lastName}
            onChangeText={text => handleChange('lastName', text)}
            style={styles.input}
          />

          <Text style={styles.label}>Gender</Text>
          <View style={{ zIndex: 900, marginTop: 4 }}>
            <DropDownPicker
              open={genderOpen}
              value={genderValue}
              items={genderItems}
              setOpen={setGenderOpen}
              setValue={setGenderValue}
              setItems={setGenderItems}
              placeholder="Select Gender"
              placeholderStyle={styles.dropplace}
              listMode="SCROLLVIEW"
            />
          </View>

          <Text style={styles.label}>Contact Info</Text>
          <View style={styles.row}>
            <TextInput
              placeholder="Mobile"
              value={form.mobileNo}
              onChangeText={text => handleChange('mobileNo', text)}
              style={styles.input}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Email"
              value={form.emailID}
              onChangeText={text => handleChange('emailID', text)}
              style={styles.input}
              keyboardType="email-address"
            />
          </View>

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
              <Text style={styles.label}>Country</Text>
              <View style={{ zIndex: 800, marginTop: 4 }}>
                <DropDownPicker
                  open={countryOpen}
                  value={countryValue}
                  items={countryItems}
                  setOpen={setCountryOpen}
                  setValue={setCountryValue}
                  setItems={setCountryItems}
                  placeholder="Select Country"
                  listMode="SCROLLVIEW"
                  zIndex={800}
                />
              </View>

              <Text style={styles.label}>State</Text>
              <View style={{ zIndex: 700, marginTop: 4 }}>
                <DropDownPicker
                  open={stateOpen}
                  value={stateValue}
                  items={stateItems}
                  setOpen={setStateOpen}
                  setValue={setStateValue}
                  setItems={setStateItems}
                  placeholder="Select State"
                  listMode="SCROLLVIEW"
                  zIndex={700}
                />
              </View>

              <Text style={styles.label}>District</Text>
              <View style={{ zIndex: 600, marginTop: 4 }}>
                <DropDownPicker
                  open={districtOpen}
                  value={districtValue}
                  items={districtItems}
                  setOpen={setDistrictOpen}
                  setValue={setDistrictValue}
                  setItems={setDistrictItems}
                  placeholder="Select District"
                  listMode="SCROLLVIEW"
                  zIndex={700}
                />
              </View>

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
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 13,
    color: '#5aaf57',
    fontFamily: 'PlusSB',
    marginLeft: 8,
  },
  dropplace: {
    color: '#777',
    fontSize: 14,
    fontFamily: 'PlusR',
  },
};

export default UpdateLead;