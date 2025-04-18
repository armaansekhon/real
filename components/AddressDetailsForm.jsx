import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function AddressDetailsForm({ initialData, onSubmit, onBack }) {
  const [data, setData] = useState(initialData || {});

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Country</Text>
      <TextInput
        style={styles.input}
        value={data.country || ''}
        placeholder="Country"
        onChangeText={text => setData({ ...data, country: text })}
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        value={data.city || ''}
        placeholder="City"
        onChangeText={text => setData({ ...data, city: text })}
      />

      {/* Add more fields if needed */}

      <View style={styles.buttonsContainer}>
        <Button title="Back" onPress={onBack} />
        <Button title="Submit" onPress={() => {
               const updatedData = { ...data }; 
            onSubmit(updatedData);
        }} />
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
