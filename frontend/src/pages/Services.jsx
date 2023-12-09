import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ServiceSelection from '../components/ServiceSelection';
import DateTimeSelection from '../components/DateandTimeSelection';
import { BASE_URL } from '../config';

const Services = () => {
  const buttonStyle = {
    margin: '5px',
    padding: '8px 16px',
    borderRadius: '4px',
    backgroundColor: '#7941B0',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center',
  };

  const navigate = useNavigate();
  const { token, existingUser } = useContext(AuthContext);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [showAuthMessage, setShowAuthMessage] = useState(false);

  useEffect(() => {
    if (!token || !existingUser) {
      setShowAuthMessage(true);
    }
  }, [token, existingUser]);

  const handleDateTimeSelection = (dateTime) => {
    setSelectedDateTime(dateTime);
    if (!token || !existingUser) {
      setShowAuthMessage(true);
    } else {
      setCurrentStep(2); // Move to step 2: Service selection
    }
  };
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  };

  const formatTime = (inputTime) => {
    const time = new Date(inputTime);
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert hours to 12-hour format

    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  };

  const handleServiceSelection = (services) => {
    setSelectedServices(services);
    setCurrentStep(3); // Move to step 3: Proceed to book
  };

  const bookAppointment = async (appointmentData) => {
    try {
      const response = await fetch(`${BASE_URL}/users/services/book-appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Failed to book appointment: ${errorResponse.message}`);
      }

      const result = await response.json();
      console.log('Appointment booked successfully:', result);

      navigate('/'); // Redirect to success page after successful booking
    } catch (error) {
      console.error('Failed to book appointment:', error);
      // Handle booking error scenarios
    }
  };

  const handleBooking = async () => {
    try {
      const formattedDate = formatDate(selectedDateTime);
      const formattedTime = formatTime(selectedDateTime);

      const appointmentData = {
        date: formattedDate,
        time: formattedTime,
        services: selectedServices.map(({ serviceName, price }) => ({
          serviceName,
          price,
        })),
      };

      await bookAppointment(appointmentData);
    } catch (error) {
      console.error('Failed to book appointment:', error);
      // Handle booking error scenarios
    }
  };


  const handleBookNow = () => {
    setCurrentStep(1); // Proceed to step 1: Date and Time selection
  };

  const handleLogin = () => {
    // Redirect to the login page or perform login logic
    navigate('/login');
  };

  const handleRegister = () => {
    // Redirect to the login page or perform login logic
    navigate('/register');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Services</h1>
      {currentStep === 0 && (
        <button style={buttonStyle} onClick={handleBookNow}>
          Book Now
        </button>
      )}
      {currentStep === 1 && (
        <>
          <DateTimeSelection onSelectDateTime={handleDateTimeSelection} />
          {showAuthMessage && (
            <div className="auth-message">
              <p>You need to create an account or log in to proceed.</p>
              <button style={buttonStyle} onClick={handleLogin}>
                Login
              </button>
              <button style={buttonStyle} onClick={handleRegister}>
                Register
              </button>
            </div>
          )}
        </>
      )}
      {currentStep === 2 && (
        <>
          <ServiceSelection createAppointment={handleServiceSelection} />
        </>
      )}
      {currentStep === 3 && (
        <div>
          <h2>Confirm Appointment Details</h2>
          <p>Selected Services:</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {selectedServices.map((service, index) => (
              <li key={index}>{service.serviceName} - PHP {service.price}</li>
            ))}
          </ul>
          {selectedDateTime && (
            <div>
              <p>Selected Date: {formatDate(selectedDateTime)}</p>
              <p>Selected Time: {formatTime(selectedDateTime)}</p>
            </div>
          )}
          <button style={buttonStyle} onClick={handleBooking}>
            Confirm Booking
          </button>
        </div>
      )}
      {/* Display steps for service selection, date/time selection, and registration */}
    </div>
  );
};

export default Services;





