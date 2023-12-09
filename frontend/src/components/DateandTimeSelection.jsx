import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { DatePicker, TimePicker } from 'antd';

const DateTimeSelection = ({ onSelectDateTime }) => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [error, setError] = useState('');

  const handleDateTimeChange = (date, dateString) => {
    setSelectedDateTime(date);
  };

  const handleConfirm = () => {
    if (selectedDateTime) {
      onSelectDateTime(selectedDateTime.toDate()); 
      setError('');
    } else {
      setError('Please select both date and time');
    }
  };

  return (
    <div>
      <h2>Select Date and Time</h2>
      <div>
        {/* Date and Time picker */}
        <DatePicker showTime format="DD-MM-YYYY HH:mm A" onChange={handleDateTimeChange} />
      </div>
      <div>
        {/* Confirm button */}
        <button onClick={handleConfirm}>Confirm Date and Time</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default DateTimeSelection;




