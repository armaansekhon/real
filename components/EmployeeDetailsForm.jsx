import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function EmployeeDetailsForm({ initialData, onNext }) {
  const [data, setData] = useState(initialData || {});
  const [imageUri, setImageUri] = useState(null);

  const fields = [
    { key: "department", placeholder: "Department" },
    { key: "designation", placeholder: "Designation" },
    { key: "employeeType", placeholder: "Employee Type" },
    { key: "employeeCategory", placeholder: "Employee Category" },
    { key: "technology", placeholder: "Technology" },
    { key: "name", placeholder: "Name" },
    { key: "joiningDate", placeholder: "Joining Date" },
    { key: "fatherName", placeholder: "Father Name" },
    { key: "motherName", placeholder: "Mother Name" },
  ];

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Ionicons name="chevron-back" size={24} color="black" />
        <Text style={styles.headerTitle}>Add Employee</Text>
        <Ionicons name="checkmark" size={24} color="green" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Image */}
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require("../assets/images/favicon.png")
            }
            style={styles.avatar}
          />
          <View style={styles.editIcon}>
            <Ionicons name="camera" size={11} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* FlatList with 2 columns */}
        <FlatList
          data={fields}
          numColumns={2}
          keyExtractor={(item) => item.key}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>{item.placeholder}</Text>
              <TextInput
                style={styles.input}
                value={data[item.key] || ""}
                placeholder={item.placeholder}
                onChangeText={(text) => setData({ ...data, [item.key]: text })}
              />
            </View>
          )}
        />

        {/* Next button replaced with icon */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => onNext(data)}
        >
          <Ionicons name="arrow-forward-circle" size={50} color="#4CAF50" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 25,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: "#4CAF50",
    padding: 6,
    borderRadius: 20,
  },
  inputWrapper: {
    flex: 1,
    marginBottom: 16,
    marginHorizontal: 8,
  },
  input: {
    height: 40,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  nextButton: {
    alignItems: "center",
    marginTop: 20,
  },
});
