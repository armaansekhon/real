import React from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from 'react-native';

const dummyEmployees = [
  {
    id: '1',
    name: 'Alice Johnson',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '2',
    name: 'Bob Smith',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '3',
    name: 'Charlie Williams',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: '4',
    name: 'Alice Johnson',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '5',
    name: 'Bob Smith',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '6',
    name: 'Charlie Williams',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

const EmployeeList = ({ onSelectEmployee }) => {
  return (
    <FlatList
      data={dummyEmployees}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => onSelectEmployee(item)}
        >
          <Text style={styles.id}>{item.id}</Text>

          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.image }} style={styles.avatar} />
          </View>

          <Text style={styles.name}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'space-between',
  },
  id: {
    width: 40,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  name: {
    width: 200,
    fontSize: 16,
    color: '#111',
    fontFamily: 'PlusR',
    textAlign: 'center',
  },
});

export default EmployeeList;