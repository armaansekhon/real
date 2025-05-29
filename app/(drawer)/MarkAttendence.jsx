import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import useMonthlyAttendance from '../../hooks/useMonthlyAttendance';
import fetchMonthlyAttendance from '../../hooks/fetchMonthlyAtendance';
const screenWidth = Dimensions.get('window').width;

const AttendanceCalendarEmployee = ({ onBack }) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [employeeId, setEmployeeId] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  const navigation = useNavigation();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchEmployeeId = async () => {
      const id = await SecureStore.getItemAsync('userid');
      console.log('Fetched Employee ID:', id);
      setEmployeeId(id);
    };
    fetchEmployeeId();
  }, []);


  

  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    shortLeave: 0,
    halfLeave: 0,
  });

 
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowLoader(false), 1700);
      return () => clearTimeout(timer);
    }
  }, [month, year, loading]);

  useEffect(() => {
    const counts = { present: 0, absent: 0, shortLeave: 0, halfLeave: 0 };

    attendanceData.forEach((item) => {
      const notation = item?.notation?.trim()?.toLowerCase();
      switch (notation) {
        case '#62b83d':
          counts.present++;
          break;
        case '#ea3434':
          counts.absent++;
          break;
        case '#fcf5a6':
          counts.shortLeave++;
          break;
        case '#7adeff':
          counts.halfLeave++;
          break;
        default:
          console.log('Unrecognized color:', notation);
      }
    });

    setSummary(counts);
  }, [attendanceData]);

  const markedDates = (attendanceData || []).reduce((acc, item) => {
    if (item.date && item.notation) {
      const dateKey = moment(item.date).format('YYYY-MM-DD');
      acc[dateKey] = {
        customStyles: {
          container: {
            backgroundColor: item.notation,
            borderRadius: 6,
          },
          text: {
            color: 'black',
            fontWeight: 'bold',
          },
        },
      };
    }
    return acc;
  }, {});



  const handleMonthChange = (date) => {
    setShowLoader(true);
    setMonth(parseInt(date.month));
    setYear(parseInt(date.year));
  };
  // const { attendanceData, loading } = useMonthlyAttendance(employeeId, month, year);
  


  useEffect(() => {
    const fetchData = async () => {
      if (!employeeId) return;
  
      setLoading(true);
      const data = await fetchMonthlyAttendance(employeeId, month, year);
      setAttendanceData(data);
      setLoading(false);
    };
  
    fetchData();
  }, [employeeId, month, year]);

  return (
  
    <ScrollView style={styles.container}>
      <TouchableOpacity  onPress={() => navigation.openDrawer()}>
        <Ionicons style={styles.menu} name="menu" size={26} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>My Attendance</Text>

      {loading || showLoader ? (
        <LottieView
          source={require('../../assets/svg/loader.json')}
          autoPlay
          loop
          speed={1.8}
          style={{
            width: 300,
            height: 300,
            transform: [{ scale: 2 }],
            alignSelf: 'center',
            marginTop: 40,
          }}
        />
      ) : (
        <>
          <Calendar
            markingType={'custom'}
            markedDates={markedDates}
            current={moment({ year, month: month - 1 }).format('YYYY-MM-DD')}
            onMonthChange={handleMonthChange}
            style={styles.calendar}
            theme={{
              arrowColor: '#5aaf57',
              monthTextColor: '#5aaf57',
              textSectionTitleColor: '#8e8e93',
              dayTextColor: '#333',
              todayTextColor: '#5aaf57',
            }}
          />

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Details</Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryItem, { color: '#62883d' }]}>
                Present: {summary.present}
              </Text>
              <Text style={[styles.summaryItem, { color: '#ea3434' }]}>
                Absent: {summary.absent}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryItem, { color: '#C8A951' }]}>
                Short Leave: {summary.shortLeave}
              </Text>
              <Text style={[styles.summaryItem, { color: '#7adeff' }]}>
                Half Leave: {summary.halfLeave}
              </Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: {
    fontSize: 32,
    fontFamily: 'PlusSB',
    marginTop:10,
    marginBottom: 7,
    color: '#5aaf57',
  },
  calendar: {
    borderTopWidth: 1,
    paddingTop: 10,
    borderColor: '#eee',
    width: screenWidth - 40,
    alignSelf: 'center',
  },
  summaryContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 22,
    fontFamily: 'PlusR',
    marginBottom: 10,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryItem: {
    fontSize: 16,
    fontFamily: 'PlusR',
  },
  menu: {
   marginTop:10,
  },
});

export default AttendanceCalendarEmployee;
