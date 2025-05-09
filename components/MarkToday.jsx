import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  TextInput,
  Keyboard,
  InteractionManager,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import useAttendanceNotations from '../hooks/useAttendanceNotations';
import useEmployeeList from '../hooks/useEmployeeList';
import useSaveAttendance from '../hooks/useSaveAttendence';
import { Alert } from 'react-native';

const MarkToday = ({ onBack }) => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});
  const [search, setSearch] = useState('');
  const { employees, loading: empLoading } = useEmployeeList();
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const { notations, loading } = useAttendanceNotations();
  const saveAttendance = useSaveAttendance();

  useEffect(() => {
    setFilteredEmployees(employees || []);
  }, [employees]);

  const handleSearch = (query) => {
    setSearch(query);
    if (!employees) {
      setFilteredEmployees([]);
      return;
    }

    if (query.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = employees.filter((emp) => {
        if (!emp || !emp.name) {
          return false;
        }
        return emp.name.toLowerCase().includes(lowerQuery);
      });
      setFilteredEmployees(filtered);
    }
  };

  useEffect(() => {
    if (!loading && employees?.length && notations?.length) {
      const mappedAttendance = {};
      employees.forEach((emp) => {
        if (!emp || !emp.attendance) {
          return;
        }
        const matchedNotation = notations.find(
          (note) => note?.color?.toLowerCase() === emp.attendance?.toLowerCase()
        );
        if (matchedNotation) {
          mappedAttendance[emp.id] = matchedNotation.description;
        }
      });
      setAttendanceData(mappedAttendance);
    }
  }, [employees, notations, loading]);

  const handleStatusSelect = (empId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [empId]: status,
    }));
  };

  const handleSubmit = async () => {
    try {
      const attendanceList = Object.entries(attendanceData)
        .map(([empId, statusDesc]) => {
          const matchedNotation = notations.find(
            (note) => note?.description?.toLowerCase() === statusDesc?.toLowerCase()
          );
          if (!matchedNotation) {
            console.warn(`No matching notation for status: ${statusDesc}`);
            return null;
          }
          return {
            employeeId: empId,
            colorCode: matchedNotation.color,
          };
        })
        .filter(Boolean);

      await saveAttendance(attendanceList);
      InteractionManager.runAfterInteractions(() => {
        Alert.alert('Success', 'Attendance saved successfully!');
      });
    } catch (error) {
      console.error('Failed to save all attendance:', error);
      Alert.alert('Error', 'Failed to save attendance. Please try again.');
    }
  };

  const renderLegend = () => (
    <View style={styles.legendRow}>
      {notations?.map((item) => (
        <View key={item?.id} style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: item?.color }]} />
          <Text style={styles.legendText}>{item?.description}</Text>
        </View>
      ))}
    </View>
  );

  const renderEmployeeRow = ({ item }) => {
    const currentStatus = attendanceData[item?.id];
    return (
      <View style={styles.tableRow}>
        <View style={{ flex: 3 }}>
          <Text style={styles.nameText}>{item?.name || 'Unknown'}</Text>
        </View>
        <View style={styles.statusGroup} pointerEvents="box-none">
          {notations?.map((statusItem) => (
            <TouchableOpacity
              key={statusItem?.description}
              style={[
                styles.statusCircle,
                {
                  backgroundColor: statusItem?.color,
                  opacity: currentStatus === statusItem?.description ? 1 : 0.4,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => handleStatusSelect(item?.id, statusItem?.description)}
            >
              {currentStatus === statusItem?.description && (
                <Ionicons name="checkmark" size={26} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons style={styles.backText} name="chevron-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.header}>
          Mark <Text style={styles.highlight}>Attendance</Text>
        </Text>
        <Text style={{ color: '#444', marginBottom: 20, fontFamily: 'PlusR' }}>
          Mark Today's Attendance
        </Text>

        <TouchableOpacity onPress={Keyboard.dismiss} activeOpacity={1}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name"
              value={search}
              onChangeText={handleSearch}
              autoCapitalize="none"
            />
          </View>
        </TouchableOpacity>

        <Modal visible={showPicker} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.pickerModal}>
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
              <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.doneBtn}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {renderLegend()}

        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.list}
          data={filteredEmployees}
          keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
          renderItem={renderEmployeeRow}
          initialNumToRender={10}
          contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
          onStartShouldSetResponder={() => true}
          windowSize={5}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Save Attendance</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#fff' },
  backButton: { marginBottom: 10 },
  backText: { color: '#000', fontSize: 26, fontWeight: '1200' },
  header: { fontSize: 32, color: '#111', marginBottom: 10, fontFamily: 'PlusSB' },
  highlight: { fontFamily: 'PlusSB', color: '#5aaf57' },
  dateBtn: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 12,
  },
  dateText: { fontSize: 18, fontFamily: 'PlusSB', color: '#111' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: 300,
    alignItems: 'center',
  },
  doneBtn: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  doneText: { color: '#fff', fontWeight: '600' },
  list: {
    marginTop: 40,
    flex: 1,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 8,
  },
  legendText: { fontSize: 15, fontFamily: 'PlusR', color: '#222' },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
    alignItems: 'center',
    width: '100%',
  },
  nameText: {
    fontSize: 17,
    color: '#222',
    fontFamily: 'PlusR',
  },
  statusGroup: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.25,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    fontFamily: 'PlusR',
  },
  submitBtn: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#000',
    fontSize: 19,
    fontFamily: 'PlusR',
  },
});

export default MarkToday;