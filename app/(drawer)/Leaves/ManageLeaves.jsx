import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllJuniorRequestedLeaves } from "../../../services/api";
import { useUser } from '../../../context/UserContext';

const screenHeight = Dimensions.get("window").height;


const getStatusColor = (status = "") => {
  // Convert status to string and handle null/undefined
  const safeStatus = status ? String(status).toLowerCase() : "";
  
  switch (safeStatus) {
    case "approved":
      return "#4CAF50";
    case "send to higher authority":
      return "#FF9800";
    case "initiated":
      return "#2196F3";
    case "rejected request":
      return "#F44336";
    default:
      return "#757575";
  }
};

const ManageLeaves = () => {

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const router = useRouter();




  const{user}=useUser();


  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      const employeeId =user.id;
      console.log("Fetched employeeId:", employeeId);
      const data = await getAllJuniorRequestedLeaves(employeeId);


      const mappedData = (data || []).map(item => ({
        id: item.id,
        date: item["Leave Requested Date"],
        initiatedBy: item["Initiated By"], 
        fromDate: item["From"],
        toDate: item["To"],
        status: item["Status"],
        leaveAt: item["Leave Currently At"],
      }));
      console.log("API Response:", data);
      setLeaves(mappedData || []);
      setLoading(false);
    };

    fetchLeaves();
  }, []);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity 
    style={styles.card}
    onPress={() => router.push({ pathname: "/(drawer)/Leaves/LeaveDetails", params: { leaveId: item.id } })}

    >
    {/* <TouchableOpacity style={styles.card}> */}
      <View style={styles.cardRow}>
        <Text style={styles.serial}>#{index + 1}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={styles.info}>
        <Text style={styles.label}>Initiated By:</Text> {item.initiatedBy}
      </Text>
      <Text style={styles.info}>
        <Text style={styles.label}>Leave Currently At:</Text> {item.leaveAt}
      </Text>
      <Text style={styles.info}>
        <Text style={styles.label}>Leave From:</Text> {item.fromDate}
      </Text>
      <Text style={styles.info}>
        <Text style={styles.label}>To:</Text> {item.toDate}
      </Text>
      <Text
        style={[
          styles.status,
          { color: getStatusColor(item.status), borderColor: getStatusColor(item.status) },
        ]}
      >
        {item.status}
      </Text>
      
      {/* <TouchableOpacity
  
        style={styles.manageButton}
        // onPress={() => router.push('/(drawer)/Leaves/LeaveDetails')}
      >
        <Ionicons name="settings-outline" size={20} color="#5aaf57" />
        <Text style={styles.manageText}>Manage</Text>
      </TouchableOpacity> */}

    
    </TouchableOpacity>

);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Manage</Text>
          <Text style={styles.headerSubTitle}>Leaves</Text>
          <Text style={styles.headerDesc}>View all the pending leaves here!</Text>  
        </View>
        <LottieView
          source={require("../../../assets/svg/EMP.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      <FlatList
        data={leaves}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
    backgroundColor: "#fff",

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
    marginTop: -7,
  },
  headerDesc: {
    fontSize: 12,
    fontFamily: "PlusR",
    marginTop: 14,
  },
  lottie: {
    width: 90,
    height: 70,
    transform: [{ scale: 2 }],
    bottom: 15,
    top: -45,
    marginRight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    height: 200,
    padding: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#32cd32",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serial: {
    fontSize: 16,
    fontFamily: "PlusR",
   
    color: "#444",
  },
  date: {
    fontSize: 14,
    fontFamily: "PlusR",
    color: "#777",
  },
  info: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: "PlusR",
    color: "#333",
  },
  label: {
    fontSize: 14,
    fontFamily: "PlusSB",
    color: "#000",
  },
  status: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: "PlusSB",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
    textTransform: "capitalize",
  },
  // manageButton: {
  //   marginTop: 10,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   alignSelf: "flex-end",
  //   paddingHorizontal: 10,
  //   paddingVertical: 5,
  //   borderRadius: 8,
  //   backgroundColor: "#e6f4ea",
  //   top: -40,
   
  //   },
  // manageText: {
  //   marginLeft: 6,
  //   color: "#5aaf57",
  //   fontFamily: "PlusR",

  //   fontSize: 14,
  // },
});

export default ManageLeaves;
