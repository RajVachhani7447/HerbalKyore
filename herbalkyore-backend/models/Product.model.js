const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  type: {
    type: String,
    enum: ['Capsule', 'Powder'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  image: {
    type: String
  },
  paymentLink: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    default: 100,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    default: 'Herbal Products'
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for faster searches
productSchema.index({ productId: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
