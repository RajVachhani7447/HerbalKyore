import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
      author: 'parth hadvani'
    },
    {
      text: 'Excellent results and great packaging.',
      author: 'Mehul Joshi'
    },
    {
      text: 'Highly recommended for herbal product lovers.',
      author: 'Anjali Sharma'
    },
    {
      text: 'Highly recommended for herbal product lovers.',
      author: 'Anjali Sharma'
    },
    {
      text: 'Highly recommended for herbal product lovers.',
      author: 'Anjali Sharma'
    }
  ];

  return (
    <section className="testimonials" id="testimonials">
      <h2>What Our Customers Say</h2>
      <div className="testimonial-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <p>"{testimonial.text}"</p>
            <div className="stars">★★★★★</div>
            <p>- {testimonial.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
