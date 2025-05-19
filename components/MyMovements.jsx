import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
// import {getMyMovements} from "../services/api"
import { API_BASE_URL } from '../services/api';

const MyMovements= ({ goBack }) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [movementHistory, setMovementHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { user } = useUser();



  const fetchMovements = async () => {
    try {
      const userId = user.id;
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const response = await axios.get(
        `${API_BASE_URL}/employee/my-movements/employeeId/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            secret_key: secretKey,
          },
        }
      );
    //   setMovements(response.data);
    setMovements(Array.isArray(response.data) ? response.data : []);

    } catch (error) {
      console.error('Error fetching movements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovementHistory = async (mId) => {
    try {
      setHistoryLoading(true);
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const response = await axios.get(
        `${API_BASE_URL}/employee/getMovementHistories/movementId/${mId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            secret_key: secretKey,
          },
        }
      );
      setMovementHistory(response.data);
      setHistoryModalVisible(true);
    } catch (error) {
      console.error('Error fetching movement history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  const renderMovementCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.movementType}>
          {item['Movement Reason ']?.trim()}
        </Text>
        <View
          style={[
            styles.statusBadge,
            item.Status === 'Initiated' ? styles.initiated : styles.otherStatus,
          ]}
        >
          <Text style={styles.statusText}>{item.Status}</Text>
        </View>
      </View>
  
  
      <View style={styles.cardContent}>
        <View style={styles.dateRow}>
          <Text style={[styles.cardText, styles.label]}>From: </Text>
          <Text style={styles.cardText}>{item.fromTime}</Text>
          <Text style={[styles.cardText, styles.label]}>To: </Text>
          <Text style={styles.cardText}>{item.toTime}</Text>
        </View>
        <Text style={[styles.cardText, styles.label]}>
          Requested On: <Text style={styles.cardText}>{item['Movement Requested Date']}</Text>
        </Text>
        <Text style={[styles.cardText, styles.label]}>
          Reason: <Text style={styles.cardText}>{item['Movement Reason ']?.trim()}</Text>
        </Text>
      </View>
  
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => fetchMovementHistory(item.mId)}
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
        <Text style={styles.headerTitle}>My <Text style={{ color: "#5aaf57" }}>Movements</Text></Text>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={movements}
          keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
          renderItem={renderMovementCard}
          ListEmptyComponent={<Text>No movements found.</Text>}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
        />
      )}

      {/* Movement History Modal */}
      <Modal
  visible={historyModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setHistoryModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.updatedModalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Movement History</Text>
        <TouchableOpacity onPress={() => setHistoryModalVisible(false)}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {historyLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <ScrollView style={{ marginTop: 10 }}>
          {movementHistory.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No history found.</Text>
          ) : (
            <View style={styles.timelineContainer}>
              {movementHistory.map((historyItem, index) => (
                <View key={index} style={styles.timelineItem}>
                  {/* Vertical Line */}
                  {index !== 0 && <View style={styles.timelineLine} />}
                  
                  {/* Card */}
                  <View style={styles.historyCard}>
                    <Text style={styles.historyLabel}>Updated On: <Text style={styles.historyValue}>{historyItem['Updated On ']}</Text></Text>
                    <Text style={styles.historyLabel}>Movement Status: <Text style={styles.historyValue}>{historyItem['Movement Status ']}</Text></Text>
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

export default MyMovements;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding:10,
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
    marginTop:10,
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
    movementType: {
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
