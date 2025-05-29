import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  FlatList,
  Image,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const Geolocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapRef, setMapRef] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigation = useNavigation();

  // Employee data with locations and images
  const employees = [
    {
      id: "1",
      name: "Manpreet Kaur",
      latitude: 30.683267,
      longitude: 76.694983,
      description: "A beautiful city in California.",
      pic: require("../../assets/images/woman.png"),
    },
    {
      id: "2",
      name: "Karishma Raina",
      latitude: 34.0522,
      longitude: -118.2437,
      description: "The entertainment capital of the world.",
      pic: require("../../assets/images/karishma.jpeg"),
    },
    {
      id: "3",
      name: "Armaan Sekhon",
      latitude: 40.7128,
      longitude: -74.006,
      description: "The city that never sleeps.",
      pic: require("../../assets/images/armaan.jpeg"),
    },

  ];

  // Fetch user's current location
  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation.coords);
      setErrorMsg(null);
    } catch (error) {
      setErrorMsg("Error fetching location: " + error.message);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // Filter employees based on search query
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle selecting an employee from the dropdown
  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setSearchQuery(employee.name);
    setShowDropdown(false);

    if (mapRef) {
      mapRef.animateToRegion(
        {
          latitude: employee.latitude,
          longitude: employee.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Retry fetching location if it fails
  const handleRetry = () => {
    setErrorMsg(null);
    fetchLocation();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Menu Icon */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Header Text with Lottie Animation */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>View</Text>
          <Text style={styles.headerSubTitle}>Locations</Text>
          <Text style={styles.headerDesc}>
            Search for an employee to view their location!
          </Text>
        </View>
        <LottieView
          source={require("../../assets/svg/geoo.json")} // Replace with your Lottie file
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      {/* Search Bar with Dropdown Icon */}
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="#5aaf57"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Search employee by name..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setShowDropdown(true);
            setSelectedEmployee(null); // Reset selected employee while searching
          }}
          onFocus={() => setShowDropdown(true)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery("");
              setShowDropdown(false);
              setSelectedEmployee(null);
            }}
            style={styles.clearIcon}
          >
            <AntDesign name="closecircle" size={18} color="#aaa" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownIcon}>
          <Feather
            name={showDropdown ? "chevron-up" : "chevron-down"}
            size={20}
            color="#5aaf57"
          />
        </TouchableOpacity>
      </View>

      {/* Dropdown for Employees */}
      {showDropdown && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredEmployees.length > 0 ? filteredEmployees : employees}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectEmployee(item)}
              >
                <Image
                  source={typeof item.pic === "string" ? { uri: item.pic } : item.pic}
                  style={styles.dropdownAvatar}
                />
                <Text style={styles.dropdownText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyDropdown}>
                <Text style={styles.emptyText}>No employees found</Text>
              </View>
            }
          />
        </View>
      )}

      {/* Map or Loading/Error State */}
      {location ? (
        <MapView
          ref={(ref) => setMapRef(ref)}
          style={styles.map}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          {/* User's current location */}
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
            description="This is your current location"
            pinColor="#5aaf57"
          />

          {/* All employee locations with default markers */}
          {employees.map((emp) => (
            <Marker
              key={emp.id}
              coordinate={{
                latitude: emp.latitude,
                longitude: emp.longitude,
              }}
              title={emp.name}
              description={emp.description}
              pinColor="#ff0000"
            />
          ))}

          {/* Custom marker for selected employee */}
          {selectedEmployee && (
            <Marker
              coordinate={{
                latitude: selectedEmployee.latitude,
                longitude: selectedEmployee.longitude,
              }}
              title={selectedEmployee.name}
              description={selectedEmployee.description}
            >
              <View style={styles.customMarker}>
                <Image
                  source={typeof selectedEmployee.pic === "string" ? { uri: selectedEmployee.pic } : selectedEmployee.pic}
                  style={styles.markerImage}
                />
                <View style={styles.markerPointer} />
              </View>
            </Marker>
          )}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {errorMsg || "Fetching your location..."}
          </Text>
          {errorMsg && (
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    marginTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: Platform.OS === "ios" ? 60 : 70,
    marginBottom: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 35,
    fontFamily: "PlusSB",
    marginTop: -89,
  },
  headerSubTitle: {
    fontSize: 30,
    fontFamily: "PlusSB",
    color: "#5aaf57",
    marginTop: -5,
  },
  headerDesc: {
    fontSize: 12,
    fontFamily: "PlusR",
    marginTop: 5,
  },
  lottie: {
    width: 80,
    height: 50,
    transform: [{ scale: 2.3 }],
    bottom: 15,
    top: -60,
    marginRight: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    marginHorizontal: 15,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    shadowColor: "#32cd32",
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginTop: -20,
  },
  searchBar: {
    flex: 1,
    height: 40,
    fontSize: 14,
    fontFamily: "PlusR",
    fontWeight: "600",
    color: "#333",
    paddingLeft: 8,
  },
  searchIcon: {
    marginRight: 5,
  },
  clearIcon: {
    marginRight: 5,
  },
  dropdownIcon: {
    padding: 5,
  },
  dropdown: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 10,
    maxHeight: 150,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginTop: -5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: "PlusR",
    color: "#333",
  },
  emptyDropdown: {
    padding: 10,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#757575",
    fontFamily: "PlusR",
  },
  map: {
    width: width,
    height: height * 0.65,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#aaa",
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: "row",
    backgroundColor: "#5aaf57",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
  customMarker: {
    alignItems: "center",
    
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  markerPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
    marginTop: -1,
  },
});

export default Geolocation;