import {
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebaseConfig';

class AuthService {
    constructor() {
        this.auth = auth;
        this.currentUser = null;
        this.recaptchaVerifier = null;
    }

    // Google Sign In
    async signInWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(this.auth, provider);
            return {
                success: true,
                user: result.user,
                credential: GoogleAuthProvider.credentialFromResult(result)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Phone Sign In - Step 1: Send OTP
    async sendOTP(phoneNumber) {
        try {
            // Create RecaptchaVerifier if not exists
            if (!this.recaptchaVerifier) {
                this.recaptchaVerifier = new RecaptchaVerifier(
                    'recaptcha-container',
                    {
                        size: 'invisible',
                        callback: (response) => {
                            console.log('reCAPTCHA verified');
                        }
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
                message: 'OTP sent successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Phone Sign In - Step 2: Verify OTP
    async verifyOTP(confirmationResult, otp) {
        try {
            const result = await confirmationResult.confirm(otp);
            return {
                success: true,
                user: result.user
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Sign Out
    async signOut() {
        try {
            await signOut(this.auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Listen to auth state changes
    onAuthStateChanged(callback) {
        return onAuthStateChanged(this.auth, callback);
    }

    // Get current user
    getCurrentUser() {
        return this.auth.currentUser;
    }
}

export default new AuthService();