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
  RefreshControl,
} from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllJuniorRequestedLeaves, getLeaveById } from "../../../../services/api";
import { useUser } from '../../../../context/UserContext';
import { useNavigation } from 'expo-router';

const screenHeight = Dimensions.get("window").height;

const getStatusColor = (status = "") => {
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
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeaves();
    setRefreshing(false);
  };

  const fetchLeaves = async () => {
    setLoading(true);
    const employeeId = user.id;
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

  useEffect(() => {
    fetchLeaves();
  }, []);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity 
    style={styles.card}
    // onPress={() => router.push({ pathname: "/(drawer)/HR/Leaves/LeaveDetails", params: { leaveId: item.id } })}

    // >

onPress={async () => {
      if (item.status.toLowerCase() === "approved") {
        alert("This leave is already approved.");
        return;
      }

      // Proceed to LeaveDetails screen for other statuses
      router.push({ pathname: "/(drawer)/HR/Leaves/LeaveDetails", params: { leaveId: item.id } });
    }}
  >

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
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Manage</Text>
          <Text style={styles.headerSubTitle}>Leaves</Text>
          <Text style={styles.headerDesc}>View all the pending leaves here!</Text>
        </View>
        <LottieView
          source={require("../../../../assets/svg/EMP.json")}
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
    bottom:30,
  },
  headerTitle: {
    fontSize: 35,
    fontFamily: "PlusSB",
    marginTop: -40,
    
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
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
});

export default ManageLeaves;