const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Firebase UID - primary identifier
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true
  },
  phoneNumber: {
    type: String,
    trim: true,
    sparse: true,
    match: /^[6-9]\d{9}$/ // Indian phone number validation
  },
  name: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true
  },
  photoURL: {
    type: String,
    default: ''
  },
  provider: {
    type: String,
    enum: ['google.com', 'phone', 'password', 'facebook.com'],
    default: 'phone'
  },
  addresses: [{
    fullname: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    PIN: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
userSchema.index({ firebaseUid: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
