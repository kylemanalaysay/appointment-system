import React, { useState } from 'react';
import './service-card.css';

const ServiceCard = ({ item }) => {
  const { title, desc, subServices } = item;
  const [showSubServices, setShowSubServices] = useState(false);

  return (
    <div
      className="service__item"
      onMouseEnter={() => setShowSubServices(true)}
      onMouseLeave={() => setShowSubServices(false)}
    >
      <h5>{title}</h5>
      {showSubServices && (
        <div className="sub-services">
          <ul>
            {subServices.map((subService, index) => (
              <li key={index}>{subService}</li>
            ))}
          </ul>
        </div>
      )}
      <p>{desc}</p>
    </div>
  );
};

export default ServiceCard;

