import { View, Text, SafeAreaView, StyleSheet, Dimensions, Platform, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
const { width } = Dimensions.get("screen");

// Mock notification data for a real estate app
const mockNotifications = [
  {
    id: '1',
    title: 'New Lead Assigned',
    description: 'A new lead, John Doe, has been assigned to you. Contact them for a property viewing.',
    time: '2 hours ago',
    read: false,
    type: 'lead',
  },
  {
    id: '2',
    title: 'Appointment Reminder',
    description: 'You have a meeting with Client A at 3:00 PM today for a property tour.',
    time: '5 hours ago',
    read: false,
    type: 'appointment',
  },
  {
    id: '3',
    title: 'Leave Request Approved',
    description: 'Your leave request for May 30, 2025, has been approved by HR.',
    time: '1 day ago',
    read: true,
    type: 'leave',
  },
  {
    id: '4',
    title: 'Property Status Update',
    description: 'Property #123 in Downtown has been marked as sold.',
    time: '2 days ago',
    read: true,
    type: 'property',
  },
  {
    id: '5',
    title: 'Property Status Update',
    description: 'Property #123 in Downtown has been marked as sold.',
    time: '2 days ago',
    read: true,
    type: 'property',
  },
  {
    id: '6',
    title: 'Property Status Update',
    description: 'Property #123 in Downtown has been marked as sold.',
    time: '2 days ago',
    read: true,
    type: 'property',
  },
  {
    id: '7',
    title: 'Property Status Update',
    description: 'Property #123 in Downtown has been marked as sold.',
    time: '2 days ago',
    read: true,
    type: 'property',
  },
  {
    id: '8',
    title: 'Property Status Update',
    description: 'Property #123 in Downtown has been marked as sold.',
    time: '2 days ago',
    read: true,
    type: 'property',
  },
];

const Notification = () => {
    const navigation = useNavigation();
  // Function to determine the icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'lead':
        return 'person-add-outline';
      case 'appointment':
        return 'calendar-outline';
      case 'leave':
        return 'briefcase-outline';
      case 'property':
        return 'home-outline';
      default:
        return 'notifications-outline';
    }
  };

  // Render each notification item
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity style={Styles.notificationCard}>
      <View style={Styles.iconContainer}>
        <Ionicons
          name={getNotificationIcon(item.type)}
          size={20}
          color="#5aaf57"
        />
      </View>
      <LinearGradient
        colors={['#fff', '#fff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 3 }}
        style={Styles.card}
      >
        <View style={Styles.infoSection}>
          <Text style={Styles.title}>{item.title}</Text>
          <Text style={Styles.description}>{item.description}</Text>
          <Text style={Styles.time}>{item.time}</Text>
        </View>
        <Ionicons
          name={item.read ? "checkmark-circle-outline" : "alert-circle-outline"}
          size={20}
          color="black"
          style={Styles.statusIcon}
        />
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={Styles.container}>
      {/* Header */}
      <View style={Styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <Ionicons name="menu" size={26} color="black" />
        </TouchableOpacity>
        {/* <Ionicons name="menu" size={26} color="black" /> */}
        <Text style={Styles.headerTitle}>
          Notifications <Text style={{ color: "#5aaf57" }}>Tab</Text>
        </Text>
      </View>

      {/* Divider */}
      <Text style={Styles.divcont}></Text>

      {/* Notification List */}
      <FlatList
        data={mockNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={Styles.emptyText}>No notifications available</Text>
        }
        contentContainerStyle={Styles.listContainer}
      />
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
    marginTop: 30,
  },
  headerTitle: {
    marginTop: 15,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'PlusSB',
  },
  divcont: {
    height: 1,
    backgroundColor: "#ccc",
    width: width * 0.8,
    marginVertical: 10,
    bottom: 10,
    alignSelf: "center",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notificationCard: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    left: 5,
    top: 12,
    // backgroundColor: '#f5f5f5', // Light background to match the theme
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
  card: {
    width: width * 0.9,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingLeft: 50, // Space for the icon
    flexDirection: 'row',
    shadowColor: "#32cd32",
    alignItems: 'center',
    ...Platform.select({
      ios: {
        // shadowColor: "#5aaf57",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  infoSection: {
    flex: 1,
  },
  title: {
    color: '#5aaf57',
    fontSize: 16,
    fontFamily: "PlusSB",
    marginBottom: 4,
  },
  description: {
    color: '#000',
    fontSize: 14,
    fontFamily: "PlusR",
    marginBottom: 4,
  },
  time: {
    color: '#999',
    fontSize: 12,
    fontFamily: "PlusR",
  },
  statusIcon: {
    marginLeft: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: "PlusR",
  },
});

export default Notification;