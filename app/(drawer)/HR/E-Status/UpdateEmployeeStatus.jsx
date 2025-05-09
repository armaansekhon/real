import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import {
  Appbar,
  Avatar,
  Text,
  Button,
  Card,
  useTheme,
  DataTable,
  Portal,
  Provider as PaperProvider,
  TextInput,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUser } from '../../../../context/UserContext';
import Toast from 'react-native-root-toast';

import { Ionicons } from "@expo/vector-icons";
const UpdateEmployeeStatus = () => {
  
  const API_BASE_URL = 'http://192.168.6.210:8686/pipl/api/v1';

  const [data, setData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisiblePic, setModalVisiblePic] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const  {user}=useUser();

  const inserteDate =date;
  const reasonOfTermination=reason;
  const activityStatus=status;


  useEffect(() => {

    console.log("logged in ",user.id);
    if (id) {
      fetchEmployeeData(id);
    }
  }, [id]);

  const fetchEmployeeData = async (employeeId) => {
    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const response = await fetch(
        `${API_BASE_URL}/employee/employeeStatusHistory/employeeId/${employeeId}`,
        {
          method: 'GET',
          headers: {
            secret_key: secretKey,
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch employee data');
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
  };
  // insertedById
  const handleSubmit = async () => {
    if (!status || !reason || !date) {
      alert("Please fill in all required fields.");
      return;
    }
  
    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const response = await fetch(`${API_BASE_URL}/employee/updateEmployeeStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          secret_key: secretKey,
        },
        body: JSON.stringify({
          employeeId: id,
          activityStatus,
          insertedById:user.id,
          reasonOfTermination,
          inserteDate: date.toISOString().split('T')[0], // Format: yyyy-mm-dd
        }),
      }); 
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update status');
      }
  
      alert('Status updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Something went wrong. Please try again.');
    }
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No data available.</Text>
      </View>
    );
  }

  const { employeeDetails, employeeStatusList } = data;

  return (
    <PaperProvider contentContainerStyle= {{backgroundColor: "#fff"}}>
      {/* <Appbar.Header> */}
              {/* Header */}
              <View style={styles.header}>
                {/* <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
                  <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity> */}

                 <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Employee <Text style={{ color: "#5aaf57" }}>Status</Text></Text>
              </View>
       
        {/* <Appbar.Content title="Employee Status" /> */}
      {/* </Appbar.Header> */}
      <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.profileContainer}>
            {employeeDetails?.profilePic ? (
             <TouchableOpacity onPress={() => setModalVisiblePic(true)}>
             <Avatar.Image
               size={80}
               source={{
                 uri: `data:image/*;base64,${employeeDetails.profilePic}`,
               }}
             />
           </TouchableOpacity>
         ) : (
           <Avatar.Icon size={80} icon="account" />
         )}
            <View style={styles.textContainer}>
              <Text variant="titleLarge" style={styles.name}>
                {employeeDetails?.name || 'N/A'}
              </Text>
              <Text variant="bodyMedium" style={styles.designation}>
                {employeeDetails?.designation || 'N/A'}
              </Text>
              <Text variant="bodySmall" style={styles.department}>
                {employeeDetails?.department || 'Department not specified'}
              </Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Employee ID:</Text>
              <Text style={styles.value}>{employeeDetails?.usercode || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{employeeDetails?.email || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{employeeDetails?.contact || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Joining Date:</Text>
              <Text style={styles.value}>
              {employeeDetails?.joiningDate
                ? (() => {
                    const [year, month, day] = employeeDetails?.joiningDate.split('-');
                    return `${day}-${month}-${year}`;
                  })()
                : 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Current Status:</Text>
              <Text style={styles.value}>{employeeDetails?.currentStatus || 'N/A'}</Text>
            </View>
          </View>

          {/* ✅ Moved button inside the Card */}
          <Button
            mode="contained"
            style={[styles.historyButton, { marginTop: 16 }]}
            onPress={() => setModalVisible(true)}
          >
            View Status History
          </Button>
        </Card.Content>
      </Card>

      {employeeDetails?.currentStatus !== 'Terminate' ? (
      <View style={styles.row}> 
          <Text style={styles.label}>Activity Status<Text style={styles.red}> *</Text></Text>
          <View style={styles.radioGroup}>
              {/* Suspend: show if currentStatus is 'Active' or 'DeActivate' */}
              {(employeeDetails?.currentStatus === 'Active' || employeeDetails?.currentStatus === 'DeActivate') && (
                <View style={styles.radioOption}>
                  <RadioButton
                    value="Suspend"
                    status={status === 'Suspend' ? 'checked' : 'unchecked'}
                    onPress={() => setStatus('Suspend')}
                  />
                  <Text>Suspend</Text>
                </View>
              )}

              {/* Terminate: show if currentStatus is 'Suspend', 'Active', or 'DeActivate' */}
              {(employeeDetails?.currentStatus === 'Suspend' ||
                employeeDetails?.currentStatus === 'Active' ||
                employeeDetails?.currentStatus === 'DeActivate') && (
                <View style={styles.radioOption}>
                  <RadioButton
                    value="Terminate"
                    status={status === 'Terminate' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      // Optional confirmTerminate() logic
                      Alert.alert('Confirmation', 'Are you sure you want to terminate?', [
                        { text: 'Cancel' },
                        { text: 'OK', onPress: () => setStatus('Terminate') },
                      ]);
                    }}
                  />
                  <Text>Terminate</Text>
                </View>
              )}

              {/* DeActivate: show only if currentStatus is 'Active' */}
              {employeeDetails?.currentStatus === 'Active' && (
                <View style={styles.radioOption}>
                  <RadioButton
                    value="DeActivate"
                    status={status === 'DeActivate' ? 'checked' : 'unchecked'}
                    onPress={() => setStatus('DeActivate')}
                  />
                  <Text>DeActivate</Text>
                </View>
              )}

              {/* Activate: show if currentStatus is 'Suspend' or 'DeActivate' */}
              {(employeeDetails?.currentStatus === 'Suspend' ||
                employeeDetails?.currentStatus === 'DeActivate') && (
                <View style={styles.radioOption}>
                  <RadioButton
                    value="Active"
                    status={status === 'Active' ? 'checked' : 'unchecked'}
                    onPress={() => setStatus('Active')}
                  />
                  <Text>Activate</Text>
                </View>
              )}
            </View>

          <View style={styles.dateContainer}>
            <Text style={styles.label}>Date of Action<Text style={styles.red}> *</Text></Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
              <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}
          </View>

          <Text style={styles.label}>Reason<Text style={styles.red}> *</Text></Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="Enter reason"
            multiline
            numberOfLines={9}
            style={styles.reasonInput}
          />
          <Button
          mode="contained"
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          Submit
        </Button>
      </View>
      ) : (
        <View style={styles.terminatedBox}>
          <Text style={styles.terminatedText}>
            You can't perform any action after termination.
          </Text>
          <Text style={styles.terminatedSubText}>
            Please contact HR for further assistance.
          </Text>
        </View>
      )}


        {/* Zoomed-in Modal */}
      <Modal
        visible={modalVisiblePic}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        {employeeDetails?.profilePic ? (
        <TouchableOpacity style={styles.modalBackground} onPress={() => setModalVisiblePic(false)}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: `data:image/*;base64,${employeeDetails?.profilePic}`,
              }}
              style={styles.zoomedImage}
            />
          </View>
        </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              Toast.show('No Image', {
                duration: 5000,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
              });
            }}
          >
            <Avatar.Icon size={80} icon="account" />
          </TouchableOpacity>
        )}
      </Modal>

        <Portal>
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Status History</Text>
                <ScrollView style={{ maxHeight: 300 }}>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Date</DataTable.Title>
                    <DataTable.Title>Inserted By</DataTable.Title>
                    <DataTable.Title>Status</DataTable.Title>
                  </DataTable.Header>
                  {employeeStatusList?.map((item, index) => (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>
                      {item.Date
                        ? (() => {
                            const [year, month, day] = item.Date.split('-');
                            return `${day}-${month}-${year}`;
                          })()
                        : 'N/A'}
                    </DataTable.Cell>
                      <DataTable.Cell>{item.InsertedBy}</DataTable.Cell>
                      <DataTable.Cell>{item.ActivityStatus}</DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
              </ScrollView>

                <Button
                  mode="text"
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  Close
                </Button>
              </View>
            </View>
          </Modal>
        </Portal>
      </ScrollView>
    </PaperProvider>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
    padding: 16,
    shadowColor: '#32cd32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "PlusSB",
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
  },  
  container: {
    // marginTop: 30,
    padding: 16,
    backgroundColor: '#fff',
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 1,
    backgroundColor: '#fff',
    shadowColor: "#32cd32",
    elevation: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,    
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontFamily: "PlusSB",
    marginBottom: 4,
  },
  designation: {
    color: '#666',
    marginBottom: 2,
  },
  department: {
    fontSize: 12,
    fontFamily: "PlusR",
    color: '#999',
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },

  value: {
    color: '#666',
  },
  historyButton: {
    color: '#f44336',
    borderRadius:5,
    backgroundColor:'#5aaf57',
  },
  submitButton: {
    color: '#333',
    borderRadius:5,
    backgroundColor:'black',
    marginTop: 20,
  },

  red: {
    color: 'red',
  },
  label: {
    fontSize: 12,
    fontFamily: "PlusSB",
    fontWeight: "600",
    marginBottom: 4,
    color: "#222",
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    marginBottom: 2,
  },
  reasonInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    minHeight: 200,
    backgroundColor: '#fff',
  },
  dateInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    textAlignVertical: 'top',
    minHeight: 5,
    backgroundColor: '#f9f9f9',
  },
  headerTitle: {
    fontSize: 35,
    fontFamily: "PlusSB",
  },
  headerSubTitle: {
    fontSize: 30,
    fontFamily: "PlusSB",
    color: "#5aaf57",
    marginTop: -5,
  },
  topBar: {
    paddingBottom: 10,
  },
  row: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    marginBottom: 16,
    elevation: 3,
  },
  terminatedBox: {
    padding: 16,
    backgroundColor: '#ffe6e6',
    borderColor: '#ff4d4d',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  terminatedText: {
    color: '#cc0000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  terminatedSubText: {
    color: '#990000',
    fontSize: 14,
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    borderRadius: 150,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
  },
  zoomedImage: {
    width: 300,
    height: 300,
    borderRadius: 125,
  },


  header: {
    // position: "absolute",
    width: "100%",
    // height: "10%",

    paddingHorizontal: 22,
    paddingTop: 10,
    // paddingBottom: 20,
    // marginBottom: 30,
    backgroundColor: '#fff',
  },
});
  

export default UpdateEmployeeStatus;