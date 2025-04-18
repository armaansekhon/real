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

import { Dimensions } from "react-native";
// import {getDynamicWidth}


const { height } = Dimensions.get("window");

export default function EmployeeDetailsForm({ initialData, onNext }) {
  const [data, setData] = useState(initialData || {});
  const [imageUri, setImageUri] = useState(null);
  const [showSave, setShowSave] = useState(false);




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
      const uri = result.assets[0].uri;
      setData({ ...data, profileImage: uri }); // Save in data
      setShowSave(true);
    }
  };
  

  const groupedFields = [
    [
    { key: "department", placeholder: "Department" },
    { key: "designation", placeholder: "Designation" },
    ],
    [{ key: "employeeType", placeholder: "Employee Type" },
    { key: "employeeCategory", placeholder: "Employee Category" },
    ],
    [
    { key: "technology", placeholder: "Technology" },
    { key: "name", placeholder: "Name" },
    { key: "joiningDate", placeholder: "Joining Date" },
    ],
    [
    { key: "fatherName", placeholder: "Father Name" },
    { key: "motherName", placeholder: "Mother Name" },
    ],
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {/* Header Row with Avatar */}
<View style={styles.headerRow}>
  <View style={styles.headerTextContainer}>
    <Text style={styles.headerTitle}>Employee</Text>
    <Text style={styles.headerSubTitle}>Details</Text>
    <Text style={styles.headerDesc}>Fill out the Employee Details below</Text>
  </View>

  <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
    {data.profileImage ? (
      <Image source={{ uri: data.profileImage }} style={styles.avatar} />
    ) : (
      <View style={[styles.avatar, styles.placeholder]}>
        <Ionicons name="person-circle-outline" size={60} color="#ccc" />
      </View>
    )}
  </TouchableOpacity>
</View>


  {showSave && (
    <TouchableOpacity style={styles.saveIconButton} onPress={() => alert("Image saved locally!")}>
      <Ionicons name="save-outline" size={24} color="#fff" />
    </TouchableOpacity>
  )}
        {/* FlatList with 2 columns
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
        /> */}


<View style={styles.flexGrid}>
  {groupedFields.map((row, rowIndex) => (
    <View key={rowIndex} style={styles.rowContainer}>
      {row.map((item) => (
        <View key={item.key} style={[styles.inputWrapper, { flex: 1 }]}>
          <Text style={styles.label}>{item.placeholder}</Text>
          <TextInput
            style={styles.input}
            placeholder={item.placeholder}
            value={data[item.key] || ""}
            onChangeText={(text) =>
              setData({ ...data, [item.key]: text })
            }
          />
        </View>
      ))}
    </View>
  ))}
</View>



        {/* Next button replaced with icon */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => onNext(data)}
        >
          <Ionicons name="arrow-forward-circle" size={50} color="#4CAF50" />
        </TouchableOpacity>
      {/* </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  nextButton: {
    alignItems: "center",
    marginTop: 20,
  },




  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },

    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    
    headerTextContainer: {
      flex: 1,
    },
    
    avatarContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 10,
    },
    
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 70,
      resizeMode: "cover",
    },
    
    placeholder: {
      backgroundColor: "#eee",
      alignItems: "center",
      justifyContent: "center",
    },
    
    headerTitle: {
      fontSize: 30,
      fontFamily: "PlusSB",
    },
    
    headerSubTitle: {
      fontSize: 25,
      fontFamily: "PlusSB",
      color: "#5aaf57",
      marginTop: -5,
    },
    
    headerDesc: {
      fontSize: 10,
      fontFamily: "PlusR",
      marginTop: 3,
    },


    flexGrid: {
      flexDirection: "column",
      gap: 16,
    },
    
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 4,
    },
    
    inputWrapper: {
      marginBottom: 3,
    },
    
    input: {
      height: 30,
      backgroundColor: "#f9f9f9",
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 10,
      borderColor: "#ddd",
      borderWidth: 1,
    },
    
    label: {
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 6,
      color: "#333",
    },
    
    
});

