import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="products-page">
      <Header onSearch={handleSearch} />
      <ProductGrid searchTerm={searchTerm} />
      <Footer />
    </div>
  );
};

export default Products;
