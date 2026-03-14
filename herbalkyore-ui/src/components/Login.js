import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const { signInWithGoogle, sendPhoneOTP, verifyPhoneOTP, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    const result = await signInWithGoogle();
    setLoading(false);

    if (result.success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate phone number
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    const result = await sendPhoneOTP(phoneNumber, 'recaptcha-container');
    setLoading(false);

    if (result.success) {
      setConfirmationResult(result.confirmationResult);
      setStep('otp');
    } else {
      setError(result.message);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    const result = await verifyPhoneOTP(confirmationResult, otp);
    setLoading(false);

    if (result.success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  const handleBack = () => {
    setStep('phone');
    setOtp('');
    setError('');
    setConfirmationResult(null);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to HerbalKyore</h2>
        
        {step === 'phone' ? (
          <>
            {/* Google Sign In Button */}
            <button 
              type="button" 
              className="btn-google" 
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                  <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                </g>
              </svg>
              {loading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            {/* Phone Number Login */}
            <form onSubmit={handlePhoneSubmit}>
              <div className="form-group">
                <label htmlFor="phoneNumber">Mobile Number</label>
                <div className="phone-input">
                  <span className="country-code">+91</span>
                  <input
                    type="tel"
                    id="phoneNumber"
                    placeholder="Enter 10-digit number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>

            {/* reCAPTCHA container */}
            <div id="recaptcha-container"></div>
          </>
        ) : (
          <form onSubmit={handleOTPSubmit}>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <p className="otp-sent-message">
                OTP sent to +91 {phoneNumber}
                <button type="button" className="btn-link" onClick={handleBack}>
                  Change
                </button>
              </p>
              <input
                type="text"
                id="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                disabled={loading}
                autoFocus
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
