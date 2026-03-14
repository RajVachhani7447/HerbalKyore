const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Firebase authentication (Google & Phone)
router.post('/firebase-auth', authController.firebaseAuth);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
