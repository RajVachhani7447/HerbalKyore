import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../config/firebase.config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setAuthToken(token);
      setUser(JSON.parse(savedUser));
      // Fetch fresh user data
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If profile fetch fails, clear auth
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Initialize reCAPTCHA verifier
  const initRecaptcha = (containerId) => {
    if (!recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });
      setRecaptchaVerifier(verifier);
      return verifier;
    }
    return recaptchaVerifier;
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Send to backend for verification and JWT generation
      const response = await authAPI.firebaseAuth(idToken);
      
      if (response.data.success) {
        const { token, user: userData } = response.data;
        
        // Save to state and localStorage
        setAuthToken(token);
        setUser(userData);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return { success: true, user: userData };
      }
      
      return { success: false, message: 'Authentication failed' };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        message: error.message || 'Failed to sign in with Google',
      };
    }
  };

  // Send OTP to phone number
  const sendPhoneOTP = async (phoneNumber, recaptchaContainer) => {
    try {
      const verifier = initRecaptcha(recaptchaContainer);
      const formattedPhone = `+91${phoneNumber}`;
      
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      
      return { 
        success: true, 
        confirmationResult,
        message: 'OTP sent successfully' 
      };
    } catch (error) {
      console.error('Phone OTP error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send OTP',
      };
    }
  };

  // Verify phone OTP
  const verifyPhoneOTP = async (confirmationResult, otp) => {
    try {
      const result = await confirmationResult.confirm(otp);
      const firebaseUser = result.user;
      
      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Send to backend for verification and JWT generation
      const response = await authAPI.firebaseAuth(idToken);
      
      if (response.data.success) {
        const { token, user: userData } = response.data;
        
        // Save to state and localStorage
        setAuthToken(token);
        setUser(userData);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return { success: true, user: userData };
      }
      
      return { success: false, message: 'Verification failed' };
    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        message: error.message || 'Failed to verify OTP',
      };
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state and localStorage
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const response = await userAPI.updateProfile(profileData);
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return { success: true };
      }
      return { success: false, message: 'Update failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
      };
    }
  };

  const value = {
    user,
    authToken,
    loading,
    isAuthenticated: !!authToken,
    signInWithGoogle,
    sendPhoneOTP,
    verifyPhoneOTP,
    logout,
    updateUserProfile,
    refreshUser: fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
