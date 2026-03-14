import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsData } from '../data/products';

const ProductGrid = ({ searchTerm }) => {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const productList = Object.entries(productsData).map(([id, product]) => ({
    id,
    ...product
  }));

  const filteredProducts = productList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || product.type.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <section className="products" id="products">
      <h2>Our Products</h2>
      <div className="filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'capsule' ? 'active' : ''}
          onClick={() => setFilter('capsule')}
        >
          Capsules
        </button>
        <button
          className={filter === 'powder' ? 'active' : ''}
          onClick={() => setFilter('powder')}
        >
          Powder
        </button>
      </div>
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div
              key={product.id}
              className={`product-card ${product.type.toLowerCase()}`}
              onClick={() => handleProductClick(product.id)}
              style={{ display: 'block' }}
            >
              <img src={product.image || product.images[0]} alt={product.name} />
              <h4>{product.name}</h4>
              <p>{product.price}</p>
              <button>Shop</button>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No products found for "{searchTerm}"</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
