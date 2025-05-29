import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, ActivityIndicator, RefreshControl, Alert, StatusBar } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../../../../services/api';
const MonthlySalary = () => {
  const navigation = useNavigation();

  // State for employee data
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  // State for month and year selectors
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  // State for search
  const [searchQuery, setSearchQuery] = useState('');

  // State for selectable employees
  const [selectedEmployees, setSelectedEmployees] = useState({}); // { employeeId: boolean }

  // Dropdown options
  const months = [
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' },
  ];

  const years = Array.from({ length: 10 }, (_, i) => ({
    label: `${2025 - i}`,
    value: `${2025 - i}`,
  }));

  // Fetch employee salaries
  const fetchEmployeeSalaries = async (month = null, year = null) => {
    setLoading(true);
    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');
      let url = `${API_BASE_URL}/employee/salaries`;
      if (month && year) {
        url += `?selectedMonth=${month}&selectedYear=${year}`;
      }

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'secret_key': secretKey,
        },
      });

      // Log the response to understand its structure
    //   console.log('API Response (fetchEmployeeSalaries):', response.data);

      // Ensure response.data is an array; adjust based on actual API structure
      let employeeData = [];
      if (Array.isArray(response.data)) {
        employeeData = response.data;
      } else if (response.data && Array.isArray(response.data.employees)) {
        employeeData = response.data.employees;
      } else if (response.data && Array.isArray(response.data.data)) {
        employeeData = response.data.data;
      } else {
        throw new Error('Unexpected API response structure: employee data is not an array');
      }

      // Filter out invalid employee entries
      const validEmployees = employeeData.filter(emp => {
        const isValid = emp && emp.id && typeof emp.name === 'string';
        if (!isValid) {
        //   console.warn('Invalid employee entry:', emp);
        }
        return isValid;
      });

      setEmployees(validEmployees);
      setFilteredEmployees(validEmployees);

      // Reset selected employees
      const initialSelected = {};
      validEmployees.forEach(emp => {
        initialSelected[emp.id] = false;
      });
      setSelectedEmployees(initialSelected);
    } catch (error) {
      console.error('Error fetching employee salaries:', error.message || error);
      alert('Failed to fetch employee salaries. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchEmployeeSalaries();
  }, []);

  // Fetch data and show alert when month or year changes
  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchEmployeeSalaries(selectedMonth, selectedYear);
      Alert.alert(
        'Select Employees',
        'Please select the employees to generate the salary for.',
        [{ text: 'OK', onPress: () => console.log('Alert closed') }]
      );
    }
  }, [selectedMonth, selectedYear]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp => {
        const name = emp.name || '';
        return name.toLowerCase().includes(query.toLowerCase());
      });
      setFilteredEmployees(filtered);
    }
  };

  // Handle list refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEmployeeSalaries(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  // Handle full component refresh
  const handleFullRefresh = () => {
    setSelectedMonth(null);
    setSelectedYear(null);
    setSearchQuery('');
    setSelectedEmployees({});
    fetchEmployeeSalaries();
  };

  // Toggle employee selection
  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId],
    }));
  };

  // Handle salary generation
  const handleGenerateSalary = async () => {
    console.log('handleGenerateSalary called');

    const selectedIds = Object.keys(selectedEmployees).filter(
      id => selectedEmployees[id]
    );
    console.log('Selected Employee IDs:', selectedIds);
    console.log('Selected Month:', selectedMonth);
    console.log('Selected Year:', selectedYear);

    if (selectedIds.length === 0) {
      console.log('No employees selected');
      Alert.alert('No Selection', 'Please select at least one employee to generate salary.');
      return;
    }

    if (!selectedMonth || !selectedYear) {
      console.log('Month or Year not selected');
      Alert.alert('Missing Selection', 'Please select both a month and a year.');
      return;
    }

    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');
      console.log('Auth Token:', secretKey);

      if (!secretKey) {
        console.log('No auth token found');
        throw new Error('Authentication token not found');
      }

      const url = `${API_BASE_URL}/employee/salaries/calculate?selectedYear=${selectedYear}&selectedMonth=${selectedMonth}&selectedEmployeeIds=${selectedIds.join(',')}`;
      console.log('API URL:', url);

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'secret_key': secretKey,
        },
      });

      console.log('Calculate Salary Response:', response.data);
      const paramsString = JSON.stringify({
        salaryData: response.data,
        selectedMonth,
        selectedYear,
        selectedEmployeeIds: selectedIds,
      });
    
      router.push({
        pathname: '/(drawer)/HR/E-Salary/GeneratedSalary',
        params: {
          data: paramsString,
        },
      });

     
      handleFullRefresh();
    } catch (error) {
      console.error('Error generating salary:', error);
      if (error.response) {
        console.log('Error Response Data:', error.response.data);
        console.log('Error Response Status:', error.response.status);
        console.log('Error Response Headers:', error.response.headers);
      } else if (error.request) {
        console.log('Error Request:', error.request);
      } else {
        console.log('Error Message:', error.message);
      }
      Alert.alert('Error', 'Failed to generate salary. Please try again.');
    }
  };

  // Render each employee row
  const renderEmployeeItem = ({ item, index }) => (
    <View style={styles.employeeRow}>
      {selectedMonth && selectedYear && (
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => toggleEmployeeSelection(item.id)}
        >
          <Ionicons
            name={selectedEmployees[item.id] ? 'checkbox' : 'square-outline'}
            size={24}
            color={selectedEmployees[item.id] ? '#5aaf57' : '#ccc'}
          />
        </TouchableOpacity>
      )}
      <Text style={[styles.employeeCell, styles.serialNumber]}>{index + 1}</Text>
      <Text style={[styles.employeeCell, styles.name]}>{item.name || 'N/A'}</Text>
      <Text style={[styles.employeeCell, styles.designation]}>{item.designation || 'N/A'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
         
      {/* Header with Drawer Menu and Refresh Icon */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.menuIcon}
          onPress={() => navigation.toggleDrawer()}
        >
          <Ionicons name="menu" size={30} color="#5aaf57" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.refreshIcon}
          onPress={handleFullRefresh}
        >
          <Ionicons name="refresh" size={30} color="#5aaf57" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>
        Monthly <Text style={{ color: '#5aaf57' }}>Salary</Text>
      </Text>

      {/* Month and Year Selectors */}
      <View style={styles.selectorContainer}>
        <View style={[styles.selectorWrapper, { zIndex: 2000 }]}>
          <DropDownPicker
            open={monthOpen}
            value={selectedMonth}
            items={months}
            setOpen={setMonthOpen}
            setValue={setSelectedMonth}
            setItems={() => {}}
            placeholder="Select Month"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={2000}
          />
        </View>
        <View style={[styles.selectorWrapper, { zIndex: 1000 }]}>
          <DropDownPicker
            open={yearOpen}
            value={selectedYear}
            items={years}
            setOpen={setYearOpen}
            setValue={setSelectedYear}
            setItems={() => {}}
            placeholder="Select Year"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={1000}
          />
        </View>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Employee List Header */}
      <View style={styles.headerRow}>
        {selectedMonth && selectedYear && (
          <View style={styles.checkboxHeader} />
        )}
        <Text style={[styles.headerCell, styles.serialNumber]}>S.No</Text>
        <Text style={[styles.headerCell, styles.name]}>Name</Text>
        <Text style={[styles.headerCell, styles.designation]}>Designation</Text>
      </View>

      {/* Employee List */}
      {loading ? (
        <ActivityIndicator size="large" color="#5aaf57" style={styles.loader} />
      ) : filteredEmployees.length === 0 ? (
        <Text style={styles.noDataText}>No employees found.</Text>
      ) : (
        <>
          <FlatList
            data={filteredEmployees}
            renderItem={renderEmployeeItem}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={styles.employeeList}
          />
          {selectedMonth && selectedYear && (
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerateSalary}
            >
              <Text style={styles.generateButtonText}>Generate Salary</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default MonthlySalary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuIcon: {
    flex: 0.5,
  },
  refreshIcon: {
    flex: 0.5,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlusR',
    marginBottom: 20,
    color: '#333',
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  selectorWrapper: {
    flex: 0.48,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'PlusR',
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  headerCell: {
    fontSize: 16,
    fontFamily: 'PlusSB',
    color: '#333',
    textAlign: 'center',
  },
  checkboxHeader: {
    flex: 0.5,
  },
  employeeRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  employeeCell: {
    fontSize: 16,
    fontFamily: 'PlusR',
    color: '#333',
    textAlign: 'center',
  },
  checkboxContainer: {
    flex: 0.5,
    alignItems: 'center',
  },
  serialNumber: {
    flex: 0.5,
  },
  name: {
    flex: 1,
  },
  designation: {
    flex: 1,
  },
  employeeList: {
    flex: 1,
  },
  generateButton: {
    backgroundColor: '#5aaf57',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  generateButtonText: {
    fontSize: 18,
    fontFamily: 'PlusSB',
    color: '#fff',
  },
  loader: {
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    fontFamily: 'PlusR',
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});