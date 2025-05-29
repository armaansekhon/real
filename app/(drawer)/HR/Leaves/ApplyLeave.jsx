import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from 'expo-router';
import moment from 'moment';
import { useUser } from '../../../../context/UserContext';
import MyLeaves from '../../../../components/MyLeaves';
import { API_BASE_URL } from '../../../../services/api';

const ApplyLeave = () => {
  const navigation = useNavigation();
  const [applicationDate, setApplicationDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [initiatedBy, setInitiatedBy] = useState('');
  const [reason, setReason] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const{user, date}=useUser();
  const [showMyLeaves, setShowMyLeaves] = useState(false);
  const [leaveTypeOpen, setLeaveTypeOpen] = useState(false);
  const [leaveType, setLeaveType] = useState(null);
  const [leaveTypes, setLeaveTypes] = useState([])

  const [dateDurations, setDateDurations] = useState([]); // to store fetched totalDates
const [durationOptions, setDurationOptions] = useState([]); // to store fetched durationList formatted for dropdown
const [selectedDurations, setSelectedDurations] = useState({}); // to store user selections (date => id
    

  const [startChoose, setStartChoose] = useState(null);
  const [endChoose, setEndChoose] = useState(null);
  const [chooseOpen1, setChooseOpen1] = useState(false);
  const [chooseOpen2, setChooseOpen2] = useState(false);

  


  const onRefresh = () => {
    setRefreshing(true);
  
    // Reset all form state
    setApplicationDate(new Date());
    setStartDate(null);
    setEndDate(null);
    setShowExtraFields(false);
    setLeaveType(null);
    setStartChoose(null);
    setEndChoose(null);
    setReason('');
    setDateDurations([]);        // clear fetched dates
    setDurationOptions([]);      // clear dropdown options
    setSelectedDurations({});    // clear selected durations
  
    setTimeout(() => {
      setRefreshing(false);
    }, 500); // Simulate refresh
  };
  

  const fetchLeaveTypes = async () => {
    try {
         const token = await SecureStore.getItemAsync('auth_token');
      const response = await fetch(
        `${API_BASE_URL}/employee/leaveTypes`,
        {
          headers: {
            'Content-Type': 'application/json',
            'secret_key': token,
          },
        }
      );
      const data = await response.json();
  
      // Format data for DropDownPicker
      const formatted = data.map((item) => ({
        label: item.leaveName,
        value: item.id,
      }));
  
      setLeaveTypes(formatted);
    } catch (error) {
      console.error('Failed to fetch leave types:', error);
    }
  };
  const fetchDateDurations = async (start, end) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const response = await fetch(
        `${API_BASE_URL}/employee/leave-day-type/startDate/${moment(start).format('YYYY-MM-DD')}/endDate/${moment(end).format('YYYY-MM-DD')}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'secret_key': token,
          },
        }
      );
  
      const data = await response.json();
  
      // Format options for dropdown
      const options = data.durationList.map((item) => ({
        label: item.status,
        value: item.id,
      }));
  
      setDateDurations(data.totalDates || []);
      setDurationOptions(options);
    } catch (error) {
      console.error('Failed to fetch date durations:', error);
    }
  };


  useEffect(() => {
 fetchLeaveTypes();

    if (endDate) setShowExtraFields(true);
  }, [endDate]);

  const handleInfoPress = (title, message) => {
    Alert.alert(title, message);
  };

  const handleSubmit = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
  
      // Build leaveRequestDaysRestDtos array
      const leaveRequestDaysRestDtos = Object.keys(selectedDurations).map((date) => ({
        dayDate: moment(date).format('YYYY-MM-DD'),
        duration: selectedDurations[date]?.value, // id of selected duration
      }));
  
      // Build full payload
      const payload = {
        initiatedBy: user.id, // or initiatedBy state if you have
        entryDate: moment(applicationDate).format('YYYY-MM-DD'),
        leaveType: leaveType,
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
        reason: reason,
        leaveRequestDaysRestDtos: leaveRequestDaysRestDtos,
      };
  
      console.log('Payload:', payload); // <-- for checking before hitting
  
      const response = await fetch(`${API_BASE_URL}/employee/save-leave-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'secret_key': token,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', 'Leave request submitted successfully!');
      onRefresh();
      } else {
        console.error('Failed to submit:', data);
        Alert.alert('Error', data.message || 'Failed to submit leave.');
        onRefresh();
      }
    } catch (error) {
      console.error('Error submitting leave:', error);
      Alert.alert('Error', 'Something went wrong.');
      onRefresh();
    }
  };
  

  return (
    <View style={styles.container}>
       {showMyLeaves ? (
      <MyLeaves goBack={() => setShowMyLeaves(false)} />
    ):(<>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text onPress={() => setShowMyLeaves(true)} style={styles.myLeaves}>My Leaves</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} 
        
        refreshControl={
          <RefreshControl  refreshing={refreshing} onRefresh={onRefresh}></RefreshControl>
        }
        keyboardShouldPersistTaps="handled">
          <Text style={styles.pageTitle}>Apply <Text style={{ color: "#5aaf57" }}>Leave</Text></Text>
       

          {/* Row: Application Date & Initiated By */}
          <View style={styles.row}>
            <View style={styles.half}>
             
              <TouchableOpacity
              
                onPress={() =>
                  handleInfoPress('Application Date', 'This is the date you are submitting the leave application.')
                }
              >
                <Text  style={styles.appdate} >{moment(date).format('YYYY-MM-DD')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.half}>
              
              <TouchableOpacity
             
                onPress={() =>
                  handleInfoPress('Initiated By', 'This is the name of the person applying for leave.')
                }
              >
                <Text    style={styles.ename} >{user.name}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Leave Type Picker */}
          <Text style={styles.label}>Leave Type</Text>
          <View style={{ zIndex: 3000 }}>
            <DropDownPicker
              open={leaveTypeOpen}
              value={leaveType}
              items={leaveTypes}
              setOpen={setLeaveTypeOpen}
              setValue={setLeaveType}
              setItems={setLeaveTypes}
              placeholder="Select leave type"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownBox}
              zIndex={3000}
              zIndexInverse={1000}
              listMode="SCROLLVIEW"
            />
          </View>

          {/* Row: Start Date and End Date */}
          <View style={[styles.row, { marginTop: 16 }]}>
            <View style={styles.half}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowStartPicker(true)}
              >
                <Text>{startDate ? moment(startDate).format('YYYY-MM-DD') : 'Select date'}</Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate ? new Date(startDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowStartPicker(false);
                    if (date) setStartDate(date);
                  }}
                />
              )}
            </View>

            <View style={styles.half}>
              <Text style={styles.label}>End Date</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowEndPicker(true)}
              >
                <Text>{endDate ? moment(endDate).format('YYYY-MM-DD') : 'Select date'}</Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={endDate ? new Date(endDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowEndPicker(false);
                    if (date) {
                      setEndDate(date);
                      if (startDate) {
                        fetchDateDurations(startDate, date); // <== CALL API
                      }
                    }
                  }}
                />
              )}
            </View>
          </View>

          {/* Extra Fields
          {showExtraFields && (
            <>
              <Text style={styles.label}>Start Date Choose</Text>
              <View style={{ zIndex: 2000 }}>
                <DropDownPicker
                  open={chooseOpen1}
                  value={startChoose}
                  items={[
                    { label: 'Full Day', value: 'full' },
                    { label: 'Half Day', value: 'half' },
                  ]}
                  setOpen={setChooseOpen1}
                  setValue={setStartChoose}
                  placeholder="Select"
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownBox}
                  zIndex={2000}
                  zIndexInverse={1000}
                  listMode="SCROLLVIEW"
                />
              </View>

              <Text style={styles.label}>End Date Choose</Text>
              <View style={{ zIndex: 1000 }}>
                <DropDownPicker
                  open={chooseOpen2}
                  value={endChoose}
                  items={[
                    { label: 'Full Day', value: 'full' },
                    { label: 'Half Day', value: 'half' },
                  ]}
                  setOpen={setChooseOpen2}
                  setValue={setEndChoose}
                  placeholder="Select"
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownBox}
                  zIndex={1000}
                  zIndexInverse={500}
                  listMode="SCROLLVIEW"
                />
              </View>
            </>
          )} */}

