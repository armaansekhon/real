import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function GeneralDetailsForm({ initialData, onNext, onBack }) {
  const [data, setData] = useState(initialData || {});

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Mobile</Text>
      <TextInput
        style={styles.input}
        value={data.mobile || ''}
        placeholder="Mobile"
        onChangeText={text => setData({ ...data, mobile: text })}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={data.email || ''}
        placeholder="Email"
        onChangeText={text => setData({ ...data, email: text })}
        keyboardType="email-address"
      />

      {/* Add more fields if needed */}

      <View style={styles.buttonsContainer}>
        <Button title="Back" onPress={onBack} />
        <Button title="Next" onPress={() => onNext(data)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 8,
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
