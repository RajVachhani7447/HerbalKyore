const mongoose = require('mongoose');
const Product = require('../models/Product.model');
require('dotenv').config();

const products = [
  {
    productId: "vitamin-b12-capsule",
    name: "Vitamin B-12 Capsules",
    price: 500,
    type: "Capsule",
    image: "/img/VITAMIN B-12 c.png",
    images: ["/img/VITAMIN B-12 c.png", "/img/VITAMIN B-12 (2) c.png"],
    description: "Vitamin B-12 Capsules help support energy levels and nerve health. 100% natural, FSSAI approved.",
    paymentLink: "https://payments-test.cashfree.com/links?code=w8tuhn7bt0c0",
    stock: 100,
    tags: ["vitamin", "energy", "health"]
  },
  {
    productId: "B-12-powder",
    name: "Vitamin B-12 Powder",
    price: 600,
    type: "Powder",
    image: "/img/Vitamin_b-12 p.png",
    images: ["/img/Vitamin_b-12 p.png", "/img/VITAMIN B-12 (2) p.png"],
    description: "Vitamin B-12 Powder helps support energy levels and nerve health. 100% natural, FSSAI approved.",
    stock: 100,
    tags: ["vitamin", "powder", "energy"]
  },
  {
    productId: "multi-vitamin-capsule",
    name: "Multi Vitamin Capsules",
    price: 500,
    type: "Capsule",
    image: "/img/multivitamins c.png",
    images: ["/img/multivitamins c.png", "/img/multivitamins (2) c.png"],
    description: "Multi Vitamin Capsules provide comprehensive nutritional support. 100% natural, FSSAI approved.",
    stock: 100,
    tags: ["multivitamin", "health", "nutrition"]
  },
  {
    productId: "go-fresh-powder",
    name: "GO Fresh Powder",
    price: 330,
    type: "Powder",
    image: "/img/go_fresh p.png",
    images: ["/img/go_fresh p.png", "/img/go_fresh (2) p.png"],
    description: "GO Fresh Powder for digestive health and freshness. 100% natural, FSSAI approved.",
    stock: 100,
    tags: ["digestive", "fresh", "powder"]
  },
  {
    productId: "liver-support-capsule",
    name: "Liver Support Capsules",
    price: 500,
    type: "Capsule",
    image: "/img/liver c.png",
    images: ["/img/liver c.png", "/img/liver (2) c.png"],
    description: "Liver Support Capsules for optimal liver function. 100% natural, FSSAI approved.",
    stock: 100,
    tags: ["liver", "detox", "health"]
  },
  {
    productId: "Man-XX-Gold-Capsules",
    name: "Man XX Gold Capsules",
    price: 500,
    type: "Capsule",
    image: "/img/man xx gold c.png",
    images: ["/img/man xx gold c.png", "/img/man xx gold (2) c.png"],
    description: "Man XX Gold Capsules for men's vitality and wellness. 100% natural, FSSAI approved.",
    stock: 100,
    tags: ["men", "vitality", "wellness"]
  },
  {
    productId: "Weight-Loss-Powder",
    name: "Weight Loss Powder",
    price: 750,
    type: "Powder",
    image: "/img/weight_loss p.png",
    images: ["/img/weight_loss p.png", "/img/weight_loss (2) p.png"],
    description: "Weight Loss Powder for healthy weight management. 100% natural, FSSAI approved.",
    stock: 100,
    tags: ["weight loss", "fitness", "health"]
  },
  {
    productId: "Diabetes-Powder",
    name: "Diabetes Powder",
    price: 650,
    type: "Powder",
    image: "/img/Diabetes p.png",
    images: ["/img/Diabetes p.png", "/img/Diabetes (2) p.png"],
    description: "Diabetes Powder for blood sugar management. 100% natural, FSSAI approved.",
    stock: 100,
    tags: ["diabetes", "blood sugar", "health"]
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/herbalkyore');
    console.log('✓ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('✓ Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log(`✓ Inserted ${products.length} products`);

    console.log('\n✨ Database seeded successfully!\n');
    process.exit(0);

  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
};

seedProducts();
