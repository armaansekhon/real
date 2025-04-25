import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const AttendanceCalendar = ({ employee, onBack }) => {
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    // Example: load dummy attendance data
    const dummyAttendance = {
      '2025-04-01': { status: 'present' },
      '2025-04-02': { status: 'absent' },
      '2025-04-03': { status: 'leave' },
    };

    const colors = {
      present: 'green',
      absent: 'red',
      leave: 'orange',
    };

    const newMarked = {};
    for (const [date, { status }] of Object.entries(dummyAttendance)) {
      newMarked[date] = {
        customStyles: {
          container: { backgroundColor: colors[status] },
          text: { color: 'white' },
        },
      };
    }

    setMarkedDates(newMarked);
  }, [employee]);

  return (
    <View style={styles.container}>
      <Button title="← Back" onPress={onBack} />
      <Text style={styles.title}>Attendance for {employee.name}</Text>
      <Calendar
        markingType={'custom'}
        markedDates={markedDates}
        onDayPress={(day) => {
          // Future: update attendance status on click
          console.log('Clicked:', day.dateString);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
});

export default AttendanceCalendar;