{dateDurations.length > 0 && (
  <View style={{ marginTop: 20 }}>
    <Text style={styles.label}>Duration per Day</Text>
    {dateDurations.map((dateItem, index) => (
      <View key={index} style={{ marginBottom: 16, zIndex: 1000 - index }}>
        <Text style={[styles.label, { marginBottom: 4 }]}>{moment(dateItem).format('YYYY-MM-DD')}</Text>
        <DropDownPicker
          open={selectedDurations[dateItem]?.open || false}
          value={selectedDurations[dateItem]?.value || null}
          items={durationOptions}
          setOpen={(open) => {
            setSelectedDurations((prev) => ({
              ...prev,
              [dateItem]: { ...prev[dateItem], open },
            }));
          }}
          setValue={(callback) => {
            setSelectedDurations((prev) => ({
              ...prev,
              [dateItem]: { ...prev[dateItem], value: callback(prev[dateItem]?.value) },
            }));
          }}
          placeholder="Select Duration"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
          listMode="SCROLLVIEW"
          zIndex={1000 - index}
          zIndexInverse={index}
        />
      </View>
    ))}
  </View>
)}


          {/* Reason */}
          <Text style={styles.label}>Reason</Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            style={styles.textArea}
            placeholder="Enter reason"
            multiline
            numberOfLines={4}
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
      </>
      )}
    </View>
  );
};

export default ApplyLeave;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 80 : 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ccc',
  },
  appdate:{

    fontSize:16,
    fontFamily:"PlusR"


  },
  ename:{
fontSize:18,
    fontFamily:"PlusR",
    alignSelf:"flex-end"
    ,color:"#5aaf57"
    

  },
  myLeaves: {
    color: '#5aaf57',
    fontSize: 15,
    fontFamily: "PlusR",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#5aaf57',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 32,
    fontFamily: "PlusR",
    marginBottom: 14,
    marginTop: -10,
    color: '#222',
  },
  pageSubtitle: {
    fontSize: 15,
    marginTop: 4,
    color: '#555',
    marginBottom: 16,
    fontFamily: "PlusR",
  },
  label: {
    fontSize: 15,
    fontFamily: "PlusR",
    marginTop: 14,
    marginBottom: 6,
    color: '#5aaf57',
  },
  dateValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: "PlusR",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    fontFamily: "PlusR",
    backgroundColor: '##fff',
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
  },
  dropdownBox: {
    borderColor: '#ccc',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontFamily: "PlusR",
    padding: 10,
    fontSize: 14,
    height: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom:12,
    
  },
  half: {
    flex: 1,
    
  },
  inlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: '#5aaf57',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusR',
  },
});
