import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import useMonthlyAttendance from '../hooks/useMonthlyAttendance';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const AttendanceCalendar = ({ employee, onBack }) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [showLoader, setShowLoader] = useState(true);

  const { attendanceData, loading } = useMonthlyAttendance(
    employee.employeeId,
    month,
    year
  );

  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    shortLeave: 0,
    halfLeave: 0,
  });

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 1700);
      return () => clearTimeout(timer);
    }
  }, [month, year, loading]);
  useEffect(() => {
    console.log('Raw attendanceData:', attendanceData);
  }, [attendanceData]);

 useEffect(() => {
  const counts = { present: 0, absent: 0, shortLeave: 0, halfLeave: 0 };

  attendanceData.forEach((item) => {
    const notation = item?.notation?.trim()?.toLowerCase();

    switch (notation) {
      case '#62b83d': // ✅ corrected present color
        counts.present++;
        break;
      case '#ea3434': // absent
        counts.absent++;
        break;
      case '#fcf5a6': // short leave
        counts.shortLeave++;
        break;
      case '#7adeff': // half leave
        counts.halfLeave++;
        break;
      default:
        console.log('Unrecognized color:', notation);
    }
  });

  console.log('Updated summary:', counts);
  setSummary(counts);
}, [attendanceData]);

  

  const markedDates = attendanceData.reduce((acc, item) => {
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

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={onBack}>
      <Ionicons style={styles.backText} name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Attendance for </Text><Text style={styles.name}>{employee.employeeName}</Text>

      {loading || showLoader ? (
        <LottieView
          source={require('../assets/svg/loader.json')}
          autoPlay
          loop
          speed={1.8}
          style={{ width: 300, height: 300, transform:[{scale:2}], alignSelf: 'center', marginTop: 40 }}
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
              'stylesheet.calendar.header': {
                header: {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginTop: 6,
                  alignItems: 'center',
                },
              },
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
  backButton: {
    color: '#5aaf57',
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  name:{
    fontSize: 32, 
    fontFamily:"PlusSB",
    
    marginBottom: 10,
    color:"#5aaf57"
   

  },
  title: { fontSize: 32, 
    fontFamily:"PlusR",
    
    
    marginTop:12,
    marginBottom: 7 },
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
    // fontWeight: '600',
    fontFamily:"PlusR",
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
    // fontWeight: '500',
    fontFamily:"PlusR"
  },
});

export default AttendanceCalendar;
