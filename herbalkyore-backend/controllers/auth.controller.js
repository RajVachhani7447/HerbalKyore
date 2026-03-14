const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const { verifyIdToken } = require('../config/firebase.config');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your_secret_key', {
    expiresIn: '30d'
  });
};

// Firebase Login/Signup
exports.firebaseAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID Token is required'
      });
    }

    // Verify Firebase ID Token
    const verificationResult = await verifyIdToken(idToken);

    if (!verificationResult.success) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Firebase token',
        error: verificationResult.error
      });
    }

    const firebaseUser = verificationResult.user;

    // Find or create user
    let user = await User.findOne({ firebaseUid: firebaseUser.uid });

    if (!user) {
      // Create new user
      user = new User({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email || '',
        phoneNumber: firebaseUser.phoneNumber ? firebaseUser.phoneNumber.replace('+91', '') : '',
        name: firebaseUser.name || '',
        photoURL: firebaseUser.picture || '',
        provider: firebaseUser.provider,
        isVerified: true
      });

      await user.save();
    } else {
      // Update existing user info if needed
      let updated = false;
      
      if (firebaseUser.email && !user.email) {
        user.email = firebaseUser.email;
        updated = true;
      }
      
      if (firebaseUser.phoneNumber && !user.phoneNumber) {
        user.phoneNumber = firebaseUser.phoneNumber.replace('+91', '');
        updated = true;
      }
      
      if (firebaseUser.name && !user.name) {
        user.name = firebaseUser.name;
        updated = true;
      }
      
      if (firebaseUser.picture && !user.photoURL) {
        user.photoURL = firebaseUser.picture;
        updated = true;
      }

      if (!user.isVerified) {
        user.isVerified = true;
        updated = true;
      }

      if (updated) {
        await user.save();
      }
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        phoneNumber: user.phoneNumber,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        provider: user.provider
      }
    });

  } catch (error) {
    console.error('Firebase auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    // In a more complex system, you might want to blacklist the token
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};
