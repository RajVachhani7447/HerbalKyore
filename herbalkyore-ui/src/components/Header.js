import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productsData } from '../data/products';

const Header = ({ onSearch }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { cartCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const productList = Object.entries(productsData).map(([id, product]) => ({
    id,
    ...product
  }));

  const matchedProducts = searchTerm.length > 0
    ? productList.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleProductClick = (productId) => {
    setSearchTerm('');
    setShowDropdown(false);
    navigate(`/product/${productId}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (sectionId) => {
    // Navigate to home first if not already there
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMenuOpen(false);
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <img src="/img/logo.png" alt="HerbalKyore Logo" className="logo" />
        </Link>
        <nav className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <a href="#about" onClick={() => scrollToSection('about')}>About</a>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          <a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a>
          <a href="#testimonials" onClick={() => scrollToSection('testimonials')}>Testimonial</a>
          {/* Mobile-only search inside menu */}
          <div className="mobile-search-wrapper" ref={searchRef}>
            <div className="mobile-search-input">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => { if (searchTerm.length > 0) setShowDropdown(true); }}
              />
            </div>
            {showDropdown && (
              <div className="search-dropdown">
                {matchedProducts.length > 0 ? (
                  matchedProducts.map(product => (
                    <div
                      key={product.id}
                      className="search-dropdown-item"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img src={product.image || product.images[0]} alt={product.name} />
                      <div className="search-dropdown-info">
                        <span className="search-dropdown-name">{product.name}</span>
                        <span className="search-dropdown-price">{product.price}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-dropdown-empty">No products found</div>
                )}
              </div>
            )}
          </div>
        </nav>
        <div className="icons">
          {/* Desktop-only search */}
          <div className="search-wrapper desktop-search" ref={searchRef}>
            <input
              type="text"
              id="searchInput"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => { if (searchTerm.length > 0) setShowDropdown(true); }}
            />
            <i className="fas fa-search"></i>
            {showDropdown && (
              <div className="search-dropdown">
                {matchedProducts.length > 0 ? (
                  matchedProducts.map(product => (
                    <div
                      key={product.id}
                      className="search-dropdown-item"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img src={product.image || product.images[0]} alt={product.name} />
                      <div className="search-dropdown-info">
                        <span className="search-dropdown-name">{product.name}</span>
                        <span className="search-dropdown-price">{product.price}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-dropdown-empty">No products found</div>
                )}
              </div>
            )}
          </div>
          {isAuthenticated ? (
            <Link to="/profile" className="user-link" title="My Profile">
              <i className="fa fa-user"></i>
              <span className="user-name">{user?.name || 'Profile'}</span>
            </Link>
          ) : (
            <Link to="/login" className="login-link">
              <i className="fa fa-sign-in-alt"></i>
              <span className="login-text">Login</span>
            </Link>
          )}
          <Link to="/cart" className="cart-link">
            <i className="fas fa-shopping-cart"></i>
            <span id="cart-count">{cartCount}</span>
          </Link>
        </div>
        <div className="menu-toggle" id="menuToggle" onClick={toggleMenu}>
          {menuOpen ? '✕' : '☰'}
        </div>
      </div>
    </header>
  );
};

export default Header;
