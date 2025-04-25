import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import usePostAttendance from '../hooks/usePostAttendence';
import useFetchAttendance from '../hooks/useFetchAttendance';

const { width, height } = Dimensions.get('window');

const AttendanceCard = () => {
  const [clock, setClock] = useState('');
  const [date, setDate] = useState('');
  const [clickedIn, setClickedIn] = useState(false);
  const [clickInTime, setClickInTime] = useState(null);
  const [clickOutTime, setClickOutTime] = useState(null);
  const [hoursWorked, setHoursWorked] = useState('');
  const animationRef = useRef(null);

  const { postAttendance } = usePostAttendance();
  const { attendance, loading, error, refetch } = useFetchAttendance();

  useEffect(() => {
    const interval = setInterval(() => {
      setClock(moment().format('hh:mm A'));
      setDate(moment().format('dddd, MMMM Do YYYY'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (attendance) {
      if (attendance.checkIn) {
        setClickInTime(attendance.checkIn);
        setClickedIn(true);
        animationRef.current?.play(0, 30);
      }
      if (attendance.checkOut) {
        setClickOutTime(attendance.checkOut);
        setClickedIn(false);
        animationRef.current?.play(60, 0);
      }
      if (attendance.workedHoursAndMins) {
        setHoursWorked(attendance.workedHoursAndMins);
      }
      animationRef.current?.play(10, 0);
    }
  }, [attendance]);
  

  const handleClick = async () => {
    if (clickedIn) {
      Alert.alert(
        'Confirm Click Out',
        'Are you sure you want to Click Out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, Click Out',
            onPress: async () => await proceedWithAttendance(),
          },
        ],
        { cancelable: true }
      );
    } else {
      await proceedWithAttendance();
    }
  };

  const proceedWithAttendance = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
  
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
  
    await postAttendance({ latitude, longitude });
  
    // Don't manually set clickIn/out or hoursWorked here!
    // Let refetch do its job after backend returns latest status
    await refetch(); 
  };
  

  const isButtonDisabled = !!clickOutTime;

  return (
    <View style={styles.card}>
      <Text style={styles.clock}>{clock}</Text>
      <Text style={styles.date}>{date}</Text>

      <TouchableOpacity
        onPress={handleClick}
        style={styles.button}
        disabled={isButtonDisabled}
      >
        <LottieView
          ref={animationRef}
          source={require('../assets/svg/clickin.json')}
          autoPlay={false}
          loop={false}
          style={styles.lottie}
        />
        <Text style={[styles.clickText, isButtonDisabled && { color: '#999' }]}>
          {isButtonDisabled
            ? attendance?.message || 'Attendance Completed'
            : clickedIn
            ? 'Click Out'
            : 'Click In'}
        </Text>
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>In:</Text>
          <Text style={styles.footerValue}>
            {clickInTime ? clickInTime : '--'}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Out:</Text>
          <Text style={styles.footerValue}>
            {clickOutTime ? clickOutTime : '--'}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Hours:</Text>
          <Text style={styles.footerValue}>
            {hoursWorked ? hoursWorked : '--'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width - 70,
    height: height / 2.8,
    marginHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#5aaf57',
    shadowOffset: { width: 1, height: 9 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    marginTop: 10,
  },
  clock: {
    fontSize: 26,
    fontFamily: 'PlusSB',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    fontFamily: 'PlusR',
    color: '#444',
    marginBottom: 10,
  },
  button: {
    alignItems: 'center',
    marginBottom: 12,
  },
  lottie: {
    width: 100,
    height: 100,
  },
  clickText: {
    fontSize: 22,
    fontFamily: 'PlusSB',
    color: '#5aaf57',
    marginTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 6,
    marginTop: 8,
  },
  footerItem: {
    alignItems: 'center',
    flex: 1,
  },
  footerLabel: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'PlusR',
  },
  footerValue: {
    fontSize: 16,
    fontFamily: 'PlusSB',
    color: '#222',
    marginTop: 4,
  },
});

export default AttendanceCard;
