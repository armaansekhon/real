import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../../../services/api';

const AddDocs = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams(); // Get customer ID from params
  const [customerId, setCustomerId] = useState(null);

  // State for document fields (array of objects)
  const [documents, setDocuments] = useState([
    { documentId: null, documentName: null, documentNumber: '', documentFile: null, documentType: null, fileName: '', fileUri: null },
  ]);

  // State for dropdown
  const [openDropdowns, setOpenDropdowns] = useState([]); // Track which dropdowns are open
  const [documentItems, setDocumentItems] = useState([]);

  // Validation errors
  const [errors, setErrors] = useState([]);

  // Fetch document names from API
  const fetchDocumentNames = async () => {
    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');
      const response = await axios.get(`${API_BASE_URL}/realestateCustomer/getLists`, {
        headers: {
          'Content-Type': 'application/json',
          'secret_key': secretKey,
        },
      });
      // Map API response to DropDownPicker format: [{ label: string, value: number }]
      const formattedItems = response.data.documentNamesList.map(item => ({
        label: item.documentName,
        value: item.id, // Use the ID as the value
        documentName: item.documentName, // Store documentName for mapping to documentType
      }));
      setDocumentItems(formattedItems);
    } catch (error) {
      console.error('Error fetching document names:', error);
      Alert.alert('Error', 'Failed to fetch document names. Using default options.');
      // Fallback to default items if API fails
      setDocumentItems([
        { label: 'Aadhar Card', value: 1, documentName: 'Aadhar' },
        { label: 'PAN Card', value: 2, documentName: 'PAN' },
        { label: 'Driving License', value: 3, documentName: 'Driving License' },
        { label: 'Passport', value: 4, documentName: 'Passport' },
      ]);
    }
  };

  useEffect(() => {
    if (id) {
      try {
        const parsedId = JSON.parse(id);
        setCustomerId(parsedId);
        console.log(parsedId);
      } catch (error) {
        console.error('Error parsing customer ID:', error);
        Alert.alert('Error', 'Invalid customer ID.');
        navigation.goBack();
      }
    } else {
      Alert.alert('Error', 'Customer ID is missing.');
      navigation.goBack();
    }

    // Fetch document names on component mount
    fetchDocumentNames();

    // Initialize openDropdowns and errors based on initial documents
    setOpenDropdowns(documents.map(() => false));
    setErrors(documents.map(() => ({})));
  }, [id]);

  // Add a new document field
  const addDocumentField = () => {
    setDocuments([...documents, { documentId: null, documentName: null, documentNumber: '', documentFile: null, documentType: null, fileName: '', fileUri: null }]);
    setOpenDropdowns([...openDropdowns, false]);
    setErrors([...errors, {}]);
  };

  // Remove a document field
  const removeDocumentField = (index) => {
    if (documents.length === 1) {
      Alert.alert('Warning', 'At least one document field is required.');
      return;
    }
    const updatedDocuments = documents.filter((_, i) => i !== index);
    const updatedOpenDropdowns = openDropdowns.filter((_, i) => i !== index);
    const updatedErrors = errors.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
    setOpenDropdowns(updatedOpenDropdowns);
    setErrors(updatedErrors);
  };

  // Handle document name change
  const handleDocumentNameChange = (index, value) => {
    const updatedDocuments = [...documents];
    const selectedItem = documentItems.find(item => item.value === value);
    updatedDocuments[index].documentId = value; // Store the ID
    updatedDocuments[index].documentName = selectedItem ? selectedItem.documentName : null; // Store the name for documentType
    setDocuments(updatedDocuments);

    // Clear error for document name
    const updatedErrors = [...errors];
    updatedErrors[index] = { ...updatedErrors[index], documentId: '' };
    setErrors(updatedErrors);
  };

  // Handle document number change
  const handleDocumentNumberChange = (index, value) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].documentNumber = value;
    setDocuments(updatedDocuments);
  };

  // Determine MIME type based on file extension
  const getMimeType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'pdf':
        return 'application/pdf';
      case 'txt':
        return 'text/plain';
      case 'doc':
      case 'docx':
        return 'application/msword';
      default:
        return 'application/octet-stream'; // Fallback for unknown types
    }
  };

  // Handle document file selection (for PDFs, text, etc.)
  const pickDocument = async (index) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all file types
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const updatedDocuments = [...documents];
        const mimeType = getMimeType(asset.name); // Determine MIME type
        updatedDocuments[index].documentType = mimeType;
        updatedDocuments[index].fileName = asset.name;
        updatedDocuments[index].fileUri = asset.uri; // Store the URI for FormData
        setDocuments(updatedDocuments);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  // Handle image selection (from Photos library)
  const pickImage = async (index) => {
    try {
      // Request permission to access photo library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photo library to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const updatedDocuments = [...documents];
        const mimeType = getMimeType(asset.uri); // Determine MIME type from URI
        const fileName = asset.uri.split('/').pop(); // Extract file name from URI
        updatedDocuments[index].documentType = mimeType;
        updatedDocuments[index].fileName = fileName;
        updatedDocuments[index].fileUri = asset.uri; // Store the URI for FormData
        setDocuments(updatedDocuments);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = documents.map((doc, index) => {
      const docErrors = {};
      if (!doc.documentId) {
        docErrors.documentId = 'Document Name is required';
      }
      if (!doc.fileUri) {
        docErrors.fileUri = 'Document file is required';
      }
      return docErrors;
    });

    setErrors(newErrors);
    return newErrors.every(err => Object.keys(err).length === 0);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const secretKey = await SecureStore.getItemAsync('auth_token');

      const formData = new FormData();
      formData.append('id', customerId);

      for (const doc of documents) {
        const fileUri = doc.fileUri;
        const fileName = doc.fileName;
        const mimeType = doc.documentType;

        // Fetch the file as a blob
        const response = await fetch(fileUri);
        const blob = await response.blob();

        // Append document fields to FormData
        formData.append('documentType', doc.documentType);
        formData.append('documentNo', doc.documentNumber || '');
        formData.append('docNameId', doc.documentId);
        formData.append('file', {
          uri: fileUri,
          name: fileName,
          type: mimeType,
        });
      }

      const response = await axios.post(
        `${API_BASE_URL}/realestateCustomer/addRealEstateCustomerDocuments`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'secret_key': secretKey,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Documents added successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error adding documents:', error);
      Alert.alert('Error', 'Failed to add documents. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Icon */}
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#5aaf57" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>
          Add <Text style={{ color: '#5aaf57' }}>Documents</Text>
        </Text>

        {/* Document Fields */}
        {documents.map((doc, index) => (
          <View key={index} style={styles.documentContainer}>
            {/* Document Name Dropdown */}
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Document Name</Text>
              <Text style={styles.required}>*</Text>
            </View>
            <View style={{ zIndex: 1000 - index, marginBottom: 10 }}>
              <DropDownPicker
                open={openDropdowns[index]}
                value={doc.documentId}
                items={documentItems}
                listMode="SCROLLVIEW"
                setOpen={(open) => {
                  const updatedOpenDropdowns = [...openDropdowns];
                  updatedOpenDropdowns[index] = open;
                  setOpenDropdowns(updatedOpenDropdowns);
                }}
                setValue={(callback) => {
                  const value = callback();
                  handleDocumentNameChange(index, value);
                }}
                setItems={setDocumentItems}
                placeholder="Select Document Name"
                style={[styles.dropdown, errors[index]?.documentId && styles.inputError]}
                dropDownContainerStyle={styles.dropdownContainer}
                zIndex={1000 - index}
              />
              {errors[index]?.documentId && (
                <Text style={styles.errorText}>{errors[index].documentId}</Text>
              )}
            </View>

            {/* Document Number */}
            <Text style={styles.label}>Document Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Document Number"
              value={doc.documentNumber}
              onChangeText={(text) => handleDocumentNumberChange(index, text)}
            />

            {/* Document Upload Options */}
            <Text style={styles.label}>Upload Document or Image</Text>
            <View style={styles.uploadOptions}>
              <TouchableOpacity
                style={[styles.uploadButton, styles.uploadButtonHalf]}
                onPress={() => pickDocument(index)}
              >
                <Text style={styles.uploadText}>Select Document</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.uploadButton, styles.uploadButtonHalf]}
                onPress={() => pickImage(index)}
              >
                <Text style={styles.uploadText}>Select Image</Text>
              </TouchableOpacity>
            </View>
            {doc.fileName && (
              <Text style={styles.fileNameText}>Selected: {doc.fileName}</Text>
            )}
            {errors[index]?.fileUri && (
              <Text style={styles.errorText}>{errors[index].fileUri}</Text>
            )}

            {/* Add/Remove Buttons */}
            <View style={styles.buttonContainer}>
              {index === documents.length - 1 && (
                <TouchableOpacity style={styles.iconButton} onPress={addDocumentField}>
                  <Ionicons name="add-circle-outline" size={30} color="#5aaf57" />
                </TouchableOpacity>
              )}
              {documents.length > 1 && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => removeDocumentField(index)}
                >
                  <Ionicons name="remove-circle-outline" size={30} color="#ff4444" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddDocs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  backIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlusR',
    marginBottom: 20,
  },
  documentContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'PlusSB',
    color: '#5aaf57',
    marginBottom: 5,
  },
  required: {
    color: 'red',
    fontSize: 16,
    marginLeft: 4,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: 'PlusR',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  uploadButtonHalf: {
    flex: 0.48,
  },
  uploadText: {
    fontSize: 16,
    fontFamily: 'PlusR',
    color: '#5aaf57',
  },
  fileNameText: {
    fontSize: 14,
    fontFamily: 'PlusR',
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#5aaf57',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    fontSize: 18,
    fontFamily: 'PlusSB',
    color: '#fff',
  },
});