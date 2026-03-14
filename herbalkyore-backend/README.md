# HerbalKyore Backend API

Node.js + Express + MongoDB backend for HerbalKyore e-commerce platform with OTP authentication and payment gateway integration.

## Features

- 🔐 **Mobile OTP Authentication** (Twilio integration)
- 💳 **Payment Gateway Integration** (Razorpay + Stripe)
- 📦 **Order Management** with tracking
- 👤 **User Profile & Address Management**
- 🛍️ **Product Catalog Management**
- 📊 **Order History & Status Tracking**
- 🔒 **JWT-based Authentication**
- ✅ **Input Validation & Security**

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + OTP (Twilio)
- **Payment:** Razorpay & Stripe
- **Security:** Helmet, CORS
- **Validation:** express-validator

## Installation

### 1. Install Dependencies

```bash
cd herbalkyore-backend
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Or use Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Use in `.env` file

### 3. Environment Configuration

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/herbalkyore

JWT_SECRET=your_super_secret_key_here

# Twilio (for OTP)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Stripe (optional)
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable

FRONTEND_URL=http://localhost:3000
```

### 4. Seed Database

```bash
node scripts/seedProducts.js
```

### 5. Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs at: **http://localhost:5000**

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/send-otp` | Send OTP to phone |
| POST | `/api/auth/verify-otp` | Verify OTP & login |
| POST | `/api/auth/resend-otp` | Resend OTP |

### User Profile

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get user profile | ✅ |
| PUT | `/api/users/profile` | Update profile | ✅ |
| POST | `/api/users/addresses` | Add address | ✅ |
| PUT | `/api/users/addresses/:id` | Update address | ✅ |
| DELETE | `/api/users/addresses/:id` | Delete address | ✅ |
| GET | `/api/users/orders` | Get user orders | ✅ |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:productId` | Get product by ID |
| GET | `/api/products/search/:query` | Search products |
| GET | `/api/products/filter/type/:type` | Filter by type |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create order | ✅ |
| GET | `/api/orders/:orderId` | Get order details | ✅ |
| GET | `/api/orders/user/all` | Get all user orders | ✅ |
| PUT | `/api/orders/:orderId/cancel` | Cancel order | ✅ |

### Payments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payments/razorpay/create-order` | Create Razorpay order | ✅ |
| POST | `/api/payments/razorpay/verify` | Verify Razorpay payment | ✅ |
| POST | `/api/payments/stripe/create-intent` | Create Stripe intent | ✅ |
| POST | `/api/payments/stripe/verify` | Verify Stripe payment | ✅ |

## Usage Examples

### 1. Send OTP
```javascript
POST /api/auth/send-otp
{
  "phoneNumber": "9876543210"
}
```

### 2. Verify OTP & Login
```javascript
POST /api/auth/verify-otp
{
  "phoneNumber": "9876543210",
  "otp": "123456"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

### 3. Create Order (with auth token)
```javascript
POST /api/orders
Headers: {
  "Authorization": "Bearer jwt_token_here"
}
Body: {
  "items": [
    {
      "productId": "product_id_here",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "fullname": "John Doe",
    "phone": "9876543210",
    "address": "123 Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "PIN": "400001"
  }
}
```

### 4. Create Payment Order
```javascript
POST /api/payments/razorpay/create-order
Headers: {
  "Authorization": "Bearer jwt_token_here"
}
Body: {
  "amount": 1000,
  "currency": "INR"
}
```

## Development Mode

In development, OTPs are printed to console instead of sending SMS:

```
==================================================
📱 OTP SENT (Development Mode)
==================================================
Phone: 9876543210
OTP: 123456
Expires: 10 minutes
==================================================
```

## Production Setup

1. **Set NODE_ENV:**
```env
NODE_ENV=production
```

2. **Configure Twilio** for real SMS
3. **Setup Payment Gateways:**
   - Get Razorpay live keys
   - Get Stripe live keys
4. **Use MongoDB Atlas** for cloud database
5. **Deploy to cloud** (AWS, Heroku, DigitalOcean)

## Security Best Practices

✅ All passwords/secrets in `.env`
✅ JWT token expiration
✅ CORS configured
✅ Helmet for security headers
✅ Input validation
✅ MongoDB injection prevention
✅ Rate limiting (add if needed)

## Database Models

### User
- phoneNumber, name, email
- addresses (array)
- OTP verification
- Order history reference

### Product
- productId, name, price
- type, description, images
- stock management
- Active/inactive status

### Order
- User reference
- Items array with products
- Shipping address
- Payment status
- Order status with history
- Tracking number

## Troubleshooting

**MongoDB Connection Error:**
```bash
# Check if MongoDB is running
mongosh
# Or use MongoDB Atlas cloud
```

**Port Already in Use:**
```bash
# Change PORT in .env file
PORT=5001
```

**OTP Not Sending:**
- Check Twilio credentials in `.env`
- In development, OTP prints to console

## Next Steps

- [ ] Add email notifications
- [ ] Implement admin panel
- [ ] Add product reviews
- [ ] Implement wishlist
- [ ] Add analytics
- [ ] Setup CI/CD
- [ ] Add API documentation (Swagger)

## License

ISC

---

**© 2026 HerbalKyore. All rights reserved.**
