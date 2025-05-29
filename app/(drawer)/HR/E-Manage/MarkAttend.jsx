import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import EmployeeList from '../../../../components/EmployeeList';
import AttendanceCalendar from '../../../../components/AttendanceCalendar';
import { useNavigation } from 'expo-router';
import MarkToday from '../../../../components/MarkToday';

const MarkAttend = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showMarkToday, setShowMarkToday] = useState(false);
  const lottieRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    lottieRef.current?.play(0, 260);
  }, []);

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
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={28} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMarkTodayToggle}>
              <Text style={styles.markTodayBtn}>Mark Today</Text>
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <View style={styles.textBox}>
                <Text style={styles.title}>
                  Employee <Text style={styles.greenText}>Attendance</Text>
                </Text>
                <Text style={styles.subtitle}>
                  Select the Date to view the attendance, employee to see the attendance in detail
                </Text>
              </View>
              <LottieView
                ref={lottieRef}
                source={require('../../../../assets/svg/atten.json')}
                autoPlay={false}
                loop={false}
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
    marginTop: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 33,
    fontFamily: 'PlusSB',
    marginTop: -25,
  },
  greenText: {
    color: '#5aaf57',
  },
  subtitle: {
    fontSize: 14,
    color: '#111',
    marginTop: 10,
    fontFamily: 'PlusR',
  },
  lottie: {
    width: 50,
    height: 50,
    transform: [{ scale: 1.5 }],
    bottom: 12,
    marginRight: 40,
  },
  markTodayBtn: {
    color: '#5aaf57',
    alignSelf: 'flex-end',
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: '#5aaf57',
    padding: 10,
    fontFamily: 'PlusSB',
    bottom: 28,
  },
});

export default MarkAttend;
