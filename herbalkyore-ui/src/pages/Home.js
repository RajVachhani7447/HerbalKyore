import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ImageSlider from '../components/ImageSlider';
import ProductGrid from '../components/ProductGrid';
import DoctorSection from '../components/DoctorSection';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';
import LocationSection from '../components/LocationSection';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="home-page">
      <Header onSearch={handleSearch} />
      <ImageSlider />
      <ProductGrid searchTerm={searchTerm} />
      <DoctorSection />
      <Testimonials />
      <ContactSection />
      <LocationSection />
      <Footer />
    </div>
  );
};

export default Home;
