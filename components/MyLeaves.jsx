import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { API_BASE_URL } from '../services/api';

const MyLeaves = ({ goBack }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { user } = useUser();

  const fetchLeaves = async () => {
    try {
      const userId = user.id;
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const response = await axios.get(
        `${API_BASE_URL}/employee/my-leave/employeeId/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            secret_key: secretKey,
          },
        }
      );
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveHistory = async (leaveId) => {
    try {
      setHistoryLoading(true);
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const response = await axios.get(
        `${API_BASE_URL}/employee/getMyLeaveHistories/id/${leaveId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            secret_key: secretKey,
          },
        }
      );
      setLeaveHistory(response.data);
      setHistoryModalVisible(true);
    } catch (error) {
      console.error('Error fetching leave history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const renderLeaveCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.leaveType}>{item['Leave Type']}</Text>
        <View style={[styles.statusBadge, item.Status === 'Initiated' ? styles.initiated : styles.otherStatus]}>
          <Text style={styles.statusText}>{item.Status}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.dateRow}>
          <Text style={[styles.cardText, styles.label]}>From: </Text>
          <Text style={styles.cardText}>{item.From}</Text>
          <Text style={[styles.cardText, styles.label]}>To: </Text>
          <Text style={styles.cardText}>{item.To}</Text>
        </View>
        <Text style={[styles.cardText, styles.label]}>
          Requested On: <Text style={styles.cardText}>{item['Leave Requested Date']}</Text>
        </Text>
        <Text style={[styles.cardText, styles.label]}>
          Reason: <Text style={styles.cardText}>{item.Reason?.trim()}</Text>
        </Text>
      </View>

      {/* Leave History Button */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => fetchLeaveHistory(item.id)}
      >
        <Text style={styles.historyButtonText}>History</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My <Text style={{ color: "#5aaf57" }}>Leaves</Text></Text>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={leaves}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLeaveCard}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
        />
      )}

      {/* Leave History Modal */}
      <Modal
  visible={historyModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setHistoryModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.updatedModalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Leave History</Text>
        <TouchableOpacity onPress={() => setHistoryModalVisible(false)}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {historyLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <ScrollView style={{ marginTop: 10 }}>
          {leaveHistory.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No history found.</Text>
          ) : (
            <View style={styles.timelineContainer}>
              {leaveHistory.map((historyItem, index) => (
                <View key={index} style={styles.timelineItem}>
                  {/* Vertical Line */}
                  {index !== 0 && <View style={styles.timelineLine} />}
                  
                  {/* Card */}
                  <View style={styles.historyCard}>
                    <Text style={styles.historyLabel}>Updated On: <Text style={styles.historyValue}>{historyItem['Updated On ']}</Text></Text>
                    <Text style={styles.historyLabel}>Leave Status: <Text style={styles.historyValue}>{historyItem['Leave Status ']}</Text></Text>
                    <Text style={styles.historyLabel}>Updated By: <Text style={styles.historyValue}>{historyItem['Updated By ']}</Text></Text>
                    <Text style={styles.historyLabel}>Remarks: <Text style={styles.historyValue}>{historyItem['Remarks ']}</Text></Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
};

export default MyLeaves;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: "PlusR",
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 15,
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#5aaf57',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leaveType: {
    fontSize: 21,
    color: '#000',
    fontFamily: "PlusR",
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  initiated: {
    backgroundColor: '#ffcc00',
  },
  otherStatus: {
    backgroundColor: '#4caf50',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: "PlusSB",
  },
  cardContent: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#111',
    marginVertical: 5,
    fontFamily: "PlusR",
  },
  label: {
    fontWeight: 'bold',
    color: '#5aaf57',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyButton: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    right: 16,
    borderColor: '#007bff',
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
  },
  historyButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontFamily: "PlusSB",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: "PlusSB",
  },
  historyItem: {
    marginBottom: 15,
  },
  historyLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5aaf57',
    fontFamily: "PlusSB",
  },
  historyValue: {
    fontSize: 14,
    color: '#111',
    fontFamily: "PlusR",
  },
  historyDivider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  historyCard: {
    width: '90%',
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#5aaf57',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  updatedModalContent: {
    width: '95%',
    maxHeight: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  timelineContainer: {
    marginTop: 10,
    paddingVertical: 10,
  },
  
  timelineItem: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  
  timelineLine: {
    position: 'absolute',
    top: -30,
    height: 30,
    width: 2,
    backgroundColor: '#5aaf57',
    zIndex: -1,
  },
  
});
// {
//   "expo": {
//     "name": "real",
//     "slug": "real",
//     "version": "1.0.0",
//     "orientation": "portrait",
//     "icon": "./assets/images/home.png",
//     "scheme": "myapp",
//     "userInterfaceStyle": "automatic",
//     "newArchEnabled": true,
//     "ios": {
//       "supportsTablet": true,
//       "config": {
//         "googleMapsApiKey": "AIzaSyDnCsVRHzRBcuK0MKb2XEU_3j33m7j5nu8"
//       },
//       "infoPlist": {
//         "NSLocationWhenInUseUsageDescription": "This app needs access to your location to show your position on the map."
//       }
//     },
//     "android": {
//       "config": {
//         "googleMaps": {
//           "apiKey": "AIzaSyBfn929pa3P522jsnDS8gn7mvxcYY7Z_RU"
//         }
//       },
//       "adaptiveIcon": {
//         "foregroundImage": "./assets/images/home.png",
//         "backgroundColor": "#ffffff"
//       },
//       "permissions": [
//         "INTERNET",
//         "CAMERA",
//         "READ_EXTERNAL_STORAGE",
//         "WRITE_EXTERNAL_STORAGE"
//       ],
//       "package": "com.karishmaraina.real"
//     },
//     "web": {
//       "bundler": "metro",
//       "output": "static",
//       "favicon": "./assets/images/home.png"
//     },
//     "plugins": [
//       "expo-router",
//       [
//         "expo-splash-screen",
//         {
//           "image": "./assets/images/home.png",
//           "imageWidth": 200,
//           "resizeMode": "contain",
//           "backgroundColor": "#ffffff"
//         }
//       ],
//       "expo-secure-store"
//     ],
//     "experiments": {
//       "typedRoutes": true
//     },
//     "extra": {
//       "router": {},
//       "eas": {
//         "projectId": "4832712f-ce34-4f8b-a1e8-b02dee382566"
//       }
//     }
//   }
// }
