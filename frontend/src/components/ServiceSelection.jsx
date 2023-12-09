import React, { useState } from 'react';

const ServiceSelection = ({ createAppointment }) => {
  // Array of services with their prices
  const [services] = useState([
    {
      category: 'Hair Services',
      services: [
        { name: 'Hair Cut', price: 100 },
        { name: 'Hair Spa', price: 200 },
        { name: 'Hair Iron', price: 200 },
        { name: 'Perma Gloss', price: 300 },
        { name: 'Pro Vitamins', price: 300 },
        { name: 'Basic Color', price: 390 },
        { name: 'Premium Color', price: 690 },
        { name: 'Premium Bleaching', price: 500 },
        { name: 'Cellophane', price: 400 },
        { name: 'Washable Color Cello', price: 500 },
        { name: 'Ionic Keratin', price: 700 },
        { name: 'Perma Color Cello', price: 790 },
        { name: 'Perma Color Cello', price: 800 },
        
      ],
    },
    {
      category: 'Hand & Foot Care',
      services: [
        { name: 'Manicure', price: 75 },
        { name: 'Pedicure', price: 75 },
        { name: 'Imported Polish', price: 50 },
        { name: 'Nail Art', price: 100 },
        { name: 'Eyebrow Threading ', price: 100 },
        { name: 'Foot Massage w/ Pedicure', price: 225 },
        { name: 'Foot spa w/ Milk Scrub', price: 250 },
        { name: 'Footspa Magic', price: 250 },
        { name: 'Regular Foot spa (with Basic Mani & Ped)', price: 300 },
        { name: 'Gel Manicure', price: 350 },
        { name: 'Gel Pedicure', price: 350 },
        { name: 'Polygel Extension ', price: 899 },
      ],
    },
    {
      category: 'Major Treatment',
      services: [
        { name: 'Absolute Rebond with Hair Spa & Pro-Vitamins', price: 1000 },
        { name: 'Rebond with Clear Cello & Pro-Vitamins', price: 1300 },
        { name: 'Absolute Rebond - Complete Treatment', price: 1500 },
        { name: 'Absolute Brazilian Keratin', price: 1500 },
        { name: 'Hair Botox', price: 1500 },
        { name: 'High lights (Full coverage)', price: 1500 },
        { name: 'Balayage with Brazilian Keratin (Basic)', price: 2500 },
        { name: 'Balayage with Brazilian Keratin (Premium)', price: 3000 },
        { name: 'Ombré with Brazilian Keratin', price: 2500 },
        { name: 'Absolute Rebond Perma', price: 2000 },
        { name: 'Absolute Rebond & Absolute Brazilian', price: 3000 },
        { name: 'Digital Perming', price: 2500 },
        { name: 'Hair Extensions (25 strands)', price: 2500 },
      ],
    },
    // Add more categories with their respective services...
  ]);

  const [selectedServices, setSelectedServices] = useState([]);

  const handleProceedToBook = () => {
    if (selectedServices.length === 0) {
      // Display an error or alert if no services are selected
      alert('Please select at least one service to proceed.');
      return;
    }
    const selectedServiceData = selectedServices.map(({ name, price }) => ({
      serviceName: name,
      price,
    }));

    createAppointment(selectedServiceData);
  };

  const handleServiceSelection = (categoryIndex, serviceIndex) => {
    const selectedService = services[categoryIndex].services[serviceIndex];
    setSelectedServices([...selectedServices, selectedService]);
  };

  const removeSelectedService = (index) => {
    const updatedServices = [...selectedServices];
    updatedServices.splice(index, 1);
    setSelectedServices(updatedServices);
  };
  const serviceStyle = {
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const buttonStyle = {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#7941B0',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const serviceNameStyle = {
    display: 'inline-block',
    width: '200px', // Adjust the width as needed
    verticalAlign: 'top',
    fontWeight: 'bold', // Bold style for service names
  };

  const listItemStyle = {
    marginBottom: '5px',
  };

  return (
    <div>
      <h2>Service Selection</h2>
      {services.map((category, categoryIndex) => (
        <div key={categoryIndex} style={serviceStyle}>
          <h3>{category.category}</h3>
          <ul>
            {category.services.map((service, serviceIndex) => (
              <li key={serviceIndex} style={listItemStyle}>
                <span style={serviceNameStyle}>{service.name}</span>
                <button style={buttonStyle} onClick={() => handleServiceSelection(categoryIndex, serviceIndex)}>
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <h3>Selected Services</h3>
      <ul>
        {selectedServices.map((service, index) => (
          <li key={index} style={listItemStyle}>
            <span style={serviceNameStyle}>{service.name}</span>
            <button style={buttonStyle} onClick={() => removeSelectedService(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button style={buttonStyle} onClick={handleProceedToBook}>
        Proceed to Book
      </button>
    </div>
  );
};

export default ServiceSelection;