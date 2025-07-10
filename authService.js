import { auth } from './firebase';
import {
    GoogleAuthProvider,
    signInWithCredential,
    signOut,
    onAuthStateChanged,
    PhoneAuthProvider,
    signInWithCredential as signInWithPhoneCredential,
} from 'firebase/auth';
import { Platform } from 'react-native';

class AuthService {
    constructor() {
        this.auth = auth;
        this.currentUser = null;
        this.verificationId = null;
    }

    // Google Sign-In with credential
    async signInWithGoogleCredential(idToken) {
        try {
            const credential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(this.auth, credential);

            return {
                success: true,
                user: userCredential.user,
            };
        } catch (error) {
            console.error('Firebase Google sign-in error:', error);
            return { success: false, error: error.message };
        }
    }

    // Phone Sign In - Send OTP (React Native approach)
    async sendOTP(phoneNumber) {
        try {
            // For React Native, we need to use a different approach
            // This requires setting up Firebase App Check or using a custom backend
            
            // Method 1: Using PhoneAuthProvider (requires Firebase App Check)
            if (Platform.OS !== 'web') {
                // For native platforms, you'll need to implement server-side verification
                // or use Firebase App Check. Here's a simplified approach:
                
                // This is a placeholder - you'll need to implement server-side OTP
                // or use Firebase App Check for production
                console.warn('Native phone auth requires additional setup. See comments in code.');
                console.log('📱 TESTING MODE: Use OTP "123456" for phone:', phoneNumber);
                
                // Store the phone number for verification
                this.testPhoneNumber = phoneNumber;
                
                // For now, return a mock confirmation result for testing
                return {
                    success: true,
                    confirmationResult: {
                        verificationId: 'mock-verification-id',
                        phoneNumber: phoneNumber,
                        confirm: async (code) => {
                            // This would normally verify with Firebase
                            // For testing, we'll simulate success
                            if (code === '123456') {
                                return {
                                    user: {
                                        uid: `mock-user-${Date.now()}`,
                                        phoneNumber: phoneNumber,
                                        displayName: `User ${phoneNumber}`,
                                    }
                                };
                            } else {
                                throw new Error('Invalid verification code. Use "123456" for testing.');
                            }
                        }
                    },
                    message: 'OTP sent successfully (TEST MODE - Use 123456)',
                };
            }

            // Web platform implementation would go here
            // This requires reCAPTCHA setup in your web app
            const { RecaptchaVerifier, signInWithPhoneNumber } = require('firebase/auth');
            
            if (!this.recaptchaVerifier) {
                this.recaptchaVerifier = new RecaptchaVerifier(
                    'recaptcha-container',
                    {
                        size: 'invisible',
                        callback: (response) => {
                            console.log('reCAPTCHA solved');
                        },
                    },
                    this.auth
                );
            }

            const confirmationResult = await signInWithPhoneNumber(
                this.auth,
                phoneNumber,
                this.recaptchaVerifier
            );

            return {
                success: true,
                confirmationResult,
                message: 'OTP sent successfully',
            };

        } catch (error) {
            console.error('Send OTP error:', error);
            
            if (Platform.OS === 'web' && this.recaptchaVerifier) {
                this.recaptchaVerifier.clear();
                this.recaptchaVerifier = null;
            }

            return { success: false, error: error.message };
        }
    }

    // Phone Sign In - Verify OTP
    async verifyOTP(confirmationResult, otp) {
        try {
            const result = await confirmationResult.confirm(otp);

            if (Platform.OS === 'web' && this.recaptchaVerifier) {
                this.recaptchaVerifier.clear();
                this.recaptchaVerifier = null;
            }

            return {
                success: true,
                user: result.user,
            };
        } catch (error) {
            console.error('Verify OTP error:', error);
            return { success: false, error: error.message };
        }
    }

    // Alternative: Server-side phone authentication
    async sendOTPViaServer(phoneNumber) {
        try {
            // This would call your backend API that handles Firebase Admin SDK
            const response = await fetch('YOUR_BACKEND_URL/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber }),
            });

            const data = await response.json();
            
            if (data.success) {
                return {
                    success: true,
                    sessionId: data.sessionId, // Your server's session identifier
                    message: 'OTP sent successfully',
                };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Server OTP error:', error);
            return { success: false, error: error.message };
        }
    }

    async verifyOTPViaServer(sessionId, otp) {
        try {
            const response = await fetch('YOUR_BACKEND_URL/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId, otp }),
            });

            const data = await response.json();
            
            if (data.success) {
                // Sign in with custom token received from server
                const { signInWithCustomToken } = require('firebase/auth');
                const userCredential = await signInWithCustomToken(this.auth, data.customToken);
                
                return {
                    success: true,
                    user: userCredential.user,
                };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Server verify OTP error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign Out
    async signOut() {
        try {
            await signOut(this.auth);

            if (Platform.OS === 'web' && this.recaptchaVerifier) {
                this.recaptchaVerifier.clear();
                this.recaptchaVerifier = null;
            }

            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    // Auth state listener
    onAuthStateChanged(callback) {
        return onAuthStateChanged(this.auth, callback);
    }

    // Get current user
    getCurrentUser() {
        return this.auth.currentUser;
    }

    // Cleanup
    cleanup() {
        if (Platform.OS === 'web' && this.recaptchaVerifier) {
            this.recaptchaVerifier.clear();
            this.recaptchaVerifier = null;
        }
    }
}

export default new AuthService();