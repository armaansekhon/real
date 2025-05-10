import { StyleSheet, Text, TouchableOpacity, Modal, View, TextInput, FlatList, Image, Alert, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useRouter } from 'expo-router';
import { useUser } from '../../../context/UserContext';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_BASE_URL } from '../../../services/api';

const statusColors = {
  'Not Started': '#888c4a',  // Gray
  'Not Picked': '#000000',   // Red
  "HOT": "#5a0202",
  'WARM': '#fa6161',         // Orange
  'Registered': "#5ee802",
  'COLD': '#0275d8',         // Blue
  "STARTED": '#ee961b',      // Blue
  "Duplicate": '#1808f7',    // Blue
  'CLOSED': '#30b3df',       // Blue
  Default: '#5aaf57',        // Green
};

const ManageLeads = () => {
  const [search, setSearch] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const Navigation = useNavigation();
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const Router = useRouter();

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(search.toLowerCase())
  );

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const res = await fetch(
        `${API_BASE_URL}/realestateCustomerLead/getAllCustomerLeads`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'secret_key': secretKey,
          },
        }
      );
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
      Alert.alert('Error', 'Failed to fetch leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (leadId) => {
    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const response = await axios.delete(
        `${API_BASE_URL}/realestateCustomerLead/realestateCustomerLeadDelete?id=${leadId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'secret_key': secretKey,
          },
        }
      );
      if (response.status === 200 || response.status === 204) {
        Alert.alert('Success', 'Lead deleted successfully!');
        await fetchLeads(); // Refresh the lead list
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete lead. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleDeletePress = (leadId, leadName) => {
    Alert.alert(
      'Confirm Delete',
      `Do you really want to delete the lead "${leadName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteLead(leadId),
        },
      ],
      { cancelable: true }
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeads();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Menu */}
      <View>
        <TouchableOpacity onPress={() => Navigation.openDrawer()}>
          <Ionicons name="menu" size={28} />
        </TouchableOpacity>
      </View>

      {/* Header */}
      <Text style={styles.header}>
        Manage <Text style={{ color: '#5aaf57' }}>Leads</Text>
      </Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#555" style={styles.searchIcon} />
        <TextInput
          placeholder="Search leads"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Lead Cards */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredLeads}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const normalizedStatus = item.currentFollowUpStatus?.trim();
          const badgeColor = statusColors[normalizedStatus] || statusColors.Default;
          return (
            <TouchableOpacity
              onPress={() => {
                setSelectedLead(item);
                setModalVisible(true);
              }}
            >
              <View style={styles.card}>
                {/* Follow-up status badge - top left */}
                <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}>
                  <Text style={styles.statusText}>{item.currentFollowUpStatus}</Text>
                </View>

                {/* Delete icon - top right */}
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleDeletePress(item.id, item.name)}
                >
                  <Ionicons name="close" size={24} color="#d11a2a" />
                </TouchableOpacity>

                {/* Image */}
                <Image
                  source={
                    item.profile
                      ? { uri: `data:image/jpeg;base64,${item.profile}` }
                      : require('../../../assets/images/onboard.jpg')
                  }
                  style={styles.image}
                />

                {/* Lead Info & Actions */}
                <View style={styles.details}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.contact}>{item.mobileNo}</Text>
                  <Text style={styles.gender}>{item.gender}</Text>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      onPress={() => {
                        Router.push({
                          pathname: "/(drawer)/CRM/UpdateLead",
                          params: { leadData: JSON.stringify(item) },
                        });
                      }}
                      style={styles.actionBtn}
                    >
                      <Feather name="edit" size={24} color="#007bff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => {
                        Router.push({
                          pathname: "/(drawer)/CRM/Followup",
                          params: { leadData: JSON.stringify(item) },
                        });
                      }}
                    >
                      <Ionicons name="paper-plane-sharp" size={24} color="#5aaf57" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModal}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

            {selectedLead && (
              <>
                {/* Full Name */}
                <Text style={styles.modalTitle}>
                  {`${selectedLead.name || ''} ${selectedLead.middleName || ''} ${selectedLead.lastName || ''}`.trim() || 'Unnamed Lead'}
                </Text>

                {/* Contact Info */}
                <Text style={styles.modalSectionTitle}>Contact Information</Text>
                <Text style={styles.modalText}>📞 Mobile: {selectedLead.mobileNo || 'N/A'}</Text>
                <Text style={styles.modalText}>📧 Email: {selectedLead.emailID || 'N/A'}</Text>
                <Text style={styles.modalText}>👤 Gender: {selectedLead.gender || 'N/A'}</Text>

                {/* Location Info */}
                <Text style={styles.modalSectionTitle}>Location</Text>
                <Text style={styles.modalText}>🌍 Country: {selectedLead.country || 'N/A'}</Text>
                <Text style={styles.modalText}>🏙️ State: {selectedLead.state || 'N/A'}</Text>
                <Text style={styles.modalText}>📍 District: {selectedLead.district || 'N/A'}</Text>
                <Text style={styles.modalText}>🏠 City: {selectedLead.city || 'N/A'}</Text>

                {/* Lead Info */}
                <Text style={styles.modalSectionTitle}>Lead Details</Text>
                <Text style={styles.modalText}>📅 Lead Date: {selectedLead.leadGenerationDate || 'N/A'}</Text>
                <Text style={styles.modalText}>📌 Lead From: {selectedLead.leadFrom || 'N/A'}</Text>
                <Text style={styles.modalText}>🏢 Branch: {selectedLead.branchName || 'N/A'}</Text>
                <Text style={styles.modalText}>🎯 Status: {selectedLead.currentFollowUpStatus || 'N/A'}</Text>
                <Text style={styles.modalText}>🗓️ Next Follow-up: {selectedLead.nextFollowUpDate || 'N/A'}</Text>

                {/* Remarks */}
                <Text style={styles.modalSectionTitle}>Remarks</Text>
                <Text style={styles.modalText}>💬 Last Remark: {selectedLead.lastFollowUpRemarks || 'None'}</Text>
                <Text style={styles.modalText}>📅 Last Follow-up: {selectedLead.lastFollowUpDate || 'N/A'}</Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ManageLeads;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontFamily: 'PlusR',
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: '#ffff',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
    color: "#5aaf57"
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    fontFamily: "PlusR"
  },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingTop: 10,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#5aaf57',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  image: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginRight: 5,
    marginLeft: 15,
    borderRadius: 60,
  },
  details: {
    flex: 1,
    paddingLeft: 50,
    alignItems: "baseline",
  },
  name: {
    fontSize: 18,
    marginTop: 30,
    marginBottom: 10,
    fontFamily: "PlusR"
  },
  contact: {
    fontSize: 15,
    marginBottom: 1,
    fontFamily: 'PlusR',
    color: '#555',
  },
  gender: {
    fontSize: 15,
    color: '#555',
    fontFamily: 'PlusR',
  },
  buttonRow: {
    flexDirection: 'row',
    alignSelf: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  actionBtn: {
    backgroundColor: 'transparent',
    padding: 6,
    borderRadius: 6,
    bottom: 7,
  },
  statusBadge: {
    position: 'absolute',
    top: -6,
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: "PlusSB"
  },
  deleteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  closeModal: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 15,
    fontFamily: "PlusSB",
    textAlign: 'center',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontFamily: "PlusSB",
    marginTop: 10,
    marginBottom: 5,
    color: '#5aaf57',
  },
  modalText: {
    fontSize: 14,
    fontFamily: "PlusSB",
    marginBottom: 4,
    color: '#333',
  },
  closeModal: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  }
});