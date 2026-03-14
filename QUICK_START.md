# 🚀 Quick Start Guide - HerbalKyore Full-Stack

## ⚡ FIRST TIME SETUP

### Step 1: Install MongoDB
```bash
# Option A: Docker (Recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Option B: Download from https://www.mongodb.com/try/download/community
```

### Step 2: Backend Setup
```bash
cd herbalkyore-backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env and set:
# - MONGODB_URI=mongodb://localhost:27017/herbalkyore
# - JWT_SECRET=your_secret_key_here
# (Twilio and Razorpay can be added later)

# Seed products to database
node scripts/seedProducts.js

# Start backend
npm run dev
```

### Step 3: Frontend Setup
```bash
cd herbalkyore-ui

# Install dependencies (if not already done)
npm install

# The .env file is already created

# Start frontend
npm start
```

## 🎯 QUICK START (After Setup)

### Option 1: Start Both Together
```bash
# Double-click this file:
start-fullstack.bat
```

### Option 2: Start Manually
```bash
# Terminal 1 - Backend
cd herbalkyore-backend
npm run dev

# Terminal 2 - Frontend
cd herbalkyore-ui
npm start
```

## 🧪 TEST THE APP

1. **Open Browser:** http://localhost:3000

2. **Test Login:**
   - Click "Login" button in header
   - Enter phone: `9876543210`
   - Click "Send OTP"
   - Check backend terminal for OTP (printed in dev mode)
   - Enter OTP and click "Verify"
   - You're logged in!

3. **Test Order:**
   - Browse products
   - Add to cart
   - Proceed to checkout (login required)
   - Fill address form
   - Payment modal opens (use test mode)

## 📍 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## 🔑 Test Credentials

**Development Mode (OTP printed to console):**
- Any phone number: `9876543210`
- OTP: Check backend terminal

## 🛠️ Troubleshooting

**Backend won't start:**
```bash
# Check MongoDB is running
mongosh

# Or restart MongoDB
docker restart mongodb
```

**Frontend can't connect:**
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check .env file in herbalkyore-ui
cat .env
```

**Port already in use:**
```bash
# Change port in herbalkyore-backend/.env
PORT=5001
```

## 📚 Features

✅ Mobile OTP Login
✅ User Profile Management
✅ Shopping Cart
✅ Order Management
✅ Order Tracking
✅ Payment Gateway (Razorpay)
✅ Protected Routes

## 📖 Full Documentation

See `INTEGRATION_GUIDE.md` for complete documentation.

---

**Happy Coding! 🎉**
