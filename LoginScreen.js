import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AuthService from '../services/authService';

const LoginScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        const result = await AuthService.signInWithGoogle();

        if (result.success) {
            Alert.alert('Success', 'Signed in successfully!');
            navigation.navigate('Home'); // Navigate to your home screen
        } else {
            Alert.alert('Error', result.error);
        }
        setLoading(false);
    };

    const handleSendOTP = async () => {
        if (!phoneNumber) {
            Alert.alert('Error', 'Please enter phone number');
            return;
        }

        setLoading(true);
        const result = await AuthService.sendOTP(phoneNumber);

        if (result.success) {
            setConfirmationResult(result.confirmationResult);
            Alert.alert('Success', 'OTP sent to your phone');
        } else {
            Alert.alert('Error', result.error);
        }
        setLoading(false);
    };

    const handleVerifyOTP = async () => {
        if (!otp) {
            Alert.alert('Error', 'Please enter OTP');
            return;
        }

        setLoading(true);
        const result = await AuthService.verifyOTP(confirmationResult, otp);

        if (result.success) {
            Alert.alert('Success', 'Phone verified successfully!');
            navigation.navigate('Home'); // Navigate to your home screen
        } else {
            Alert.alert('Error', result.error);
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Nimtag</Text>

            {/* Google Sign In */}
            <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                disabled={loading}
            >
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>OR</Text>

            {/* Phone Sign In */}
            <View style={styles.phoneContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter phone number (+1234567890)"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSendOTP}
                    disabled={loading || confirmationResult}
                >
                    <Text style={styles.buttonText}>Send OTP</Text>
                </TouchableOpacity>
            </View>

            {confirmationResult && (
                <View style={styles.otpContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter OTP"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleVerifyOTP}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>Verify OTP</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Hidden reCAPTCHA container */}
            <View id="recaptcha-container" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    googleButton: {
        backgroundColor: '#4285f4',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    googleButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    orText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        color: '#666',
    },
    phoneContainer: {
        marginBottom: 20,
    },
    otpContainer: {
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginScreen;