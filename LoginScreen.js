import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert
} from 'react-native';
import { auth } from './firebase';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AuthService from './authService';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_SIGNIN_WEB_CLIENT_ID,
    });

    useEffect(() => {
        const authenticateWithFirebase = async () => {
            if (response?.type === 'success') {
                try {
                    const { id_token } = response.params;
                    const result = await AuthService.signInWithGoogleCredential(id_token);
                    
                    if (result.success) {
                        Alert.alert('Success', 'Signed in with Google!');
                        navigation.navigate('Home');
                    } else {
                        Alert.alert('Error', result.error);
                    }
                } catch (error) {
                    Alert.alert('Firebase Error', error.message);
                }
            }
        };
        authenticateWithFirebase();
    }, [response]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            AuthService.cleanup();
        };
    }, []);

    const handleSendOTP = async () => {
        if (!phoneNumber) {
            Alert.alert('Error', 'Please enter phone number');
            return;
        }

        // Validate phone number format
        if (!phoneNumber.startsWith('+')) {
            Alert.alert('Error', 'Phone number must include country code (e.g., +1234567890)');
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

        if (otp.length !== 6) {
            Alert.alert('Error', 'OTP must be 6 digits');
            return;
        }

        setLoading(true);
        const result = await AuthService.verifyOTP(confirmationResult, otp);

        if (result.success) {
            Alert.alert('Success', 'Phone verified successfully!');
            navigation.navigate('Home');
        } else {
            Alert.alert('Error', result.error);
            // Reset OTP input on error
            setOtp('');
        }
        setLoading(false);
    };

    const resetPhoneAuth = () => {
        setConfirmationResult(null);
        setOtp('');
        setPhoneNumber('');
        AuthService.cleanup();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Nimtag</Text>

            {/* Google Sign In */}
            <TouchableOpacity
                style={styles.googleButton}
                onPress={() => promptAsync()}
                disabled={!request || loading}
            >
                <Text style={styles.googleButtonText}>
                    {loading ? 'Signing in...' : 'Sign in with Google'}
                </Text>
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
                    editable={!confirmationResult}
                />

                <TouchableOpacity
                    style={[
                        styles.button,
                        confirmationResult && styles.buttonDisabled
                    ]}
                    onPress={handleSendOTP}
                    disabled={loading || confirmationResult}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Sending...' : 'Send OTP'}
                    </Text>
                </TouchableOpacity>
            </View>

            {confirmationResult && (
                <View style={styles.otpContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        maxLength={6}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleVerifyOTP}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={resetPhoneAuth}
                        disabled={loading}
                    >
                        <Text style={styles.resetButtonText}>
                            Use different number
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* reCAPTCHA container - must be present for phone auth */}
            <View style={styles.recaptchaContainer}>
                <div id="recaptcha-container"></div>
            </View>
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
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resetButton: {
        marginTop: 15,
        padding: 10,
    },
    resetButtonText: {
        color: '#007AFF',
        textAlign: 'center',
        fontSize: 14,
    },
    recaptchaContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 0,
        overflow: 'hidden',
    },
});

export default LoginScreen;