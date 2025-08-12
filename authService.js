import { auth } from './firebase'; // Assuming 'firebase.js' is in the same directory as AuthService.js
import {
    GoogleAuthProvider,
    signInWithCredential,
    signOut,
    onAuthStateChanged,
    PhoneAuthProvider,
    signInWithPhoneNumber,
    RecaptchaVerifier,
} from 'firebase/auth';
import { Platform } from 'react-native';

class AuthService {
    constructor() {
        this.auth = auth;
        this.currentUser = null;
        this.verificationId = null;
        this.recaptchaVerifier = null; // Initialize recaptchaVerifier
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
            if (Platform.OS === 'web') {
                // For web, we MUST use reCAPTCHA
                if (!this.recaptchaVerifier) {
                    this.recaptchaVerifier = new RecaptchaVerifier(
                        'recaptcha-container', // Element ID in your web/index.html
                        {
                            size: 'invisible',
                            callback: (response) => {
                                console.log('reCAPTCHA solved:', response);
                            },
                            'expired-callback': () => {
                                console.log('reCAPTCHA expired');
                            },
                        },
                        this.auth
                    );
                }

                console.log('Attempting to send OTP via web (with reCAPTCHA)...');
                const confirmationResult = await signInWithPhoneNumber(
                    this.auth,
                    phoneNumber,
                    this.recaptchaVerifier
                );
                this.recaptchaVerifier.clear();
                this.recaptchaVerifier = null;

                return {
                    success: true,
                    confirmationResult,
                    message: 'OTP sent successfully (Web)',
                };

            } else {
                // --- TEST MODE FOR NATIVE PLATFORMS (Android/iOS) ---
                console.warn('Native phone auth is in TEST MODE. Real OTP requires Firebase App Check setup.');
                console.log('📱 TESTING MODE: Use OTP "123456" for phone:', phoneNumber);

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

        } catch (error) {
            console.error('Send OTP error:', error);
            if (Platform.OS === 'web' && this.recaptchaVerifier) {
                this.recaptchaVerifier.clear();
                this.recaptchaVerifier = null;
            }
            let errorMessage = error.message;
            if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many requests. Please try again later.';
            } else if (error.code === 'auth/invalid-phone-number') {
                errorMessage = 'Invalid phone number format.';
            } else if (error.code === 'auth/app-not-authorized') {
                errorMessage = 'App not authorized. Ensure SHA-1/APNs are correct and App Check is configured (if using real OTP on native).';
            }
            return { success: false, error: errorMessage };
        }
    }

    // Phone Sign In - Verify OTP
    async verifyOTP(confirmationResult, otp) {
        try {
            const result = await confirmationResult.confirm(otp);
            return {
                success: true,
                user: result.user,
            };
        } catch (error) {
            console.error('Verify OTP error:', error);
            let errorMessage = error.message;
            if (error.code === 'auth/invalid-verification-code') {
                errorMessage = 'Invalid OTP. Please try again.';
            } else if (error.code === 'auth/code-expired') {
                errorMessage = 'OTP has expired. Please request a new one.';
            }
            return { success: false, error: errorMessage };
        }
    }

    // Server-side phone authentication (Keeping as placeholder)
    async sendOTPViaServer(phoneNumber) {
        return { success: false, error: "Server-side OTP not implemented for this flow." };
    }

    async verifyOTPViaServer(sessionId, otp) {
        return { success: false, error: "Server-side OTP verification not implemented for this flow." };
    }

    // Sign Out
    async signOut() {
        try {
            await signOut(this.auth);
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

    // Cleanup (simplified as recaptcha is cleared in sendOTP)
    cleanup() {
        console.log("AuthService cleanup complete.");
    }
}

export default new AuthService();