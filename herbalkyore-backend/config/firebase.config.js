const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You need to download your Firebase service account key JSON file
// and set the path in the environment variable FIREBASE_SERVICE_ACCOUNT_KEY
// Or you can directly initialize with the JSON object

let firebaseApp = null;

const initializeFirebase = () => {
  try {
    if (firebaseApp) {
      return firebaseApp;
    }

    // Option 1: Using service account key file path
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    } 
    // Option 2: Using environment variables for credentials
    else if (process.env.FIREBASE_PROJECT_ID && 
             process.env.FIREBASE_PRIVATE_KEY && 
             process.env.FIREBASE_CLIENT_EMAIL) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        }),
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    } else {
      console.warn('Firebase Admin SDK not configured. Please set Firebase credentials in .env file');
    }

    console.log('✓ Firebase Admin SDK initialized');
    return firebaseApp;

  } catch (error) {
    console.error('✗ Firebase initialization error:', error.message);
    return null;
  }
};

// Verify Firebase ID Token
const verifyIdToken = async (idToken) => {
  try {
    if (!firebaseApp) {
      initializeFirebase();
    }

    if (!firebaseApp) {
      throw new Error('Firebase not initialized');
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return {
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        phoneNumber: decodedToken.phone_number,
        name: decodedToken.name,
        picture: decodedToken.picture,
        provider: decodedToken.firebase.sign_in_provider
      }
    };
  } catch (error) {
    console.error('Token verification error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  initializeFirebase,
  verifyIdToken,
  admin
};
