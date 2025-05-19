import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  Button,
  Image,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../services/api';

const EmployeeList = ({ onSelectEmployee }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [maxSelectableDate, setMaxSelectableDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);


  const fetchEmployees = async (dateToUse) => {
    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const formattedDate = moment(dateToUse).format('YYYY-MM-DD');

      console.log("Token:", secretKey);
      
      console.log("Date Used:", dateToUse );
      console.log("Date Used:", formattedDate );
      const response = await fetch(
        `${API_BASE_URL}/employee/today-all-employee-attendance/selectedDate/${formattedDate}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'secret_key': secretKey,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', response.status, errorText);
        throw new Error('Failed to fetch employee data');
      }

      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load employee data.');
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const currentDayDateString = await SecureStore.getItemAsync('currentDayDate');
        if (currentDayDateString) {
          const parsedDate = new Date(currentDayDateString); // Ensure it's a Date
          setMaxSelectableDate(parsedDate);
          setSelectedDate(parsedDate);
          await fetchEmployees(parsedDate); // Explicit call here
        }
      } catch (e) {
        console.error('Error during init:', e);
      }
    };
  
    init();
  }, []);
  



  const filteredEmployees = employees.filter(
    (emp) =>
      emp.employeeName &&
      emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Date selector */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {moment(selectedDate).format('dddd, MMMM DD, YYYY')}
        </Text>
      </TouchableOpacity>

      {/* Date picker modal */}
      <Modal
        transparent
        visible={showDatePicker}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={(event, date) => {
                if (date) {
                  setSelectedDate(date);
                  fetchEmployees(date); // fetch when user picks a date
                }
                setShowDatePicker(false);
              }}
              maximumDate={maxSelectableDate}
            />
            <Button title="Close" onPress={() => setShowDatePicker(false)} />
          </View>
        </View>
      </Modal>

      <View style={styles.legendContainer}>
  
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: '#28a745' }]} />
    <Text style={styles.legendText}>By-User</Text>
  </View>
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: '#007BFF' }]} />
    <Text style={styles.legendText}>By-Admin</Text>
  </View>
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: '#dc3545' }]} />
    <Text style={styles.legendText}>Not Marked</Text>
  </View>
</View>

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={22} color="#5aaf57" style={styles.searchIcon} />
        <TextInput
          placeholder="Search by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>


      {/* Employee list */}
      <View style={styles.listWrapper}>
        <FlatList
          data={filteredEmployees}
          keyExtractor={(item) => item.employeeId.toString()}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await fetchEmployees(selectedDate); // refresh current date's data
            setRefreshing(false);
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSelectEmployee(item)}
              style={styles.item}
            >
              <View style={styles.nameWithIndicator}>
                <View
                  style={[
                    styles.indicatorDot,
                    {
                      backgroundColor:
                        item.markedBy === 'Admin'
                          ? '#007BFF' // Blue
                          : item.markedBy === 'byUser'
                          ? '#28a745' // Green
                          : '#dc3545' // Red (for any other case)
                    }
                  ]}
                />
              </View>
              <Text style={styles.name}>{item.employeeName}</Text>
              <Text style={styles.time}>{item.checkIn || '-'}</Text>
              <Text style={styles.time}>{item.checkOut || '-'}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  listWrapper: {
    height: 320,
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  id: {
    width: 55,
    fontSize: 14,
    fontFamily: 'PlusR',
    color: '#333',
    textAlign: 'center',
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusR',
    color: '#111',
    textAlign: 'left',
  },
  time: {
    width: 80,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'PlusR',
  },
  nameWithIndicator: {
    alignItems: 'center',
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  searchWrapper: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusR',
  },
  dateButton: {
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 36,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    ...Platform.select({
      ios: {
        shadowColor: '#5aaf57',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
      },
      android:{
        elevation:3,
      }
    }),
  },
  dateButtonText: {
    color: '#111',
    fontSize: 15,
    fontFamily: 'PlusR',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#444',
    fontFamily: 'PlusR',
  },
});

export default EmployeeList;
