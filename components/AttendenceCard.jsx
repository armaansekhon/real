import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import usePostAttendance from '../hooks/usePostAttendence';
import useFetchAttendance from '../hooks/useFetchAttendance';
import * as SecureStore from 'expo-secure-store';

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

  const loadDate = async () => {
    try {
      const currentDayDate = await SecureStore.getItemAsync('currentDayDate');
      const formattedDate = moment(currentDayDate).format('dddd, MMMM DD, YYYY');
      setDate(formattedDate);
    } catch (e) {
      console.error('Date formatting error:', e);
    }
  };

  useEffect(() => {
    loadDate();
    const interval = setInterval(() => {
      setClock(moment().format('hh:mm A'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (attendance) {
      setClickInTime(attendance.checkIn || null);
      setClickOutTime(attendance.checkOut || null);
      setHoursWorked(attendance.workedHoursAndMins || '');
      const hasCheckIn = !!attendance.checkIn;
      const hasCheckOut = !!attendance.checkOut;

      if (hasCheckOut) {
        // Checked out: grey and disabled (frame 60)
        setClickedIn(false);
        animationRef.current?.play(30, 60);
      } else if (hasCheckIn) {
        // Checked in: blue (frame 30)
        setClickedIn(true);
        animationRef.current?.play(0, 30);
      } else {
        // No attendance: grey (frame 0)
        setClickedIn(false);
        animationRef.current?.reset();
      }
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

    if (!clickedIn) {
      // Clicking in: play grey to blue
      animationRef.current?.play(0, 30);
      setClickedIn(true);
    } else {
      // Clicking out: play blue to grey
      animationRef.current?.play(30, 60);
      setClickedIn(false);
    }

    await postAttendance({ latitude, longitude });
    await refetch();
  };

  const isButtonDisabled = !!clickOutTime;

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#5aaf57" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.card}>
        <Text style={styles.errorText}>Error loading attendance: {error}</Text>
        <TouchableOpacity onPress={refetch} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.mark} > <Text style={styles.mark1}>Mark </Text  > Attendance</Text>
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
        {/* <Text style={[styles.clickText, isButtonDisabled && { color: '#999' }]}>
          {isButtonDisabled
            ? attendance?.message || 'Attendance Completed'
            : clickedIn
            ? 'Click Out'
            : 'Click In'}
        </Text> */}
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
    height: height / 2.4,
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
    justifyContent: 'center',
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
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    fontFamily: 'PlusR',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#5aaf57',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  mark:{
    // alignSelf:"flex-start",
    padding:10,
    color:"#333",
    fontSize:22,
    fontFamily:"PlusSB"
    

  },
   mark1:{
    // alignSelf:"flex-start",
    padding:10,
    color:"#5aaf57",
    fontSize:22,
    fontFamily:"PlusSB"
    

  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusSB',
  },
});

export default AttendanceCard;