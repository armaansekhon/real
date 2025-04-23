import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import LottieView from 'lottie-react-native';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

const AttendanceCard = () => {
  const [clock, setClock] = useState('');
  const [date, setDate] = useState('');
  const [clickedIn, setClickedIn] = useState(false);
  const [clickTime, setClickTime] = useState(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setClock(moment().format('hh:mm A'));
      setDate(moment().format('dddd, MMMM Do YYYY'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = async () => {
    const timeNow = moment().format('hh:mm:ss');

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    console.log(clickedIn ? 'Clicked Out at:' : 'Clicked In at:', timeNow);
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);

    if (!clickedIn) {
      setClickTime(timeNow);
      setClickedIn(true);
    } else {
      setClickTime(null);
      setClickedIn(false);
    }

    animationRef.current?.play();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.clock}>{clock}</Text>
      <Text style={styles.date}>{date}</Text>

      {clickTime && (
        <Text style={styles.clickTime}>
          {clickedIn ? `Clicked In at: ${clickTime}` : 'Clicked Out'}
        </Text>
      )}

      <TouchableOpacity onPress={handleClick} style={styles.button}>
        <LottieView
          ref={animationRef}
          source={require('../assets/svg/reales.json')} // Make sure this path is correct
          autoPlay={false}
          loop={false}
          style={styles.lottie}
        />
        <Text style={styles.clickText}>
          {clickedIn ? 'Click Out' : 'Click In'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width - 70,
    height: height / 3.4,
    marginHorizontal: 14,
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 16,
    // justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // shadow for Android
    shadowColor: '#5aaf57', // shadow for iOS
    shadowOffset: { width: 1, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginTop:15
,  },
  clock: {
    fontSize: 26,
    // fontWeight: 'bold',
    fontFamily:"PlusSB",
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    fontFamily:"PlusR",
    color: '#444',
    marginBottom: 10,
  },
  clickTime: {
    fontSize: 14,
    color: 'green',
    marginBottom: 8,
  },
  button: {
    alignItems: 'center',
  },
  lottie: {
    width: 100,
    height: 100,
  },
  clickText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default AttendanceCard;
