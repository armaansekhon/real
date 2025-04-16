import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TextInput, Button, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

const Geolocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchId, setSearchId] = useState(""); // State for search input
  const [mapRef, setMapRef] = useState(null); // Reference to the MapView

  // Predefined locations
  const otherLocations = [
    {
      id: 1,
      latitude: 30.683267,
      longitude: 76.694983,
      title: "Mandeep",
      description: "A beautiful city in California.",
    },
    {
      id: 2,
      latitude: 34.0522,
      longitude: -118.2437,
      title: "Los Angeles",
      description: "The entertainment capital of the world.",
    },
    {
      id: 3,
      latitude: 40.7128,
      longitude: -74.006,
      title: "New York City",
      description: "The city that never sleeps.",
    },
  ];

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get the current location
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  // Function to handle search and redirect the map
  const handleSearch = () => {
    const location = otherLocations.find((loc) => loc.id === parseInt(searchId));
    if (location && mapRef) {
      mapRef.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000 // Animation duration in milliseconds
      );
    } else {
      Alert.alert("Location not found", "No location found with the given ID.");
    }
  };

  return (
    
    
    <View style={styles.container}>
      <Text style={styles.title}>Geolocation</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter location ID"
          keyboardType="numeric"
          value={searchId}
          onChangeText={(text) => setSearchId(text)}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      {location ? (
        <MapView
          ref={(ref) => setMapRef(ref)} // Set the MapView reference
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          {/* Marker for the user's current location */}
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
            description="This is your current location"
          />

          {/* Markers for other predefined locations */}
          {otherLocations.map((loc) => (
            <Marker
              key={loc.id}
              coordinate={{
                latitude: loc.latitude,
                longitude: loc.longitude,
              }}
              title={loc.title}
              description={loc.description}
            />
          ))}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>
          {errorMsg || "Fetching your location..."}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#5aaf57",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  map: {
    width: width - 20,
    height: height * 0.7,
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#aaa",
  },
});

export default Geolocation;