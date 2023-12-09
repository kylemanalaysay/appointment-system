import React, { useState, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import { BASE_URL, token } from '../../config';
import Loading from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';
import { Table } from 'antd';

const buttonStyle = {
  margin: '5px', 
  padding: '8px 16px', 
  borderRadius: '4px', 
  backgroundColor: '#7941B0', 
  color: '#fff', 
  border: 'none', 
  cursor: 'pointer', 
};

const MyBookings = () => {
  const { data: bookingsData, loading: bookingsLoading, error: bookingsError } = useFetch(`${BASE_URL}/users/appointments/my-appointment`);
  const { data: userData, loading: userLoading, error: userError } = useFetch(`${BASE_URL}/users/appointments/my-appointment`);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editableRowKey, setEditableRowKey] = useState(null); // Track the editable row
  const [editedData, setEditedData] = useState({ date: '', time: '', services: [] });

  const handleUpdateAppointment = async (appointmentId, updatedAppointmentData) => {
    try {
      // Convert the date to "dd-MM-yyyy" format
      const date = new Date(updatedAppointmentData.date);
      const formattedDate = `${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
  
      // Convert the time to "HH:mm" format with AM/PM
      const rawTime = new Date(`2000-01-01T${updatedAppointmentData.time}`);
      const hours = rawTime.getHours();
      const minutes = ('0' + rawTime.getMinutes()).slice(-2);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
  
      const response = await fetch(`${BASE_URL}/users/appointments/my-appointment/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: formattedDate,
          time: formattedTime,
          services: updatedAppointmentData.services,
        }),
      });
  
      if (response.ok) {
        console.log(`Appointment ${appointmentId} updated successfully.`);
      } else {
        throw new Error('Failed to update appointment.');
      }
    } catch (error) {
      console.error('Error updating appointment:', error.message);
    }
  };
  
  
  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`${BASE_URL}/users/appointments/my-appointment/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        // Remove the deleted appointment from the state
        setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.key !== appointmentId));
        console.log(`Appointment ${appointmentId} deleted successfully.`);
      } else {
        throw new Error('Failed to delete appointment.');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error.message);
    }
  };

  const handleEdit = (record) => {
    setEditableRowKey(record.key);
    setEditedData({
      date: record.date,
      time: record.time,
      services: record.services,
    });
  };

  const handleSave = (record) => {
    handleUpdateAppointment(record.key, editedData);
  };

  const handleDateChange = (e) => {
    const formattedDate = e.target.value;
    setEditedData({ ...editedData, date: formattedDate });
  };

  const handleTimeChange = (e) => {
    const formattedTime = e.target.value; 
    setEditedData({ ...editedData, time: formattedTime });
  };
  

  useEffect(() => {
    if (bookingsData && userData) {
      const combinedAppointments = bookingsData.map(booking => {
        const user = userData.find(user => user._id === booking.userId);

        return {
          key: booking._id, 
          date: booking.date,
          time: booking.time,
          services: booking.services,
          status: booking.status,
        };
      });

      setAppointments(combinedAppointments);
      setLoading(false);
    } else {
      setError('Failed to fetch data');
      setLoading(false);
    }
  }, [bookingsData, userData]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Services',
      dataIndex: 'services',
      key: 'services',
      render: services => (
        <ul>
          {services.map(service => (
            <li key={service._id}>
              {service.serviceName} - ${service.price}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          {editableRowKey === record.key ? (
            <div>
              <input type="date" value={editedData.date} onChange={handleDateChange} />
              <input type="time" value={editedData.time} onChange={handleTimeChange} />
              {/* Add editable fields for services */}
              <button style={buttonStyle} onClick={() => handleSave(record)}>Save</button>
            </div>
          ) : (
            <button style={buttonStyle} onClick={() => handleEdit(record)}>Edit</button>
          )}
          <button style={buttonStyle} onClick={() => handleDeleteAppointment(record.key)}>Delete</button>
        </div>
      ),
    },

  ];
  

  return (
    <div>
      {bookingsLoading || userLoading ? <Loading /> : null}
      {bookingsError || userError ? <Error errMessage={bookingsError || userError} /> : null}

      {!loading && !error && appointments.length > 0 ? (
        <Table columns={columns} dataSource={appointments} />
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
};

export default MyBookings;




