import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { API_BASE_URL } from '../../../services/api';


const ManageCustomers = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const Router = useRouter();

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const response = await axios.get(`${API_BASE_URL}/realestateCustomer/realEstateCustomers`, {
        headers: {
          'Content-Type': 'application/json',
          'secret_key': secretKey
        },
      });
      setCustomers(response.data);
      setFilteredCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Failed to fetch customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle Search
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };

  // Navigate to ViewCustomer with customer ID
  const navigateToViewCustomer = (customerId) => {
    Router.push({
      pathname: "/(drawer)/CRM/ViewCustomer",
      params: { id: JSON.stringify(customerId) },
    });
  };

  // Navigate to AddDocs with customer ID
  const navigateToAddDocs = (customerId) => {
    Router.push({
      pathname: "/(drawer)/CRM/AddDocs",
      params: { id: JSON.stringify(customerId) },
    });
  };

  // Render Customer Card
  const renderCustomerCard = ({ item }) => {
    const address = `${item.pDistrict}, ${item.pState}, ${item.pCountry}`;
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => navigateToViewCustomer(item.id)}
        >
          {/* Profile Picture */}
          <View style={styles.profilePicContainer}>
            <Image
              source={
                item.profile
                  ? { uri: `data:image/jpeg;base64,${item.profile}` }
                  : require('../../../assets/images/onboard.jpg')
              }
              style={styles.profilePic}
            />
          </View>
          {/* Customer Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>Mobile: {item.mobileNo}</Text>
            <Text style={styles.detail}>Gender: {item.gender}</Text>
            <Text style={styles.detail}>Address: {address}</Text>
          </View>
        </TouchableOpacity>
        {/* Update Icon */}
        <TouchableOpacity
          style={styles.updateIcon}
          onPress={() => {
            Router.push({
              pathname: "/(drawer)/CRM/UpdateCustomer",
              params: { id: JSON.stringify(item.id) },
            });
          }}
        >
          <Feather name="edit" size={24} color="#5aaf57" />
        </TouchableOpacity>
        {/* Add Docs Icon */}
        <TouchableOpacity
          style={styles.addDocsIcon}
          onPress={() => navigateToAddDocs(item.id)}
        >
          <Feather name="plus-circle" size={24} color="#5aaf57" />
        </TouchableOpacity>
      </View>
    );
  };

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
        Manage <Text style={{ color: '#5aaf57' }}>Customers</Text>
      </Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Ionicons name="search" size={24} color="#5aaf57" style={styles.searchIcon} />
      </View>

      {/* Loading Animation or Customer List */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <LottieView
            source={require('../../../assets/svg/loader2.json')}
            autoPlay
            loop
            style={styles.loader}
          />
        </View>
      ) : (
        <FlatList
          data={filteredCustomers}
          renderItem={renderCustomerCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No customers found.</Text>}
        />
      )}
    </SafeAreaView>
  );
};

export default ManageCustomers;

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    fontFamily: 'PlusR',
  },
  searchIcon: {
    marginLeft: 5,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'PlusR',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#5aaf57',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePicContainer: {
    marginRight: 15,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontFamily: 'PlusSB',
    color: '#333',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    fontFamily: 'PlusR',
    color: '#666',
    marginBottom: 3,
  },
  updateIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 5,
  },
  addDocsIcon: {
    position: 'absolute',
    top: 0,
    right: 50,
    padding: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 100,
    height: 100,
    transform:[{scale:2.8}],
    bottom:30,
  },
});