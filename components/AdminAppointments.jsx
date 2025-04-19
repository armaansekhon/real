import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

// Sample backend-style appointment data
const sampleAppointments = {
  '2025-04-19': [
    { text: 'Meeting with Client', time: '1:23 PM' },
    { text: 'Scheduled at Mohali ', time: '1:30 PM' },
  ],
  '2025-04-18': [
    { text: 'Scheduled at Mohali ', time: '10:00 AM' },
    { text: 'Deployed update to staging', time: '4:00 PM' },
  ],
};

const generateWeekDates = (centerDate = dayjs()) => {
  const days = [];
  for (let i = -3; i <= 3; i++) {
    const date = centerDate.add(i, 'day');
    days.push({
      label: date.format('dd').toUpperCase(), // SU, MO, etc.
      dateNum: date.date(),
      fullDate: date.format('YYYY-MM-DD'),
    });
  }
  return days;
};

export default function AdminAppointments() {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [weekDates, setWeekDates] = useState(generateWeekDates(dayjs()));

  // Auto-update the date at midnight
  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs().format('YYYY-MM-DD');
      if (now !== selectedDate) {
        setSelectedDate(now);
        setWeekDates(generateWeekDates(dayjs()));
      }
    }, 60 * 1000); // check every 60 seconds

    return () => clearInterval(interval);
  }, [selectedDate]);

  const appointments = sampleAppointments[selectedDate] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Latest  <Text style={{ fontFamily:"PlusSB",color:"#196f3d"}} > Appointments</Text> </Text>

      <FlatList
        data={weekDates}
        horizontal
        keyExtractor={(item) => item.fullDate}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateSelector}
        renderItem={({ item }) => {
          const isSelected = item.fullDate === selectedDate;
          return (
            <TouchableOpacity
              onPress={() => setSelectedDate(item.fullDate)}
              style={styles.dayBox}
            >
              <Text style={styles.dayText}>{item.label}</Text>
              <View style={[styles.dateCircle, isSelected && styles.selectedDate]}>
                <Text style={[styles.dateText, isSelected && styles.selectedText]}>
                  {item.dateNum}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <ScrollView contentContainerStyle={styles.timeline}>
        {appointments.length === 0 ? (
          <Text style={styles.noAppointments}>No appointments</Text>
        ) : (
          appointments.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={24} color="#007bff" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.itemText}>{item.text}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    fontSize: 16,
    // fontWeight: '600',
    marginBottom: 12,
    color: '#000',
    fontFamily:"PlusR"

  },

  dateSelector: {
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  dayBox: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  dayText: {
    fontSize: 12,
    color: '#444',
    fontFamily:"PlusR"
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  selectedDate: {
    backgroundColor: '#007bff',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timeline: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#ccc',
    
  },
  itemText: {
    fontSize: 14,
    color: '#111',
    marginBottom: 2,
    fontFamily:"PlusR"
    
  },
  timeText: {
    fontSize: 12,
    color: '#888',
  },
  noAppointments: {
    padding: 16,
    color: '#aaa',
    fontStyle: 'italic',
  },
});
