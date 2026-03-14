import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const ContactSection = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    Phone: '',
    Comment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwc49tIUb09yS1w33tI65uX903KO0hpKLnoINciW4nYoWvhTDIegLUJW9DlIyD5ZmHmxg/exec';
    
    try {
      await fetch(scriptURL, {
        method: 'POST',
        body: new FormData(e.target)
      });
      
      showToast('Thank you! Form is submitted', 'success');
      setFormData({
        name: '',
        email: '',
        Phone: '',
        Comment: ''
      });
    } catch (error) {
      console.error('Error!', error.message);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <h2>Contact Us</h2>
      <div className="contact-container">
        <form className="contact-form" name="contact-form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="input-box">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="input-box">
            <input
              type="text"
              name="Phone"
              placeholder="Phone"
              value={formData.Phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <textarea
              placeholder="Comment"
              name="Comment"
              value={formData.Comment}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="contact_button">
            Submit
          </button>
        </form>
        <div className="contact-image">
          <img src="/img/branding_img(2).png" alt="Products" />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
