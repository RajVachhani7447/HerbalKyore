# Firebase Authentication - Quick Reference

## 🚀 Quick Start

### 1. Install Dependencies (Already Done ✓)
```bash
# Backend
cd herbalkyore-backend
npm install firebase-admin

# Frontend
cd herbalkyore-ui
npm install firebase
```

### 2. Configure Firebase

**Get Firebase Credentials:**
1. Go to https://console.firebase.google.com
2. Create/select project
3. Enable Authentication > Google & Phone
4. Get web config (for frontend)
5. Generate service account key (for backend)

**Update Environment Files:**

Backend `.env`:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

Frontend `.env`:
```env
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 3. Run Migration (If you have existing users)
```bash
cd herbalkyore-backend
node scripts/migrateUsers.js
```

### 4. Start Application
```bash
# Backend
cd herbalkyore-backend
npm start

# Frontend
cd herbalkyore-ui
npm start
```

---

## 📁 Files Modified

### Backend
- ✅ `config/firebase.config.js` - NEW: Firebase Admin initialization
- ✅ `controllers/auth.controller.js` - UPDATED: Firebase authentication
- ✅ `routes/auth.routes.js` - UPDATED: Simplified routes
- ✅ `models/User.model.js` - UPDATED: New schema fields
- ✅ `server.js` - UPDATED: Initialize Firebase
- ✅ `.env` - UPDATED: Firebase credentials
- ✅ `scripts/migrateUsers.js` - NEW: Database migration

### Frontend
- ✅ `src/config/firebase.config.js` - NEW: Firebase client initialization
- ✅ `src/context/AuthContext.js` - UPDATED: Firebase auth methods
- ✅ `src/components/Login.js` - UPDATED: Google + Phone UI
- ✅ `src/services/api.js` - UPDATED: Firebase auth endpoint
- ✅ `src/App.css` - UPDATED: Google button styling
- ✅ `.env` - UPDATED: Firebase config

### Documentation
- ✅ `FIREBASE_SETUP_GUIDE.md` - NEW: Complete setup guide
- ✅ `MIGRATION_SUMMARY.md` - NEW: Migration details
- ✅ `QUICK_REFERENCE.md` - NEW: This file

---

## 🔑 API Endpoints

### Old (Removed)
- ❌ `POST /api/auth/send-otp`
- ❌ `POST /api/auth/verify-otp`
- ❌ `POST /api/auth/resend-otp`

### New
- ✅ `POST /api/auth/firebase-auth` - Authenticate with Firebase ID token
- ✅ `POST /api/auth/logout` - Logout (unchanged)

---

## 💾 Database Schema Changes

### User Model - Old
```javascript
{
  phoneNumber: String (required, unique),
  email: String,
  name: String,
  otp: {
    code: String,
    expiresAt: Date
  },
  isVerified: Boolean,
  // ...
}
```

### User Model - New
```javascript
{
  firebaseUid: String (unique, sparse),
  phoneNumber: String (sparse),
  email: String (sparse),
  name: String,
  photoURL: String (NEW),
  provider: String (NEW - 'google.com'/'phone'),
  isVerified: Boolean,
  // ...
}
```

**Key Changes:**
- `firebaseUid` - Primary Firebase identifier
- `phoneNumber` & `email` - Now optional (not required)
- `otp` - Removed completely
- `photoURL` - Google profile picture
- `provider` - Authentication method used

---

## 🔐 Authentication Methods

### Google Sign-In
```javascript
// Frontend
const { signInWithGoogle } = useAuth();
const result = await signInWithGoogle();
```

### Phone Number
```javascript
// Frontend
const { sendPhoneOTP, verifyPhoneOTP } = useAuth();

// Send OTP
const result = await sendPhoneOTP(phoneNumber, 'recaptcha-container');
const confirmationResult = result.confirmationResult;

// Verify OTP
const verifyResult = await verifyPhoneOTP(confirmationResult, otp);
```

---

## 🧪 Testing

### Test Phone Numbers (Development)
Add in Firebase Console > Authentication > Sign-in method > Phone

Example:
- Phone: `+919876543210`
- OTP: `123456`

### Test Locally
1. Start backend: `npm start` (in herbalkyore-backend)
2. Start frontend: `npm start` (in herbalkyore-ui)
3. Navigate to: http://localhost:3000/login
4. Test both Google and Phone authentication

---

## ⚠️ Important Notes

1. **reCAPTCHA Required** - Phone auth needs reCAPTCHA (handled automatically)
2. **Authorized Domains** - Add localhost and your domain in Firebase Console
3. **Billing** - Production phone auth may require Firebase Blaze plan
4. **Security** - Never commit `.env` files or service account keys
5. **Session Management** - Firebase tokens expire, implement refresh logic if needed

---

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| Firebase not initialized | Check `.env` files and restart servers |
| reCAPTCHA errors | Check authorized domains in Firebase Console |
| Invalid phone number | Ensure format is `+91XXXXXXXXXX` |
| Too many requests | Wait or use test phone numbers |
| Google popup blocked | Allow popups in browser settings |

---

## 📚 Resources

- **Setup Guide:** [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)
- **Migration Details:** [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)
- **Firebase Docs:** https://firebase.google.com/docs/auth
- **Firebase Console:** https://console.firebase.google.com

---

## ✅ Next Steps

1. [ ] Create Firebase project
2. [ ] Enable Google & Phone authentication
3. [ ] Update `.env` files with Firebase credentials
4. [ ] Run user migration script (if needed)
5. [ ] Test authentication thoroughly
6. [ ] Deploy to production
7. [ ] Monitor Firebase Console for auth events

---

**Need Help?** Check [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md) for detailed instructions.
