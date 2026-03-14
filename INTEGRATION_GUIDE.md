# Frontend-Backend Integration Guide

## 🎯 Overview

Your HerbalKyore project now has complete frontend-backend integration with:
- ✅ Mobile OTP Authentication
- ✅ User Profile Management
- ✅ Order Tracking System
- ✅ Razorpay Payment Gateway
- ✅ Protected Routes
- ✅ API Integration Layer

## 📁 Project Structure

```
HITUMAMA PROJECT/
├── herbalkyore-ui/          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js            # OTP Login Component
│   │   │   ├── ProtectedRoute.js   # Auth Guard
│   │   │   └── RazorpayPayment.js  # Payment Integration
│   │   ├── context/
│   │   │   ├── AuthContext.js      # Authentication State
│   │   │   └── CartContext.js      # Cart State
│   │   ├── pages/
│   │   │   ├── Profile.js          # User Profile
│   │   │   ├── Orders.js           # Order List
│   │   │   └── OrderDetail.js      # Order Details
│   │   └── services/
│   │       └── api.js              # Backend API Service
│   └── package.json
│
└── herbalkyore-backend/     # Node.js Backend
    ├── models/              # MongoDB Models
    ├── controllers/         # Business Logic
    ├── routes/             # API Routes
    ├── middleware/         # Auth & Validation
    └── server.js           # Express Server
```

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend
cd herbalkyore-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
# - MongoDB URI (local or Atlas)
# - JWT Secret
# - Twilio credentials (for OTP)
# - Razorpay keys

# Seed database with products
node scripts/seedProducts.js

# Start backend server
npm run dev
```

Backend will run at: **http://localhost:5000**

### 2. Frontend Setup

```bash
# Navigate to frontend
cd herbalkyore-ui

# Install dependencies (if not already done)
npm install

# Create environment file
cp .env.example .env

# Edit .env
# REACT_APP_API_URL=http://localhost:5000/api

# Start frontend
npm start
```

Frontend will run at: **http://localhost:3000**

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/herbalkyore
JWT_SECRET=your_super_secret_key_here

# Twilio for OTP
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📱 Features Implemented

### 1. Authentication System

**Login Flow:**
1. User enters mobile number
2. OTP sent via Twilio (or console in dev mode)
3. User enters OTP
4. JWT token generated and stored
5. User redirected to previous page or home

**Components:**
- `Login.js` - OTP login interface
- `AuthContext.js` - Authentication state management
- `ProtectedRoute.js` - Route guard for authenticated pages

### 2. User Profile

**Features:**
- View profile information
- Edit name and email
- View phone number (read-only)
- Quick access to orders and logout

**Route:** `/profile` (protected)

### 3. Order Management

**Order Creation:**
1. Add items to cart
2. Proceed to checkout (requires login)
3. Enter shipping address
4. Payment via Razorpay
5. Order created and stored in MongoDB

**Order Tracking:**
- View all orders (`/orders`)
- Order status timeline
- Payment status
- Shipping address
- Order cancellation (if pending)

**Routes:**
- `/orders` - List all orders (protected)
- `/order/:orderId` - Order details (protected)

### 4. Payment Integration

**Razorpay Integration:**
- Payment gateway loaded dynamically
- Order creation before payment
- Payment verification after completion
- Order status updated automatically

**Process:**
1. User completes address form
2. Order created in backend
3. Razorpay payment modal opens
4. Payment processed
5. Backend verifies payment signature
6. Order status updated to "confirmed"

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/send-otp        # Send OTP
POST /api/auth/verify-otp      # Verify OTP & Login
POST /api/auth/resend-otp      # Resend OTP
```

### User
```
GET  /api/users/profile        # Get profile
PUT  /api/users/profile        # Update profile
POST /api/users/addresses      # Add address
GET  /api/users/orders         # Get user orders
```

### Products
```
GET  /api/products             # Get all products
GET  /api/products/:productId  # Get product details
```

### Orders
```
POST /api/orders               # Create order
GET  /api/orders/user/all      # Get all user orders
GET  /api/orders/:orderId      # Get order details
PUT  /api/orders/:orderId/cancel # Cancel order
```

### Payments
```
POST /api/payments/razorpay/create-order  # Create Razorpay order
POST /api/payments/razorpay/verify        # Verify payment
```

## 🧪 Testing the Integration

### Test Login (Development Mode)

1. Start backend: `npm run dev` in `herbalkyore-backend/`
2. Start frontend: `npm start` in `herbalkyore-ui/`
3. Go to http://localhost:3000/login
4. Enter phone number: `9876543210`
5. Click "Send OTP"
6. Check backend console for OTP (printed in dev mode)
7. Enter OTP and verify
8. You're logged in!

### Test Order Flow

1. Log in first
2. Add products to cart
3. Go to cart and proceed to checkout
4. Fill shipping address
5. Test payment (use Razorpay test mode)
6. View order in `/orders`

## 🛡️ Security Features

✅ JWT token authentication
✅ Protected routes requiring login
✅ OTP verification for login
✅ Payment signature verification
✅ Input validation on backend
✅ CORS configuration
✅ Helmet security headers

## 📊 Development vs Production

### Development
- OTP printed to console (no Twilio needed)
- MongoDB local or Atlas
- Test payment keys
- CORS allows localhost

### Production
- Real Twilio SMS for OTP
- MongoDB Atlas recommended
- Live payment keys
- CORS restricted to domain
- HTTPS required
- Environment variables in hosting platform

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
mongosh

# Check .env file exists
ls -la .env

# Install dependencies again
npm install
```

### Frontend can't connect to backend
```bash
# Check REACT_APP_API_URL in .env
cat .env

# Verify backend is running
curl http://localhost:5000/api/health
```

### OTP not received
- In development, check backend console
- In production, verify Twilio credentials
- Check phone number format (10 digits, starts with 6-9)

### Payment fails
- Verify Razorpay keys in .env
- Check Razorpay script loads (network tab)
- Use test card: 4111 1111 1111 1111

## 📚 Next Steps

- [ ] Add email notifications (order confirmation)
- [ ] Implement address management UI
- [ ] Add product reviews and ratings
- [ ] Create admin panel for order management
- [ ] Add order tracking with courier integration
- [ ] Implement wishlist feature
- [ ] Add discount codes/coupons
- [ ] Setup email authentication option
- [ ] Add analytics dashboard

## 🆘 Support

For issues:
1. Check console errors (browser & backend)
2. Verify all environment variables set
3. Ensure MongoDB is running
4. Check API responses in Network tab

---

**© 2026 HerbalKyore. All rights reserved.**
