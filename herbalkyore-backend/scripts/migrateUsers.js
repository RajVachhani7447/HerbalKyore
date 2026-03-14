const mongoose = require('mongoose');
const User = require('../models/User.model');
require('dotenv').config();

/**
 * Migration Script: Remove OTP fields from existing users
 * This script updates existing users in the database to match the new Firebase-based schema
 */

async function migrateUsers() {
  try {
    console.log('Starting user migration...');
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/herbalkyore', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✓ Connected to MongoDB');
    
    // Find all users
    const users = await User.find({});
    console.log(`\nFound ${users.length} users to migrate`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const user of users) {
      let updated = false;
      
      // Remove OTP field if exists
      if (user.otp) {
        user.otp = undefined;
        updated = true;
      }
      
      // Set default provider if not set
      if (!user.provider) {
        user.provider = 'phone';
        updated = true;
      }
      
      // Ensure isVerified is set (users who had verified OTPs should remain verified)
      if (user.isVerified === undefined) {
        user.isVerified = false;
        updated = true;
      }
      
      if (updated) {
        await user.save();
        migratedCount++;
        console.log(`✓ Migrated user: ${user.phoneNumber || user.email || user._id}`);
      } else {
        skippedCount++;
        console.log(`- Skipped user (already migrated): ${user.phoneNumber || user.email || user._id}`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('Migration Summary:');
    console.log('='.repeat(50));
    console.log(`Total users: ${users.length}`);
    console.log(`Migrated: ${migratedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log('='.repeat(50));
    console.log('\n✓ Migration completed successfully!');
    
    await mongoose.connection.close();
    console.log('✓ Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run migration
migrateUsers();
