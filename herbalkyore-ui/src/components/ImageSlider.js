import React, { useState, useEffect, useRef } from 'react';

const ImageSlider = () => {
  const [active, setActive] = useState(0);
  const sliderRef = useRef(null);
  const images = [
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg'
  ];

  const lengthItems = images.length - 1;

  const nextSlide = () => {
    setActive(prevActive => (prevActive + 1 <= lengthItems ? prevActive + 1 : 0));
  };

  const prevSlide = () => {
    setActive(prevActive => (prevActive - 1 >= 0 ? prevActive - 1 : lengthItems));
  };

  const goToSlide = (index) => {
    setActive(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      const sliderContainer = sliderRef.current.parentElement;
      const slideWidth = sliderContainer ? sliderContainer.offsetWidth : sliderRef.current.offsetWidth;
      sliderRef.current.style.transform = `translateX(-${active * slideWidth}px)`;
    }
  }, [active]);

  return (
    <div className="slider">
      <div className="list" ref={sliderRef}>
        {images.map((img, index) => (
          <div className="item" key={index}>
            <img src={img} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="buttons">
        <button id="prev" onClick={prevSlide}>
          &lt;
        </button>
        <button id="next" onClick={nextSlide}>
          &gt;
        </button>
      </div>
      <ul className="dots">
        {images.map((_, index) => (
          <li
            key={index}
            className={active === index ? 'active' : ''}
            onClick={() => goToSlide(index)}
          ></li>
        ))}
      </ul>
    </div>
  );
};

export default ImageSlider;
