# HerbalKyore React Application

A modern React.js e-commerce platform for HerbalKyore - Natural Herbal Products.

## Features

- ✅ Fully responsive design
- ✅ Product catalog with filtering and search
- ✅ Shopping cart functionality with local storage
- ✅ Product detail pages
- ✅ Contact form integration
- ✅ Address/Checkout form
- ✅ Image slider/carousel
- ✅ Testimonials section
- ✅ Google Maps integration
- ✅ React Router for navigation
- ✅ Context API for state management

## Project Structure

```
HITUMAMA PROJECT/
├── public/
│   ├── index.html
│   └── img/              # All product and brand images
├── src/
│   ├── components/       # Reusable components
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── ImageSlider.js
│   │   ├── ProductGrid.js
│   │   ├── DoctorSection.js
│   │   ├── Testimonials.js
│   │   ├── ContactSection.js
│   │   └── LocationSection.js
│   ├── pages/           # Page components
│   │   ├── Home.js
│   │   ├── ProductDetail.js
│   │   ├── Cart.js
│   │   └── Address.js
│   ├── context/         # React Context
│   │   └── CartContext.js
│   ├── data/            # Product data
│   │   └── products.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Installation

1. Make sure you have Node.js installed (version 14 or higher)

2. Install dependencies:
```bash
npm install
```

3. Move the `img` folder to the `public` directory if not already there:
```bash
# The img folder should be at: public/img/
```

## Running the Application

Start the development server:

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Building for Production

Create an optimized production build:

```bash
npm run build
```

The build folder will contain the production-ready files.

## Technologies Used

- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Context API** - State management
- **Local Storage** - Cart persistence
- **Font Awesome** - Icons
- **Google Maps** - Location embedding

## Features Breakdown

### Cart Management
- Add/remove items
- Update quantities
- Persistent storage using localStorage
- Real-time cart count in header

### Product Pages
- Dynamic routing with product IDs
- Image galleries with thumbnails
- Product details and descriptions
- Direct payment links integration

### Forms
- Contact form with Google Sheets integration
- Address form with order submission
- Form validation

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile
- Flexible grid layouts
- Touch-friendly interface

## API Integrations

- **Contact Form**: Google Apps Script
- **Order Submission**: SheetDB API
- **Payment**: Cashfree payment links

## Original Files

The original HTML/CSS/JS files are preserved:
- `index.html` (original)
- `product.html` (original)
- `cart.html` (original)
- `address.html` (original)
- `style.css` (original)
- `script.js` (original)

## Notes

- All styling has been preserved from the original CSS
- All functionality has been converted to React patterns
- The app uses React best practices with hooks and functional components
- Images paths use `/img/` which resolves to `public/img/`

## Support

For issues or questions, contact: herbalkyore@gmail.com

---

**© 2025 HerbalKyore. All rights reserved.**
