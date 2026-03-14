# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for Google Sign-In and Phone Number authentication in the HerbalKyore application.

## Table of Contents
1. [Create Firebase Project](#1-create-firebase-project)
2. [Enable Authentication Methods](#2-enable-authentication-methods)
3. [Configure Frontend](#3-configure-frontend)
4. [Configure Backend](#4-configure-backend)
5. [Testing](#5-testing)

---

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"** or select an existing project
3. Enter project name (e.g., "HerbalKyore")
4. Follow the setup wizard (Google Analytics is optional)
5. Click **"Create Project"**

---

## 2. Enable Authentication Methods

### Enable Google Sign-In

1. In Firebase Console, go to **Build** > **Authentication**
2. Click **"Get Started"** if first time
3. Go to **"Sign-in method"** tab
4. Click on **"Google"**
5. Toggle **"Enable"**
6. Add your support email
7. Click **"Save"**

### Enable Phone Authentication

1. In **"Sign-in method"** tab, click on **"Phone"**
2. Toggle **"Enable"**
3. Click **"Save"**

**Important for Phone Authentication:**
- For testing, you can add test phone numbers in **"Phone numbers for testing"** section
- Example: `+919999999999` with OTP `123456`
- For production, ensure you have proper billing enabled in Google Cloud Console

---

## 3. Configure Frontend

### Step 1: Get Firebase Config

1. In Firebase Console, click the **gear icon** ⚙️ > **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the **Web** icon `</>` to add a web app
4. Register app name (e.g., "HerbalKyore Web")
5. Copy the Firebase configuration object

### Step 2: Update Frontend .env File

Open `herbalkyore-ui/.env` and update with your Firebase credentials:

```env
REACT_APP_API_URL=http://localhost:5000/api

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### Step 3: Add Authorized Domains

1. In Firebase Console > **Authentication** > **Settings** tab
2. Scroll to **"Authorized domains"**
3. Add your domains:
   - `localhost` (for development)
   - Your production domain (e.g., `herbalkyore.com`)

---

## 4. Configure Backend

### Step 1: Generate Service Account Key

1. In Firebase Console, click **gear icon** ⚙️ > **"Project settings"**
2. Go to **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate Key"** - a JSON file will download
5. Save this file securely (DO NOT commit to version control)

### Step 2: Choose Configuration Method

#### **Option A: Using Service Account Key File (Recommended for Development)**

1. Rename the downloaded JSON file to `firebase-service-account.json`
2. Move it to `herbalkyore-backend/config/` directory
3. Add to `.gitignore`:
   ```
   config/firebase-service-account.json
   ```
4. Update `herbalkyore-backend/.env`:
   ```env
   FIREBASE_SERVICE_ACCOUNT_KEY=./config/firebase-service-account.json
   ```

#### **Option B: Using Environment Variables (Recommended for Production)**

Open the downloaded JSON file and extract these values:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
```

**Important:** 
- For `FIREBASE_PRIVATE_KEY`, keep the `\n` characters (newlines)
- Wrap the entire key in quotes
- The backend code will replace `\n` with actual newlines

---

## 5. Testing

### Test Phone Authentication

1. **Add Test Phone Number (Optional for Development):**
   - Firebase Console > Authentication > Sign-in method > Phone
   - Add test phone number: `+919876543210` with OTP: `123456`

2. **Start the application:**
   ```bash
   # Backend
   cd herbalkyore-backend
   npm start

   # Frontend (in another terminal)
   cd herbalkyore-ui
   npm start
   ```

3. **Test Login:**
   - Navigate to `/login` page
   - Enter phone number (without +91 prefix)
   - Click "Send OTP"
   - Enter the OTP received
   - Click "Verify OTP"

### Test Google Authentication

1. Click **"Continue with Google"** button
2. Select your Google account
3. Grant permissions
4. You should be logged in successfully

---

## Troubleshooting

### Common Issues

#### 1. "Firebase not initialized" error
- **Solution:** Check that all Firebase environment variables are set correctly
- Restart your backend server after updating `.env` file

#### 2. "reCAPTCHA client element has been removed"
- **Solution:** Make sure the `recaptcha-container` div exists in the Login component
- Check browser console for reCAPTCHA errors

#### 3. "auth/invalid-phone-number"
- **Solution:** Ensure phone number is in E.164 format (`+91` prefix is added automatically)
- Use valid Indian phone numbers starting with 6-9

#### 4. "auth/too-many-requests"
- **Solution:** Too many OTP requests. Wait a few minutes or use test phone numbers
- Enable billing on Google Cloud Console for production

#### 5. Google Sign-In popup blocked
- **Solution:** Allow popups in browser for localhost
- Check if authorized domains are configured correctly

#### 6. "Invalid token" after phone authentication
- **Solution:** Make sure backend Firebase Admin SDK is initialized properly
- Verify that project IDs match between frontend and backend

---

## Security Best Practices

1. **Never commit sensitive files:**
   - Add `firebase-service-account.json` to `.gitignore`
   - Never commit `.env` files with real credentials

2. **Use environment variables in production:**
   - Use Option B (environment variables) instead of service account file
   - Store credentials securely (e.g., AWS Secrets Manager, Azure Key Vault)

3. **Configure App Check (Optional but Recommended):**
   - Firebase Console > Build > App Check
   - Protects your app from abuse

4. **Set up Security Rules:**
   - Configure Firestore/Storage rules properly
   - Implement rate limiting

5. **Monitor Authentication:**
   - Check Firebase Console > Authentication > Users regularly
   - Set up alerts for suspicious activity

---

## Next Steps

After setting up Firebase authentication:

1. ✅ Remove Twilio dependencies (optional):
   ```bash
   cd herbalkyore-backend
   npm uninstall twilio
   ```

2. ✅ Test both authentication methods thoroughly

3. ✅ Update your database to reflect new user schema (firebaseUid, photoURL, provider)

4. ✅ Consider adding more Firebase features:
   - Cloud Firestore for real-time data
   - Cloud Storage for user uploads
   - Cloud Messaging for notifications

---

## Support

If you encounter any issues:

1. Check Firebase Console logs
2. Check browser developer console
3. Check backend server logs
4. Refer to [Firebase Documentation](https://firebase.google.com/docs/auth)

---

**Happy Coding! 🚀**
