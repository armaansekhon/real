import { StyleSheet, Text, View, SectionList, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
import { API_BASE_URL } from '../../../services/api';

const Appointments = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRemarks, setNewRemarks] = useState({}); // Store remarks for each appointment

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const response = await axios.get(
        `${API_BASE_URL}/realestateCustomerLead/realestateCustomerLeadApointments/${user.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'secret_key': secretKey,
          },
        }
      );

      // Sort and group appointments by date
      const sortedAppointments = response.data.sort((a, b) =>
        moment(a.appointmentDate).diff(moment(b.appointmentDate))
      );

      const groupedByDate = sortedAppointments.reduce((acc, item) => {
        const date = moment(item.appointmentDate).format('YYYY-MM-DD');
        const existingSection = acc.find((section) => section.title === date);
        if (existingSection) {
          existingSection.data.push(item);
        } else {
          acc.push({
            title: date,
            data: [item],
          });
        }
        return acc;
      }, []);

      setSections(groupedByDate);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Error', 'Failed to fetch appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update remark
  const updateRemark = async (followUpId, remark) => {
    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');
      await axios.post(
        `${API_BASE_URL}/realestateCustomerLead/updateFollowUpRemarks`,
        {
          followUpId,
          remarks: remark,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'secret_key': secretKey,
          },
        }
      );
      Alert.alert('Success', 'Remark updated successfully!');
      await fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error updating remark:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update remark. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Render address
  const renderAddress = (item) => {
    const fields = [item.address1, item.address2, item.city, item.district, item.state, item.country];
    const validFields = fields.filter((field) => field && field !== 'null').join(', ');
    return validFields || 'Not provided';
  };

  // Render each appointment card
  const renderAppointment = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerRow}>
          <Ionicons name="person" size={20} color="#5aaf57" style={styles.icon} />
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <View style={styles.headerRow2}>
          <Ionicons name="call" size={20} color="#5aaf57" style={styles.icon} />
          <Text style={styles.mobile}>{item.mobileNo}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        
        <Text style={styles.detail}>
          <Text style={styles.label}>Address: </Text>
          {renderAddress(item)}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Description: </Text>
          {item.description || 'None'}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Remark: </Text>
          {item.lastFollowUpRemarks ? (
            item.lastFollowUpRemarks
          ) : (
            <View style={styles.remarkInputContainer}>
              <TextInput
                style={styles.remarkInput}
                placeholder="Add remark"
                value={newRemarks[item.id] || ''}
                onChangeText={(text) =>
                  setNewRemarks((prev) => ({ ...prev, [item.id]: text }))
                }
                multiline
              />
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => {
                  const remark = newRemarks[item.id]?.trim();
                  if (!remark) {
                    Alert.alert('Error', 'Please enter a remark.');
                    return;
                  }
                  updateRemark(item.id, remark);
                }}
              >
                <Text style={styles.submitBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </Text>
      </View>
    </View>
  );

  // Render section header
  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>
        {moment(title).format('ddd, MMM D, YYYY')}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Drawer Button */}
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Header */}
      <Text style={styles.header}>
        My <Text style={{ color: '#5aaf57' }}>Appointments</Text>
      </Text>

      {/* Appointment List */}
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : sections.length === 0 ? (
        <Text style={styles.emptyText}>No appointments found.</Text>
      ) : (
        <SectionList
          sections={sections}
          renderItem={renderAppointment}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

export default Appointments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  menuContainer: {
    marginBottom: 10,
  },
  header: {
    fontSize: 32,
    fontFamily: 'PlusR',
    marginVertical: 10,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'PlusR',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'PlusR',
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  listContainer: {
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#f0f9f0',
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#5aaf57',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontFamily: 'PlusSB',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 4,
    padding: 15,
    shadowColor: '#5aaf57',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flex:1,
    flexDirection: 'row',
    justifyContent:"space-between",
    
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  headerRow2: {
    flexDirection: 'row',
  
    alignItems: 'center',
    marginVertical: 2,
  },
  icon: {
    marginRight: 8,
  },
  name: {
    fontSize: 20,
    fontFamily: 'PlusSB',
    color: '#333',
  },
  mobile: {
    fontSize: 16,
    fontFamily: 'PlusR',
    color: '#555',
  },
  cardBody: {
    gap: 8,
  },
  detail: {
    fontSize: 15,
    fontFamily: 'PlusR',
    color: '#333',
  },
  label: {
    fontFamily: 'PlusSB',
    color: '#5aaf57',
  },
  remarkInputContainer: {
    marginTop: 8,
    gap: 10,
  },
  remarkInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    fontFamily: 'PlusR',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#5aaf57',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 16,
    fontFamily: 'PlusSB',
    color: '#fff',
  },
});