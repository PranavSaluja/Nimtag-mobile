import { auth } from './firebase';
import {
    GoogleAuthProvider,
    signInWithCredential,
    signOut,
    onAuthStateChanged,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from 'firebase/auth';

class AuthService {
    constructor() {
        this.auth = auth;
        this.currentUser = null;
        this.recaptchaVerifier = null;
    }

    // Initialize reCAPTCHA for phone authentication
    initializeRecaptcha() {
        if (!this.recaptchaVerifier) {
            this.recaptchaVerifier = new RecaptchaVerifier(
                'recaptcha-container',
                {
                    size: 'invisible',
                    callback: (response) => {
                        // reCAPTCHA solved, allow signInWithPhoneNumber
                        console.log('reCAPTCHA solved');
                    },
                    'expired-callback': () => {
                        // Response expired, ask user to solve reCAPTCHA again
                        console.log('reCAPTCHA expired');
                    }
                },
                this.auth
            );
        }
        return this.recaptchaVerifier;
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

    // Phone Sign In - Send OTP
    async sendOTP(phoneNumber) {
        try {
            // Initialize reCAPTCHA if not already done
            const recaptchaVerifier = this.initializeRecaptcha();
            
            const confirmationResult = await signInWithPhoneNumber(
                this.auth, 
                phoneNumber, 
                recaptchaVerifier
            );
            
            return {
                success: true,
                confirmationResult,
                message: 'OTP sent successfully',
            };
        } catch (error) {
            console.error('Send OTP error:', error);
            
            // Reset reCAPTCHA on error
            if (this.recaptchaVerifier) {
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
            
            // Clear reCAPTCHA after successful verification
            if (this.recaptchaVerifier) {
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

    // Sign Out
    async signOut() {
        try {
            await signOut(this.auth);
            
            // Clear reCAPTCHA on sign out
            if (this.recaptchaVerifier) {
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

    // Clean up reCAPTCHA
    cleanup() {
        if (this.recaptchaVerifier) {
            this.recaptchaVerifier.clear();
            this.recaptchaVerifier = null;
        }
    }
}

export default new AuthService();