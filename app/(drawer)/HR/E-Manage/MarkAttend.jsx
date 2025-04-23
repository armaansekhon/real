import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import EmployeeList from '../../../../components/EmployeeList';
import AttendanceCalendar from '../../../../components/AttendanceCalendar';
import { useNavigation } from 'expo-router';
import MarkToday from '../../../../components/MarkToday';
const MarkAttend = ({ navigation }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
 const Navigation=useNavigation();
 const [showMarkToday, setShowMarkToday] = useState(false);

 const handleMarkTodayToggle = () => {
    setSelectedEmployee(null); // Reset calendar if open
    setShowMarkToday((prev) => !prev); // Toggle MarkToday view
  };
  return (
    <SafeAreaView style={styles.container}>
    {showMarkToday ? (
      <MarkToday onBack={() => setShowMarkToday(false)} />
    ) : !selectedEmployee ? (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => Navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMarkTodayToggle}>
              <Text style={styles.markTodayBtn}>
                Mark Today
              </Text>
            </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.textBox}>
              <Text style={styles.title}>
                Employee <Text style={styles.greenText}>Attendance</Text>
              </Text>
              <Text style={styles.subtitle}>
                Select the employee for marking the attendance
              </Text>
            </View>
            <LottieView
              source={require('../../../../assets/svg/reales2.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
           
          </View>
        </View>
        <EmployeeList onSelectEmployee={setSelectedEmployee} />
      </>
    ) : (
      <AttendanceCalendar
        employee={selectedEmployee}
        onBack={() => setSelectedEmployee(null)}
      />
    )}
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    // borderBottomWidth:0.5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 33,
    // fontWeight: 'bold',
    fontFamily:"PlusSB"
    // paddingRight:30,
  },
  greenText: {
    color: '#5aaf57',
  },
  subtitle: {
    fontSize: 12,
    color: '#555',
    marginTop: 10,
   
  },
  lottie: {
    width: 60,
    height: 60,
    transform:[{scale:2}],
    bottom:15,
    marginRight:20,
  },
  markTodayBtn: {
    
    color: '#000',
    alignSelf:"flex-end",
    bottom:20
    

    
  },
});

export default MarkAttend;
