import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  TextInput,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import LottieView from "lottie-react-native";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { Dimensions } from "react-native";

import { getAllActiveOrInactiveEmployees, getAllEmployees, getAllEmployeesbyId } from "../../../../services/api";

const screenHeight = Dimensions.get("window").height;

const ExistingEmployees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);

  const [employees, setEmployees] = useState([]);
  // const [employeeDetails, setEmployeeDetails] = useState([]);

  const Router = useRouter();

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getAllActiveOrInactiveEmployees();

      const employeesWithPhotos = data.map((emp) => ({
        id: emp.id.toString(),
        usercode: emp.usercode,
        name: emp.name,
        department: emp.designation?.department?.department || "N/A",
        email: emp.officialEmail || "N/A",
        phone: emp.officialContact || "N/A",
        gender: emp.gender,
        age: emp.age,
        category: emp.category?.category,
        designation: emp.designation?.name || "N/A",
        employeeType: emp.employeeType?.employeeType || "N/A",
        employeeId: emp.employeeType?.id || "N/A",
        pincode: emp.employeeAddress?.id || "N/A",
        pic:
          emp.employeePic || "https://randomuser.me/api/portraits/lego/1.jpg",
        // photo:
        //   emp.gender === "male"
        //     ? "https://randomuser.me/api/portraits/men/1.jpg"
        //     : emp.gender === "female"
        //     ? "https://randomuser.me/api/portraits/women/1.jpg"
        //     : "https://randomuser.me/api/portraits/lego/1.jpg",
      }));
      setEmployees(employeesWithPhotos);
    };
    fetchEmployees();
  }, []);

  // Fetch detailed employee info for modal
  const onSelectEmployeeDetails = async (item) => {
    try {
      const emp = await getAllEmployeesbyId(item.id); // Make sure this endpoint accepts ID

      const detailedEmployee = {
        ...item,
        email: emp.email || item.email || "N/A",
        phone: emp.contact || item.phone || "N/A",
        activityStatus: emp.activityStatus || item.activityStatus || "N/A",
        gender: emp.gender || item.gender || "N/A",
        age: emp.age || "N/A",
        category: emp.category || item.category || "N/A",
        department: emp.department || item.department || "N/A",
        designation: emp.designation || item.designation || "N/A",
        employeeType: emp.employeeType || item.employeeType || "N/A",
        employeeId: emp.employeeTypeId || item.employeeId || "N/A",
        address: emp.employeeAddress?.[0]?.address1 || "N/A",
        pincode: emp.employeeAddress?.[0]?.pincode || "N/A",
        spouseName: emp.employeeSpouses?.[0]?.name || "N/A",
        childName: emp.employeeChilds?.[0]?.name || "N/A",
        education: emp.employeeEducations?.[0]?.classsName || "N/A",
        experience: emp.employeeExperiences?.[0]?.position || "N/A",
        pic:
          emp.employeePic && emp.employeePic.length < 1000
            ? `data:${emp.employeeDocuments?.[0]?.documentType};base64,${emp.employeePic}`
            : item.pic,
      };

      setSelectedEmployee(detailedEmployee);
      setEmployeeModalVisible(true);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const handleSearch = () => {
    console.log("Search query:", searchQuery);
  };

  const handleEmployeePress = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeModalVisible(true);
  };

  const onSelectEmployee = (item) => {
    setSelectedEmployee(item);
    setEmployeeModalVisible(true);
  };

  const renderEmployee = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleEmployeePress(item)}
    >
      {/* <Image source={{ uri:item.pic }} style={styles.avatar} /> */}
      <Image
        source={{ uri: `data:image/jpeg;base64, ${item.pic}` }}
        style={styles.avatar}
      />
      <View style={styles.cardText}>
        <Text style={styles.empName}>{item.name}</Text>
        <Text style={styles.empDept}>{item.department}</Text>
        <TouchableOpacity style={styles.iconContainer}>
          {/* <Ionicons
            style={styles.icon}
            name="pencil-outline"
            size={25}
            color="black"
            onPress={() => {
              console.log("Navigating to Login");
              Router.push("/(drawer)/HR/E-Manage/AddEmp");
            }}

          /> */}

          <Feather
            name="search"
            size={20}
            color="#5aaf57"
            style={styles.searchIcon}
          />

          {/* <Text style={styles.updateBtnText}>Update Details</Text> */}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  const Navigation = useNavigation();

  return (
    <>
   <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => Navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Existing</Text>
          <Text style={styles.headerSubTitle}>Employees</Text>
          <Text style={styles.headerDesc}>
            Search for the employee in the Search Bar!
          </Text>
        </View>

        <LottieView
          source={require("../../../../assets/svg/EMP.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="#5aaf57"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Search by name, department..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            handleSearch();
          }}
        />
        {searchQuery?.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <AntDesign name="closecircle" size={18} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      {/* <ViewUpEmpList onSelectedEmployee={setSelectedEmployee} /> */}

      {/* Employee List */}
      <FlatList
        data={employees.filter((e) => {
          const lowerCaseSearchQuery = searchQuery?.toLowerCase() || ""; // Ensure searchQuery is a string
          const lowerCaseName = e.name?.toLowerCase() || ""; // Ensure name is a string
          const lowerCaseDepartment = e.department?.toLowerCase() || ""; // Ensure department is a string

          return (
            lowerCaseName.includes(lowerCaseSearchQuery) ||
            lowerCaseDepartment.includes(lowerCaseSearchQuery)
          );
        })}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => onSelectEmployeeDetails(item)}

            // onPress={() => Router.push({ pathname: "/(drawer)/HR/E-Manage/ViewEmp", params: { id: item.id } })}
          >
            <Text style={styles.index}>{index + 1}</Text>

            {/* <Text style={styles.id}>{item.usercode}</Text> */}

            <View style={styles.imageWrapper}>
              {/* <Image source={{ uri: `data:image/jpeg;base64, ${item.pic}` }} style={styles.avatar} /> */}
              <Image
                source={
                  item.pic
                    ? { uri: `data:image/jpeg;base64, ${item.pic}` }
                    : { uri: "https://randomuser.me/api/portraits/lego/1.jpg" }
                }
                style={styles.avatar}
              />
            </View>

            <View style={styles.nameDeptWrapper}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.department} numberOfLines={1}>
                {item.department}
              </Text>
            </View>
           
            <Feather
              name="edit"
              size={20}
              color="#5aaf57"
              style={styles.icon}
              onPress={() => {
                Router.push({
                  pathname: "/(drawer)/HR/E-Status/UpdateEmployeeStatus",
                  // params: { id: item.id }
                  params: { id: item.id, isEdit: true },
                });
              }}
            />
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={employeeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEmployeeModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setEmployeeModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.modalContainer]}>
                {/* Static Top Content */}
                <View style={styles.headerSection}>
                  <Image
                    source={{
                      uri: `data:image/jpeg;base64,${selectedEmployee?.pic}`,
                    }}
                    style={styles.modalAvatar}
                  />
                  <Text style={styles.modalName}>{selectedEmployee?.name}</Text>
                  <Text style={styles.modalInfo}>
                    Usercode: {selectedEmployee?.usercode}
                  </Text>
                </View>

                {/* Scrollable Middle Section */}
                <FlatList
                  data={[
                    {
                      label: "Department",
                      value: selectedEmployee?.department,
                    },
                    {
                      label: "Designation",
                      value: selectedEmployee?.designation,
                    },
                    {
                      label: "Employee Status",
                      value: selectedEmployee?.activityStatus,
                    },
                    {
                      label: "Employee Type",
                      value: selectedEmployee?.employeeType,
                    },
                    { label: "Email", value: selectedEmployee?.email },
                    { label: "Phone", value: selectedEmployee?.phone },
                    { label: "Gender", value: selectedEmployee?.gender },
                    { label: "Category", value: selectedEmployee?.category },
                    { label: "Age", value: selectedEmployee?.age },
                    { label: "Spouse", value: selectedEmployee?.spouseName },
                    { label: "Child", value: selectedEmployee?.childName },
                    { label: "Education", value: selectedEmployee?.education },
                    {
                      label: "Experience",
                      value: selectedEmployee?.experience,
                    },
                    { label: "Address", value: selectedEmployee?.address },
                    { label: "Pincode", value: selectedEmployee?.pincode },
                  ]}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={styles.scrollContainer}
                  showsVerticalScrollIndicator={true}
                  renderItem={({ item }) => (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>{item.label}:</Text>
                      <Text style={styles.infoValue}>
                        {item.value || "N/A"}
                      </Text>
                    </View>
                  )}
                  style={styles.flatListContainer}
                />

                {/* Static Bottom Content */}
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setEmployeeModalVisible(false)}
                >
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 30,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    // elevation: 4,
    zIndex: 10,
    marginTop: -10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: Platform.OS === "ios" ? 90 : 70,
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
    transform: [{ scale: 2 }],
    bottom: 15,
    top: -45,
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

  iconContainer: {
    width: 45,
    alignItems: "center",
    marginTop: 10,
  },
  icon: {
    marginLeft: "auto",
    paddingLeft: 10,
    marginTop: -10,
  },

  //new

  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 13,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  nameDeptWrapper: {
    flex: 1,
    alignItems: "center",
  },

  id: {
    width: 5,
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    flex: 1,
  },
  index: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    // flex: 1,
  },
  imageWrapper: {
    flex: 1,
    alignItems: "center",
  },
  name: {
    width: 200,
    fontSize: 16,
    color: "#111",
    fontFamily: "PlusR",
    textAlign: "center",
    marginRight: 92,
  },
  department: {
    width: 52,
    fontSize: 11,
    color: "#5aaf57",
    fontFamily: "PlusR",
    textAlign: "center",
    marginRight: 92,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 30,
  },

  //new modal styles

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    height: "70%", // fixed modal height
    backgroundColor: "white",
    borderRadius: 30,
    padding: 16,
    justifyContent: "space-between",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 8,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  modalName: {
    fontSize: 18,
    fontFamily: "PlusSB",
    marginBottom: 4,
  },
  modalInfo: {
    fontSize: 14,
    fontFamily: "PlusR",
    color: "#555",
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  flatListContainer: {
    maxHeight: "60%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
    paddingHorizontal: 6,
  },
  infoLabel: {
    fontFamily: "PlusR",
    fontSize: 14,
    color: "#444",
    fontWeight: "600",
    width: "50%",
  },
  infoValue: {
    fontFamily: "PlusR",
    fontSize: 14,
    color: "#666",
    width: "50%",
    textAlign: "right",
  },
  closeBtn: {
    alignSelf: "center",
    backgroundColor: "#5aaf57",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 8,
  },
  closeBtnText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "PlusR",
  },
});

export default ExistingEmployees;