// screens/EditProfileScreen.js (Updated Version)
import React, { useState, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useUser();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    profileImage: user?.profileImage || null,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Edit Profile',
      headerStyle: {
        backgroundColor: '#1E2C3A',
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBackButton}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
          <Text style={styles.headerBackText}>Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Request camera permissions
  const requestCameraPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        return (
          granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Image picker functionality
  const pickImage = async () => {
    const hasPermission = await requestCameraPermissions();

    if (!hasPermission) {
      Alert.alert('Permission Required', 'Camera and storage permissions are required to upload photos.');
      return;
    }

    Alert.alert(
      'Select Photo',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: openCamera
        },
        {
          text: 'Gallery',
          onPress: openGallery
        },
        {
          text: 'Remove Photo',
          onPress: () => {
            setFormData(prev => ({ ...prev, profileImage: null }));
          },
          style: 'destructive'
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = async () => {
    try {
      // Request permission first
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({ ...prev, profileImage: result.assets[0].uri }));
      }
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  };

  const openGallery = async () => {
    try {
      // Request permission first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery permission is required to select photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({ ...prev, profileImage: result.assets[0].uri }));
      }
    } catch (error) {
      console.log('Gallery error:', error);
      Alert.alert('Error', 'Failed to open gallery. Please try again.');
    }
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields (First Name, Last Name, Email)');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    updateUser(formData);
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const InputField = ({ label, value, onChangeText, placeholder, required = false, multiline = false, keyboardType = 'default' }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label}{required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.textInput, multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8E8E93"
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
        autoCorrect={false}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Profile Image Section */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            {formData.profileImage ? (
              <Image source={{ uri: formData.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="person" size={50} color="#8E8E93" />
              </View>
            )}
            <TouchableOpacity style={styles.editImageButton} onPress={pickImage}>
              <Ionicons name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <InputField
            label="First Name"
            value={formData.firstName}
            onChangeText={(text) => updateFormData('firstName', text)}
            placeholder="Enter first name"
            required
          />

          <InputField
            label="Last Name"
            value={formData.lastName}
            onChangeText={(text) => updateFormData('lastName', text)}
            placeholder="Enter last name"
            required
          />

          <InputField
            label="Email"
            value={formData.email}
            onChangeText={(text) => updateFormData('email', text)}
            placeholder="Enter email address"
            required
            keyboardType="email-address"
          />

          <InputField
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => updateFormData('phone', text)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />

          <InputField
            label="City"
            value={formData.city}
            onChangeText={(text) => updateFormData('city', text)}
            placeholder="Enter city"
          />

          <InputField
            label="Country"
            value={formData.country}
            onChangeText={(text) => updateFormData('country', text)}
            placeholder="Enter country"
          />

          <InputField
            label="Address"
            value={formData.address}
            onChangeText={(text) => updateFormData('address', text)}
            placeholder="Enter full address"
            multiline
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        {/* Change Password Button */}
        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={() => {
            Alert.alert('Coming Soon', 'Change password feature will be available soon.');
          }}
        >
          <Text style={styles.changePasswordText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  headerBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  headerBackText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  content: {
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E5EA',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2E8B8B',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: '#FF3B30',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  saveButton: {
    backgroundColor: '#2E8B8B',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  changePasswordButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  changePasswordText: {
    color: '#2E8B8B',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen;