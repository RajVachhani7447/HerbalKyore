import React from 'react';

const LocationSection = () => {
  return (
    <div className="Location-section">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.0784202350937!2d72.89528137503721!3d21.228738680471064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f00118f8dc7%3A0x65af8a3a3ea1af62!2sRoyal%20Arcade!5e0!3m2!1sen!2sin!4v1750683116650!5m2!1sen!2sin"
        width="100%"
        height="350"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="loction"
        title="Location Map"
      ></iframe>
    </div>
  );
};

export default LocationSection;
