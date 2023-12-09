import React from 'react';

const ServiceList = ({ onSelectService }) => {
  // Sample list of services
  const services = [
    { id: 1, name: 'Hair Cut', price: 'Php 100' },
    { id: 2, name: 'Hair Spa', price: 'Php 200' },
    { id: 3, name: 'Hair Iron', price: 'Php 200' },
    // ... other services
  ];

  return (
    <div>
      <h2>Service List</h2>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <div>
              <h3>{service.name}</h3>
              <p>Price: {service.price}</p>
              <button onClick={() => onSelectService(service)}>Select</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceList;