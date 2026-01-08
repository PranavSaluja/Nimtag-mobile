// LoginScreen.js
import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
    Image,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import AuthService from './authService'; // Assuming authService.js is now in the project root, or adjust path if it's in a subfolder like 'services'

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
    // We'll separate country code and phone number for UI, but combine for Firebase
    const [countryCode, setCountryCode] = useState('+91'); // Default to +91
    const [localPhoneNumber, setLocalPhoneNumber] = useState(''); // For the 10-digit input field
    const [phoneNumberForFirebase, setPhoneNumberForFirebase] = useState(''); // Combined for actual auth

    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // useLayoutEffect to remove the navigation header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false, // This hides the header for this screen
        });
    }, [navigation]);

    // Update phoneNumberForFirebase whenever countryCode or localPhoneNumber changes
    useEffect(() => {
        // Simple validation to ensure localPhoneNumber is numeric before combining
        const formattedLocalPhone = localPhoneNumber.replace(/[^0-9]/g, ''); // Remove non-digits
        setPhoneNumberForFirebase(`${countryCode}${formattedLocalPhone}`);
    }, [countryCode, localPhoneNumber]);

    // --- START: CRITICAL FIX FOR GOOGLE LOGIN ---
    const googleAuthRequestOptions = {
        clientId: process.env.EXPO_PUBLIC_GOOGLE_SIGNIN_WEB_CLIENT_ID,
    };

    let currentRedirectUri = '';

    if (Platform.OS === 'android') {
        googleAuthRequestOptions.androidClientId =
            '65095339408-thkvmvpim355119ni19orqtnqkov4ebu.apps.googleusercontent.com';
    } else if (Platform.OS === 'ios') {
        // googleAuthRequestOptions.iosClientId = 'YOUR_IOS_CLIENT_ID_FROM_GCP';
    } else if (Platform.OS === 'web') {
        currentRedirectUri = makeRedirectUri({ scheme: 'nimtagapp' });
        googleAuthRequestOptions.redirectUri = currentRedirectUri;
    }

    if (Platform.OS === 'web' && currentRedirectUri) {
        console.log(
            'Expo Generated Redirect URI for Google (WEB):',
            currentRedirectUri
        );
    }
    // --- END: CRITICAL FIX FOR GOOGLE LOGIN ---

    const [request, response, promptAsync] = Google.useAuthRequest(
        googleAuthRequestOptions
    );

    useEffect(() => {
        const authenticateWithFirebase = async () => {
            if (response?.type === 'success') {
                try {
                    const { id_token } = response.params;
                    const result =
                        await AuthService.signInWithGoogleCredential(id_token);

                    if (result.success) {
                        Alert.alert('Success', 'Signed in with Google!');
                        navigation.navigate('MainTabs'); // <--- CHANGED FROM 'QR Generator'
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

    useEffect(() => {
        return () => {
            AuthService.cleanup();
        };
    }, []);

    const handleSendOTP = async () => {
        if (!phoneNumberForFirebase || phoneNumberForFirebase.length < 10) { // Basic length check
            Alert.alert('Error', 'Please enter a valid 10-digit phone number with country code.');
            return;
        }

        // Firebase Phone Auth expects the full E.164 format (+CCNNNNNNNNN)
        if (!phoneNumberForFirebase.startsWith('+')) {
            Alert.alert('Error', 'Phone number must include country code (e.g., +1234567890).');
            return;
        }

        setLoading(true);
        const result = await AuthService.sendOTP(phoneNumberForFirebase); // Use the combined number

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
            navigation.navigate('MainTabs'); // <--- CHANGED FROM 'QR Generator'
        } else {
            Alert.alert('Error', result.error);
            setOtp('');
        }
        setLoading(false);
    };

    const resetPhoneAuth = () => {
        setConfirmationResult(null);
        setOtp('');
        setLocalPhoneNumber(''); // Clear local phone number
        setPhoneNumberForFirebase(''); // Clear combined phone number
        AuthService.cleanup();
    };

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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    {/* NimTag Logo */}
                    <View style={styles.header}>
                        <Image
                            source={require('./assets/images/nimtag-logo-cropped.png')}
                            style={styles.logo}
                        />
                        {/* The NimTag text below the logo is kept from the original image (not the large "NimTag" title) */}
                    </View>

                    {/* Main Title / Description */}
                    <View style={styles.mainTitleContainer}>
                        <Text style={styles.mainTitle}>Create Your NimTag Account</Text>
                        <Text style={styles.description}>
                            It only takes a few seconds to get started.
                        </Text>
                    </View>

                    {/* Phone Number Input (with Country Code visual) */}
                    <View style={styles.phoneInputContainer}>
                        <View style={styles.countryCodePicker}>
                            <Text style={styles.countryCodeText}>IN {countryCode}</Text>
                            {/* In a real app, this would be a touchable opening a country picker modal */}
                            <Text style={styles.countryCodeDropdownArrow}>⌄</Text>
                        </View>
                        <TextInput
                            style={styles.phoneNumberInput}
                            placeholder="Enter 10-digit number"
                            value={localPhoneNumber}
                            onChangeText={setLocalPhoneNumber}
                            keyboardType="phone-pad"
                            maxLength={10} // For the 10-digit local part
                            editable={!confirmationResult}
                        />
                    </View>

                    {/* No password or referral code inputs */}

                    {/* Gold Bonus Text */}
                    <View style={styles.goldBonusContainer}>
                        <Image
                            source={require('./assets/images/gold-icon.png')} // Assuming you have a gold icon
                            style={styles.goldIcon}
                        />
                        <Text style={styles.goldBonusText}>
                            Earn bonus gold on signup – powered by Goldbck
                        </Text>
                    </View>

                    {/* Phone Auth Actions */}
                    {!confirmationResult ? (
                        <TouchableOpacity
                            style={[
                                styles.primaryButton,
                                isSendOTPDisabled() ? styles.buttonDisabled : null,
                            ]}
                            onPress={handleSendOTP}
                            disabled={isSendOTPDisabled()}
                        >
                            <Text style={styles.primaryButtonText}>
                                {loading ? 'Sending...' : 'Sign Up & Claim Gold'}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.otpContainer}>
                            <View style={styles.testModeContainer}>
                                <Text style={styles.testModeText}>
                                    🧪 TEST MODE: Use OTP "123456"
                                </Text>
                            </View>

                            <TextInput
                                style={styles.input} // Re-using basic input style for OTP
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChangeText={setOtp}
                                keyboardType="number-pad"
                                maxLength={6}
                            />

                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={handleVerifyOTP}
                                disabled={isVerifyOTPDisabled()}
                            >
                                <Text style={styles.primaryButtonText}>
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

                    {/* "Already have account" and "OR" moved to bottom */}
                    <Text style={styles.loginPrompt}>
                        Already have an account?{' '}
                        <Text
                            style={styles.loginLink}
                            onPress={() => Alert.alert('Navigate to Login')} // Placeholder
                        >
                            Log In
                        </Text>
                    </Text>

                    <Text style={styles.orSeparator}>OR</Text>

                    {/* Google Sign In */}
                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={() => promptAsync()}
                        disabled={isGoogleButtonDisabled()}
                    >
                        <Image
                            source={require('./assets/images/google-logo.png')}
                            style={styles.googleIcon}
                        />
                        <Text style={styles.googleButtonText}>
                            {loading ? 'Signing in...' : 'Continue with Google'}
                        </Text>
                    </TouchableOpacity>

                    {/* Terms & Privacy Policy */}
                    <Text style={styles.termsText}>
                        By continuing, you agree to our{' '}
                        <Text
                            style={styles.termsLink}
                            onPress={() => Alert.alert('Show Terms')}
                        >
                            Terms & Privacy Policy
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 30,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 25,
        backgroundColor: '#FFFFFF',
    },
    header: {
        alignItems: 'center',
        marginBottom: 0, // Reduced margin
    },
    logo: {
        width: 150, // Increased size
        height: 150, // Increased size
        resizeMode: 'contain',
        marginBottom: 0, // Reduced margin
    },
    mainTitleContainer: {
        alignItems: 'center',
        marginBottom: 30, // Adjust as needed
    },
    mainTitle: {
        fontSize: 24, // Slightly smaller than previous 'title' but prominent
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2E3D49',
        marginBottom: 5,
    },
    description: {
        fontSize: 15,
        textAlign: 'center',
        color: '#6A7E8F',
    },
    phoneInputContainer: {
        flexDirection: 'row', // Arrange side-by-side
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#F7F7F7',
        alignItems: 'center', // Vertically align items
    },
    countryCodePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15, // Match input padding
        borderRightWidth: 1,
        borderRightColor: '#E0E0E0',
        backgroundColor: '#F7F7F7', // Keep consistent background
    },
    countryCodeText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold', // Match reference image
    },
    countryCodeDropdownArrow: {
        fontSize: 14,
        color: '#333',
        marginLeft: 8, // Space between text and arrow
    },
    phoneNumberInput: {
        flex: 1, // Take remaining space
        paddingVertical: 15,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
    },
    input: { // Generic input style for OTP etc.
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#F7F7F7',
        fontSize: 16,
        color: '#333',
    },
    goldBonusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3CD',
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
        borderColor: '#FFEAA7',
        borderWidth: 1,
    },
    goldIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: 10,
    },
    goldBonusText: {
        flex: 1,
        fontSize: 14,
        color: '#856404',
        fontWeight: '500',
    },
    primaryButton: {
        backgroundColor: '#2E3D49',
        paddingVertical: 18,
        borderRadius: 10,
        marginBottom: 20,
    },
    primaryButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 17,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#B0B0B0',
    },
    loginPrompt: {
        textAlign: 'center',
        fontSize: 15,
        color: '#6A7E8F',
        marginBottom: 20,
        marginTop: 20, // Add some space above
    },
    loginLink: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
    orSeparator: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        color: '#A0A0A0',
        fontWeight: '500',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    googleButtonText: {
        color: '#4285F4',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    termsText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#888888',
        marginTop: 10,
        lineHeight: 20,
    },
    termsLink: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
    otpContainer: {
        marginTop: 5,
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
