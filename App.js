// App.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet, // For creating styles
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function App() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [qrDataString, setQrDataString] = useState('');

  // Your Vercel base URL for the hosted web page
  // MAKE SURE TO REPLACE THIS with your actual Vercel deployment URL!
  const vercelBaseUrl = 'https://nimtag-web-git-main-pranav-salujas-projects-a4bcb805.vercel.app/'; 

  const handleGenerateQR = () => {
    // Basic validation
    if (!vehicleNumber || !ownerName || !contactNumber) {
      Alert.alert(
        'Missing Information',
        'Please fill in all vehicle details to generate the QR code.'
      );
      return;
    }

    // URL-encode all parameters to ensure they are correctly passed in the URL
    const encodedVNum = encodeURIComponent(vehicleNumber);
    const encodedOName = encodeURIComponent(ownerName);
    const encodedContact = encodeURIComponent(contactNumber);

    // Construct the full URL with all data as query parameters
    const fullUrlForQR = `${vercelBaseUrl}?vNum=${encodedVNum}&oName=${encodedOName}&contact=${encodedContact}`;

    // Update state to display the QR code
    setQrDataString(fullUrlForQR);

    // Provide user feedback
    Alert.alert(
      'QR Code Generated!',
      'Your QR code is ready. Anyone can scan this code to view the details on a web page.'
    );
  };

  return (
    // KeyboardAvoidingView helps prevent the keyboard from obscuring input fields
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer} // Apply styles using StyleSheet
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      {/* ScrollView for content that might exceed screen height */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Nimtag QR Generator</Text>

        <TextInput
          style={styles.input}
          placeholder="Vehicle Number (e.g., MH12AB1234)"
          placeholderTextColor="#888"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          autoCapitalize="characters"
        />
        <TextInput
          style={styles.input}
          placeholder="Owner Name"
          placeholderTextColor="#888"
          value={ownerName}
          onChangeText={setOwnerName}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number (e.g., +919876543210)"
          placeholderTextColor="#888"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />

        <Button
          title="Generate QR Code"
          onPress={handleGenerateQR}
          color="#007bff" // Standard button color prop
        />

        {/* Conditional rendering: show QR code only if qrDataString is set */}
        {qrDataString ? (
          <View style={styles.qrContainer}>
            <Text style={styles.qrLabel}>Scan this code:</Text>
            <QRCode
              value={qrDataString} // The URL string for the QR code
              size={220} // Dimensions of the QR code
              color="black" // Foreground color of the QR code
              backgroundColor="white" // Background color of the QR code
            />
            <Text style={styles.qrUrlText}>
              This QR contains the URL:
              <Text style={{ fontWeight: 'bold' }}> {qrDataString}</Text>
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Define your styles using StyleSheet.create
const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4', // Light background color
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 20, // Add more top padding for Android status bar
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 400,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android shadow
  },
  qrContainer: {
    marginTop: 40,
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  qrLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#555',
  },
  qrUrlText: {
    marginTop: 20,
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 18,
  },
});