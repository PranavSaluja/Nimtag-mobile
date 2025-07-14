import React, { useState, useLayoutEffect } from 'react'; // Import useLayoutEffect
import {
    View,
    Text,
    TextInput,
    TouchableOpacity, // Use TouchableOpacity for custom button styles
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image, // Import Image for the illustration
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function QrGeneratorScreen({ navigation }) { // Receive navigation prop
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [qrDataString, setQrDataString] = useState('');

    // Your Vercel base URL for the hosted web page
    // MAKE SURE TO REPLACE THIS with your actual Vercel deployment URL!
    const vercelBaseUrl = 'https://nimtag-web-git-main-pranav-salujas-projects-a4bcb805.vercel.app/qr-scan-landing.html';

    // useLayoutEffect to ensure no header is shown for this screen
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

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
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* New Header Section */}
                <View style={styles.newHeaderContainer}>
                    <Text style={styles.newTitle}>Activate Your Tag</Text>
                    <Text style={styles.newDescription}>
                        Scan your NimTag or enter your tag code below to link it with your account.
                    </Text>
                </View>

                {/* Illustration Image */}
                <View style={styles.illustrationContainer}>
                    <Image
                        source={require('./assets/images/generated-image.png')} // Adjust path as needed
                        style={styles.illustrationImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Original Input Fields (kept as is) */}
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
                    placeholder="Contact Number"
                    placeholderTextColor="#888"
                    value={contactNumber}
                    onChangeText={setContactNumber}
                    keyboardType="phone-pad"
                />

                {/* Custom Button to match the theme */}
                <TouchableOpacity
                    style={styles.activateButton} // New style for the button
                    onPress={handleGenerateQR}
                >
                    <Text style={styles.activateButtonText}>Activate Tag</Text>
                </TouchableOpacity>

                {/* Conditional rendering: show QR code only if qrDataString is set */}
                {qrDataString ? (
                    <View style={styles.qrContainer}>
                        <Text style={styles.qrLabel}>Scan this code:</Text>
                        <QRCode
                            value={qrDataString}
                            size={220}
                            color="black"
                            backgroundColor="white"
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

const styles = StyleSheet.create({
    keyboardAvoidingContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Changed to white background as in mockup
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start', // Align content to top
        alignItems: 'center',
        padding: 25, // Adjusted padding
        paddingTop: 50, // Added more top padding for the header
    },
    newHeaderContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20, // Space below header
    },
    newTitle: {
        fontSize: 26, // Larger and bolder title
        fontWeight: 'bold',
        color: '#2E3D49', // Dark blue text color
        marginBottom: 10,
        textAlign: 'center',
    },
    newDescription: {
        fontSize: 16,
        color: '#6A7E8F', // Lighter grey for description
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30, // Space below description before image
    },
    illustrationContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30, // Space below image before inputs
        backgroundColor: '#E6F0F6', // Light blue background from mockup
        borderRadius: 15, // Rounded corners for the container
        paddingVertical: 20, // Vertical padding inside the container
    },
    illustrationImage: {
        width: '80%', // Adjust width relative to container
        height: 200, // Fixed height for the image
        maxWidth: 300, // Max width to prevent it from getting too large on big screens
    },
    input: {
        width: '100%',
        maxWidth: 400,
        padding: 15, // Adjusted padding
        borderWidth: 1,
        borderColor: '#E0E0E0', // Lighter border color
        borderRadius: 10, // More rounded corners
        marginBottom: 15,
        backgroundColor: '#F7F7F7', // Slightly off-white background
        fontSize: 16, // Consistent font size
        color: '#333',
        shadowColor: '#000', // Subtle shadow for a lifted effect
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2, // Android shadow
    },
    activateButton: { // New style for the "Generate QR Code" button
        backgroundColor: '#2E3D49', // Dark blue background from mockup
        paddingVertical: 18,
        borderRadius: 10,
        width: '100%',
        maxWidth: 400,
        marginTop: 10, // Space above the button
        marginBottom: 20, // Space below the button
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