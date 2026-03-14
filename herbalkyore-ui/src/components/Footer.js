import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Logo & Address */}
        <div className="footer-col">
          <img src="/img/logo.png" alt="HerbalKyore Logo" className="footer-logo" />
          <p>
            <strong>Company Name:</strong>
            <br />
            HerbalKyore
          </p>
          <p>
            <strong>Address:</strong>
            <br />
            Royal Arcade, 349, Varacha
            <br />
            Main Rd, opp. Sarthana Nature Park,
            <br />
            Sarthana Jakat Naka,
            <br />
            Surat, Gujarat - 395006
          </p>
        </div>

        {/* Column 2: Certifications & Contact */}
        <div className="footer-col">
          <div className="certs">
            <img src="/img/fssai done1.png" alt="FSSAI" style={{ width: '65px', height: '55px' }} />
            <img src="/img/plantbase done.png" alt="plantbased" />
            <img src="/img/iso done1.png" alt="ISO" />
            <img src="/img/gmp done1.png" alt="GMP" />
          </div>
          <p>
            <strong>Contact Info:</strong>
            <br />
            herbalkyore@gmail.com
            <br />
            +91 92742 81342
          </p>
          <p>
            <strong>Quick Access:</strong>
            <br />
            <Link to="/">Home</Link>
            <br />
            <a href="#about">About</a>
            <br />
            <a href="#products">Product</a>
            <br />
            <a href="#contact">Contact</a>
            <br />
            <a href="#testimonials">Testimonial</a>
          </p>
        </div>

        {/* Column 3: Amazon, Socials, Payments */}
        <div className="footer-col">
          <p>
            <strong>We Are Also Available on</strong>
          </p>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
            alt="Amazon"
            className="amazon-logo"
          />
          <p>
            <strong>Follow Us On:</strong>
          </p>
          <div className="social-icons">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-whatsapp"></i>
            <i className="fab fa-instagram"></i>
          </div>
          <p>
            <strong>We Also Accept:</strong>
          </p>
          <div className="payment-icons">
            <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" />
            <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" />
            <img src="https://img.icons8.com/color/48/google-pay.png" alt="GPay" />
            <img
              src="/img/upi.png"
              alt="BHIM UPI"
              style={{ height: '24px' }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
