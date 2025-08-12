import React, { useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function QrGeneratorScreen({ navigation }) {
    const [tagName, setTagName] = useState('');           // NEW STATE for tag name
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [carName, setCarName] = useState('');
    const [carColor, setCarColor] = useState('');
    const [qrDataString, setQrDataString] = useState('');
    const [currentTagData, setCurrentTagData] = useState(null); // Store current tag data for saving

    // Your Vercel base URL for the hosted web page
    const vercelBaseUrl = 'https://nimtag-landing.vercel.app/qr-scan-landing.html';

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const handleGenerateQR = () => {
        // Basic validation - updated to include tag name
        if (!tagName || !vehicleNumber || !ownerName || !contactNumber || !carName || !carColor) {
            Alert.alert(
                'Missing Information',
                'Please fill in all fields including Tag Name to generate the QR code.'
            );
            return;
        }

        // URL-encode all parameters
        const encodedVNum = encodeURIComponent(vehicleNumber);
        const encodedOName = encodeURIComponent(ownerName);
        const encodedContact = encodeURIComponent(contactNumber);
        const encodedCarName = encodeURIComponent(carName);
        const encodedCarColor = encodeURIComponent(carColor);

        // Construct the full URL with all data as query parameters
        const fullUrlForQR = `${vercelBaseUrl}?vNum=${encodedVNum}&oName=${encodedOName}&contact=${encodedContact}&carName=${encodedCarName}&carColor=${encodedCarColor}`;

        setQrDataString(fullUrlForQR);

        // Store current tag data for potential saving
        setCurrentTagData({
            id: Date.now().toString(), // Simple ID generation
            tagName,
            vehicleNumber,
            ownerName,
            contactNumber,
            carName,
            carColor,
            qrDataString: fullUrlForQR,
            createdAt: new Date().toISOString(),
            scansThisWeek: 0,
            lastCall: 'Never'
        });

        Alert.alert(
            'QR Code Generated!',
            'Your QR code is ready. You can now save this tag or scan the code.'
        );
    };

    const handleSaveTag = async () => {
        if (!currentTagData) {
            Alert.alert('Error', 'No QR code generated to save.');
            return;
        }

        try {
            // Get existing saved tags
            const existingTags = await AsyncStorage.getItem('savedTags');
            let savedTags = existingTags ? JSON.parse(existingTags) : [];

            // Check if tag name already exists
            const tagExists = savedTags.some(tag => tag.tagName.toLowerCase() === currentTagData.tagName.toLowerCase());

            if (tagExists) {
                Alert.alert('Error', 'A tag with this name already exists. Please choose a different name.');
                return;
            }

            // Add new tag
            savedTags.push(currentTagData);

            // Save updated tags array
            await AsyncStorage.setItem('savedTags', JSON.stringify(savedTags));

            Alert.alert(
                'Tag Saved!',
                `"${currentTagData.tagName}" has been saved to your tags.`,
                [
                    {
                        text: 'View Tags',
                        onPress: () => navigation.navigate('TagsTab')
                    },
                    {
                        text: 'Create Another',
                        onPress: () => {
                            // Reset form
                            setTagName('');
                            setVehicleNumber('');
                            setOwnerName('');
                            setContactNumber('');
                            setCarName('');
                            setCarColor('');
                            setQrDataString('');
                            setCurrentTagData(null);
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error saving tag:', error);
            Alert.alert('Error', 'Failed to save tag. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.newHeaderContainer}>
                    <Text style={styles.newTitle}>Activate Your Tag</Text>
                    <Text style={styles.newDescription}>
                        Fill in your details below to generate and save your QR tag.
                    </Text>
                </View>

                <View style={styles.illustrationContainer}>
                    <Image
                        source={require('./assets/images/generated-image.png')}
                        style={styles.illustrationImage}
                        resizeMode="contain"
                    />
                </View>

                {/* NEW INPUT for Tag Name */}
                <TextInput
                    style={styles.input}
                    placeholder="Tag Name (e.g., My Car Tag, Office Tag)"
                    placeholderTextColor="#888"
                    value={tagName}
                    onChangeText={setTagName}
                />

                {/* Original Input Fields */}
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
                <TextInput
                    style={styles.input}
                    placeholder="Car Name (e.g., Maruti Ignis Delta)"
                    placeholderTextColor="#888"
                    value={carName}
                    onChangeText={setCarName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Car Color (e.g., Arctic White)"
                    placeholderTextColor="#888"
                    value={carColor}
                    onChangeText={setCarColor}
                />

                <TouchableOpacity
                    style={styles.activateButton}
                    onPress={handleGenerateQR}
                >
                    <Text style={styles.activateButtonText}>Generate QR Code</Text>
                </TouchableOpacity>

                {qrDataString ? (
                    <View style={styles.qrContainer}>
                        <Text style={styles.qrLabel}>Scan this code:</Text>
                        <QRCode
                            value={qrDataString}
                            size={220}
                            color="black"
                            backgroundColor="white"
                        />
                        <Text style={styles.tagNameDisplay}>Tag: {tagName}</Text>

                        {/* Save Tag Button */}
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSaveTag}
                        >
                            <Text style={styles.saveButtonText}>Save Tag</Text>
                        </TouchableOpacity>

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

const styles = StyleSheet.create({
    keyboardAvoidingContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 25,
        paddingTop: 50,
    },
    newHeaderContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    newTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2E3D49',
        marginBottom: 10,
        textAlign: 'center',
    },
    newDescription: {
        fontSize: 16,
        color: '#6A7E8F',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    illustrationContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: '#E6F0F6',
        borderRadius: 15,
        paddingVertical: 20,
    },
    illustrationImage: {
        width: '80%',
        height: 200,
        maxWidth: 300,
    },
    input: {
        width: '100%',
        maxWidth: 400,
        padding: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#F7F7F7',
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    activateButton: {
        backgroundColor: '#2E3D49',
        paddingVertical: 18,
        borderRadius: 10,
        width: '100%',
        maxWidth: 400,
        marginTop: 10,
        marginBottom: 20,
    },
    activateButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 17,
        fontWeight: 'bold',
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
        width: '100%',
        maxWidth: 400,
    },
    qrLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#555',
    },
    tagNameDisplay: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E3D49',
        marginTop: 15,
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginBottom: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    qrUrlText: {
        marginTop: 10,
        fontSize: 12,
        color: '#777',
        textAlign: 'center',
        paddingHorizontal: 10,
        lineHeight: 18,
    },
});