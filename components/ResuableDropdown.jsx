// components/ReusableDropdown.js
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const ReusableDropdown = ({ label, data, value, onChange }) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      {value || isFocus ? (
        <Text style={[styles.label, isFocus && { color: '#5aaf57' }]}>
          {label}
        </Text>
      ) : null}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: '#5aaf57' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={250}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? label : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          onChange(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? '#5aaf57' : '#888'}
            name="caretdown"
            size={16}
          />
        )}
      />
    </View>
  );
};

export default ReusableDropdown;

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fafafa',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 14,
    top: -8,
    zIndex: 999,
    paddingHorizontal: 6,
    fontSize: 12,
    color: '#444',
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#000',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
});
