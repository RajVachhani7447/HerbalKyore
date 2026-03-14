import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { productsData } from '../data/products';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const foundProduct = productsData[productId];
    if (foundProduct) {
      setProduct(foundProduct);
      const imageList = foundProduct.images || [foundProduct.image];
      setMainImage(imageList[0]);
    } else {
      navigate('/');
    }
  }, [productId, navigate]);

  const changeImage = (src) => {
    setMainImage(src);
  };

  const parsePrice = (priceStr) => {
    return Number(priceStr.replace(/[^0-9.]/g, ''));
  };

  const handleAddToCart = () => {
    const numericPrice = parsePrice(product.price);
    const image = product.images ? product.images[0] : product.image;
    addToCart(productId, product.name, numericPrice, image);
    navigate('/cart');
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const imageList = product.images || [product.image];

  return (
    <div className="product-detail-page">
      <Header />
      <div className="single-product">
        <div className="product-detail-image-section">
          <div className="main-img-container">
            <div className="thumbnails" id="thumbnails">
              {imageList.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => changeImage(src)}
                  className={mainImage === src ? 'active' : ''}
                />
              ))}
            </div>
            <img id="mainImage" src={mainImage} alt={product.name} />
          </div>
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p style={{ fontSize: '28px', fontWeight: '800', color: '#227845' }}>{product.price}</p>
          <p className="product-type">Type: {product.type}</p>
          <p>{product.description}</p>
          <button id="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
