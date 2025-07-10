import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert,
    Platform // <<<<<<<<< IMPORTANT: This Platform import MUST be here
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session'; // Import makeRedirectUri from core expo-auth-session
import AuthService from './authService';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- START: CRITICAL FIX FOR GOOGLE LOGIN ---
    // Define options for Google.useAuthRequest based on platform
    const googleAuthRequestOptions = {
        // This is your Web client ID. It is required here as the default/fallback, and for web platform.
        clientId: process.env.EXPO_PUBLIC_GOOGLE_SIGNIN_WEB_CLIENT_ID,
        // scopes: ['profile', 'email'], // Can uncomment if you need to be explicit about scopes
    };

    let currentRedirectUri = ''; // Variable to log the redirect URI being used (for debugging web platform)

    if (Platform.OS === 'android') {
        // >>>>>>>>>> IMPORTANT: This is the Android Client ID you created in GCP <<<<<<<<<<
        // It ends with .apps.googleusercontent.com, but was created as 'Android' type with package name and SHA-1.
        googleAuthRequestOptions.androidClientId = '65095339408-thkvmvpim355119ni19orqtnqkov4ebu.apps.googleusercontent.com';

        // For Android custom development builds, expo-auth-session should handle the redirect implicitly.
        // However, if an explicit redirectUri is needed (e.g., for certain testing setups),
        // it would be based on the package name:
        // currentRedirectUri = makeRedirectUri({
        //     packageName: 'com.pranav01.NimtagApp',
        //     useProxy: false // Use false when in a custom dev client
        // });
        // googleAuthRequestOptions.redirectUri = currentRedirectUri; // Uncomment if explicitly needed
    } else if (Platform.OS === 'ios') {
        // If you're targeting iOS development build, create an iOS type client ID in GCP.
        // googleAuthRequestOptions.iosClientId = 'YOUR_IOS_CLIENT_ID_FROM_GCP';
        // currentRedirectUri = makeRedirectUri({
        //     bundleIdentifier: 'com.pranav01.NimtagApp', // Your iOS bundle identifier
        //     useProxy: false
        // });
        // googleAuthRequestOptions.redirectUri = currentRedirectUri;
    } else if (Platform.OS === 'web') {
        // For web builds (expo start --web), use makeRedirectUri with HTTPS scheme
        currentRedirectUri = makeRedirectUri({
            scheme: 'nimtagapp',
            // path: 'auth' // Add a path if your web redirect handler needs one
        });
        googleAuthRequestOptions.redirectUri = currentRedirectUri;
    }

    // Log the redirect URI only if explicitly set for the web platform
    if (Platform.OS === 'web' && currentRedirectUri) {
        console.log("Expo Generated Redirect URI for Google (WEB):", currentRedirectUri);
    }
    // --- END: CRITICAL FIX FOR GOOGLE LOGIN ---

    const [request, response, promptAsync] = Google.useAuthRequest(googleAuthRequestOptions);

    useEffect(() => {
        const authenticateWithFirebase = async () => {
            if (response?.type === 'success') {
                try {
                    const { id_token } = response.params;
                    const result = await AuthService.signInWithGoogleCredential(id_token);

                    if (result.success) {
                        Alert.alert('Success', 'Signed in with Google!');
                        navigation.navigate('QR Generator');
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

    // Cleanup on unmount (AuthService.cleanup is now an empty function for native builds)
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

        if (!phoneNumber.startsWith('+') || phoneNumber.length < 10) {
            Alert.alert('Error', 'Phone number must include country code (e.g., +1234567890).');
            return;
        }

        setLoading(true);
        const result = await AuthService.sendOTP(phoneNumber);

        if (result.success) {
            setConfirmationResult(result.confirmationResult);
            Alert.alert(
                'Success', 
                'OTP sent to your phone\n\n🧪 TEST MODE: Use code "123456"',
                [{ text: 'OK', style: 'default' }]
            );
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
            navigation.navigate('QR Generator');
        } else {
            Alert.alert('Error', result.error);
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

    // Safe boolean conversion functions
    const isGoogleButtonDisabled = () => {
        return !request || loading;
    };

    const isSendOTPDisabled = () => {
        return loading || !!confirmationResult;
    };

    const isVerifyOTPDisabled = () => {
        return loading;
    };

    const isResetButtonDisabled = () => {
        return loading;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Nimtag</Text>

            {/* Google Sign In */}
            <TouchableOpacity
                style={styles.googleButton}
                onPress={() => promptAsync()}
                disabled={isGoogleButtonDisabled()}
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
                        isSendOTPDisabled() ? styles.buttonDisabled : null
                    ]}
                    onPress={handleSendOTP}
                    disabled={isSendOTPDisabled()}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Sending...' : 'Send OTP'}
                    </Text>
                </TouchableOpacity>
            </View>

            {confirmationResult && (
                <View style={styles.otpContainer}>
                    <View style={styles.testModeContainer}>
                        <Text style={styles.testModeText}>
                            🧪 TEST MODE: Use OTP "123456"
                        </Text>
                    </View>
                    
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
                        disabled={isVerifyOTPDisabled()}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={resetPhoneAuth}
                        disabled={isResetButtonDisabled()}
                    >
                        <Text style={styles.resetButtonText}>
                            Use different number
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
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
    testModeContainer: {
        backgroundColor: '#fff3cd',
        padding: 10,
        borderRadius: 6,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ffeaa7',
    },
    testModeText: {
        color: '#856404',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
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
});

export default LoginScreen;