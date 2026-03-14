const twilio = require('twilio');

// Initialize Twilio client
let twilioClient = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

// Send OTP via Twilio
exports.sendOTPViaTwilio = async (phoneNumber, otp) => {
  try {
    if (!twilioClient) {
      console.warn('Twilio not configured. OTP:', otp);
      return false;
    }

    const message = await twilioClient.messages.create({
      body: `Your HerbalKyore OTP is: ${otp}. Valid for 10 minutes. Do not share this with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`
    });

    console.log('✓ OTP sent via Twilio:', message.sid);
    return true;

  } catch (error) {
    console.error('✗ Twilio SMS error:', error.message);
    // Fallback to console in case of error
    console.log(`\n📱 OTP for ${phoneNumber}: ${otp}\n`);
    return false;
  }
};

// Send OTP via console (for development)
exports.sendOTPViaConsole = (phoneNumber, otp) => {
  console.log('\n' + '='.repeat(50));
  console.log('📱 OTP SENT (Development Mode)');
  console.log('='.repeat(50));
  console.log(`Phone: ${phoneNumber}`);
  console.log(`OTP: ${otp}`);
  console.log(`Expires: 10 minutes`);
  console.log('='.repeat(50) + '\n');
};

// Alternative: Send OTP via SMS Gateway API (MSG91, TextLocal, etc.)
exports.sendOTPViaSMSGateway = async (phoneNumber, otp) => {
  // Implement your preferred SMS gateway here
  // Example: MSG91, TextLocal, Kaleyra, etc.
  console.log(`SMS Gateway OTP for ${phoneNumber}: ${otp}`);
};
