# Migration Summary: Twilio OTP → Firebase Authentication

## What Changed

### ✅ Removed
- **Twilio OTP Service** - No longer using SMS-based OTP via Twilio
- Old authentication endpoints: `/send-otp`, `/verify-otp`, `/resend-otp`
- OTP fields from User model (`otp.code`, `otp.expiresAt`)
- Twilio-related methods and dependencies

### ✅ Added

#### Backend Changes
1. **Firebase Admin SDK Integration**
   - New file: `config/firebase.config.js` - Firebase Admin initialization
   - Firebase ID token verification
   - Support for multiple auth providers (Google, Phone)

2. **Updated User Model** (`models/User.model.js`)
   - Added: `firebaseUid` (primary Firebase identifier)
   - Added: `photoURL` (user profile picture)
   - Added: `provider` (auth method: google.com, phone, etc.)
   - Modified: `phoneNumber` and `email` are now optional (sparse index)
   - Removed: `otp` field and related methods

3. **Updated Auth Controller** (`controllers/auth.controller.js`)
   - New endpoint: `POST /api/auth/firebase-auth`
   - Accepts Firebase ID token
   - Creates or updates user based on Firebase UID
   - Returns JWT token for backend authentication

4. **Updated Auth Routes** (`routes/auth.routes.js`)
   - Simplified to single authentication endpoint
   - Removed OTP-related validation middleware

5. **Updated Environment Variables** (`.env`)
   - Removed: Twilio credentials (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, etc.)
   - Added: Firebase configuration (Project ID, Private Key, Client Email)

#### Frontend Changes
1. **Firebase SDK Integration**
   - New file: `src/config/firebase.config.js` - Firebase client initialization
   - Dependencies: `firebase` package

2. **Updated AuthContext** (`src/context/AuthContext.js`)
   - Added: `signInWithGoogle()` - Google authentication
   - Added: `sendPhoneOTP()` - Firebase phone OTP
   - Added: `verifyPhoneOTP()` - Verify phone OTP via Firebase
   - Added: reCAPTCHA verifier for phone auth
   - Removed: Old `sendOTP()`, `verifyOTP()`, `resendOTP()` methods

3. **Updated Login Component** (`src/components/Login.js`)
   - Added: Google Sign-In button with Google branding
   - Updated: Phone authentication now uses Firebase
   - Added: reCAPTCHA container for phone verification
   - Improved: Better error handling and user feedback

4. **Updated API Service** (`src/services/api.js`)
   - New endpoint: `firebaseAuth(idToken)` - Send Firebase token to backend
   - Removed: Old OTP endpoints

5. **Updated Styles** (`src/App.css`)
   - Added: Google button styling with hover effects
   - Added: Divider styling for "OR" separator
   - Added: reCAPTCHA container styling

6. **Updated Environment Variables** (`.env`)
   - Added: Firebase client configuration (API Key, Auth Domain, Project ID, etc.)

---

## Authentication Flow

### Google Sign-In Flow
```
User clicks "Continue with Google"
    ↓
Firebase popup opens
    ↓
User selects Google account
    ↓
Firebase returns ID token
    ↓
Frontend sends ID token to backend
    ↓
Backend verifies token with Firebase Admin
    ↓
Backend creates/updates user in MongoDB
    ↓
Backend returns JWT token
    ↓
User is authenticated
```

### Phone Number Flow
```
User enters phone number
    ↓
Frontend initializes reCAPTCHA
    ↓
Firebase sends OTP to phone
    ↓
User enters OTP
    ↓
Firebase verifies OTP
    ↓
Firebase returns ID token
    ↓
Frontend sends ID token to backend
    ↓
Backend verifies token with Firebase Admin
    ↓
Backend creates/updates user in MongoDB
    ↓
Backend returns JWT token
    ↓
User is authenticated
```

---

## What You Need to Do

### 1. Set Up Firebase Project
Follow the detailed instructions in **[FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)**

**Quick steps:**
1. Create Firebase project at https://console.firebase.google.com
2. Enable Google and Phone authentication methods
3. Get web app configuration (API keys)
4. Generate service account key for backend

### 2. Configure Backend

**Update `.env` file:**
```env
# Option 1: Using service account JSON file
FIREBASE_SERVICE_ACCOUNT_KEY=./config/firebase-service-account.json

# OR Option 2: Using environment variables (recommended for production)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### 3. Configure Frontend

**Update `herbalkyore-ui/.env` file:**
```env
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 4. Update Existing Users (Database Migration)

If you have existing users in your database, you may need to migrate them. Here's a sample migration script:

**Create: `herbalkyore-backend/scripts/migrateUsers.js`**
```javascript
const mongoose = require('mongoose');
const User = require('../models/User.model');
require('dotenv').config();

async function migrateUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);
    
    for (const user of users) {
      // Remove old OTP field
      user.otp = undefined;
      
      // You may want to set default values
      if (!user.provider) {
        user.provider = 'phone';
      }
      
      await user.save();
    }
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUsers();
```

**Run migration:**
```bash
cd herbalkyore-backend
node scripts/migrateUsers.js
```

### 5. Test Authentication

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd herbalkyore-backend
   npm start

   # Terminal 2 - Frontend
   cd herbalkyore-ui
   npm start
   ```

2. **Test Google Sign-In:**
   - Click "Continue with Google"
   - Select your Google account
   - Verify you can log in

3. **Test Phone Authentication:**
   - Enter a phone number
   - Receive and enter OTP
   - Verify you can log in

### 6. Optional: Clean Up

**Remove Twilio dependency (optional):**
```bash
cd herbalkyore-backend
npm uninstall twilio
```

**Delete old OTP service file:**
```bash
# You can delete this file as it's no longer needed
rm herbalkyore-backend/utils/otp.service.js
```

---

## Benefits of Firebase Authentication

✅ **No SMS costs** - Firebase Phone Auth includes free quota
✅ **Google Sign-In** - Professional OAuth2 implementation  
✅ **Better security** - Industry-standard authentication
✅ **Scalability** - Firebase handles millions of users
✅ **Multiple providers** - Can easily add Facebook, Twitter, etc.
✅ **Session management** - Built-in token refresh
✅ **Easy testing** - Test phone numbers without real SMS

---

## Important Notes

⚠️ **Breaking Changes:**
- Existing users will need to sign in again using Firebase
- Old OTP-based sessions are invalid
- User model structure has changed

⚠️ **Database:**
- User IDs remain the same (MongoDB `_id`)
- New field `firebaseUid` is the primary identifier from Firebase
- Old `otp` field is removed

⚠️ **Environment:**
- Both backend and frontend require Firebase configuration
- Ensure all Firebase environment variables are set before starting

---

## Support & Resources

- **Firebase Setup Guide:** [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)
- **Firebase Documentation:** https://firebase.google.com/docs/auth
- **Firebase Console:** https://console.firebase.google.com

---

**Migration completed successfully! 🎉**

If you encounter any issues, please refer to the troubleshooting section in the Firebase Setup Guide.
