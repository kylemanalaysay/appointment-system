import React, { useState, useEffect } from 'react';
import { Tabs, Table, Button, Modal } from 'antd';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import userGetAll from '../../hooks/useFetch';
import { BASE_URL, token } from '../../config';
//import Loading from '../../components/Loader/Loading';
//import Error from '../../components/Error/Error';

const { TabPane } = Tabs;

const Dashboard = () => {
  // States for Modals, Data, etc.
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);
  const { data: userDataFromFetch } = userGetAll(`${BASE_URL}/admin/profile/me/users`);
  const { data: appointmentDataFromFetch } = userGetAll(`${BASE_URL}/admin/profile/me/appointments`);
  const [acceptedAppointments, setAcceptedAppointments] = useState([]);
  const [declinedAppointments, setDeclinedAppointments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(() => {
    const storedRevenue = localStorage.getItem('totalRevenue');
    return storedRevenue ? parseFloat(storedRevenue) : 0;
  });

  const styles = {
    container: {
      padding: '20px',
    },
    heading: {
      fontSize: '24px',
      marginBottom: '20px',
    },
    button: {
      margin: '10px 0',
    },
    tableContainer: {
      marginBottom: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '5px',
      overflow: 'hidden',
    },
    table: {
      width: '100%',
    },
    modalContent: {
      padding: '20px',
    },
  };

  useEffect(() => {
    if (userDataFromFetch) {
      setUserData(userDataFromFetch);
    }
  }, [userDataFromFetch]);

  useEffect(() => {
    const storedAcceptedAppointments = JSON.parse(localStorage.getItem('acceptedAppointments'));
    if (storedAcceptedAppointments) {
      setAcceptedAppointments(storedAcceptedAppointments);
    }
    if (appointmentDataFromFetch) {
      const accepted = [];
      const declined = [];
      appointmentDataFromFetch.forEach(appointment => {
        if (appointment.status === 'Accepted') {
          accepted.push(appointment);
        } else if (appointment.status === 'Declined') {
          declined.push(appointment);
        }
      });
      setAppointmentData(appointmentDataFromFetch);
      setAcceptedAppointments(accepted);
      setDeclinedAppointments(declined);
    }
  }, [appointmentDataFromFetch]);

  useEffect(() => {
    const fetchPendingAppointments = async () => {
      try {
        const response = await fetch(`${BASE_URL}/admin/profile/me/appointments`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const appointmentsData = await response.json();

          // Check if appointmentsData is an array
          if (Array.isArray(appointmentsData)) {
            const pendingAppointments = appointmentsData.filter(appointment => appointment.status === 'Pending');
            setAppointmentData(pendingAppointments);
            localStorage.setItem('pendingAppointments', JSON.stringify(pendingAppointments));
          } else if (appointmentsData && appointmentsData.appointments) {
            // Assuming the data has a structure like { appointments: [] }
            const pendingAppointments = appointmentsData.appointments.filter(appointment => appointment.status === 'Pending');
            setAppointmentData(pendingAppointments);
            localStorage.setItem('pendingAppointments', JSON.stringify(pendingAppointments));
          } else if (appointmentsData && appointmentsData.data) {
            // Assuming the data has a structure like { data: [] }
            const pendingAppointments = appointmentsData.data.filter(appointment => appointment.status === 'Pending');
            setAppointmentData(pendingAppointments);
            localStorage.setItem('pendingAppointments', JSON.stringify(pendingAppointments));
          } else {
            console.error('Unable to find appointments data');
          }
        } else {
          console.error('Failed to fetch appointments');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchPendingAppointments();
  }, []);



  // Function to handle making a user an admin
  const makeUserAdmin = (userId) => {
    console.log(`Making user with ID ${userId} an admin`);
  };

  // Function to handle accepting or declining an appointment
  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/profile/me/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const updatedAppointmentIndex = appointmentData.findIndex(appointment => appointment._id === appointmentId);
        if (updatedAppointmentIndex !== -1) {
          const updatedAppointment = { ...appointmentData[updatedAppointmentIndex] };

          if (action === 'accept') {
            updatedAppointment.status = 'Accepted';
            setAcceptedAppointments([...acceptedAppointments, updatedAppointment]);
          } else if (action === 'decline') {
            updatedAppointment.status = 'Declined';
            setDeclinedAppointments([...declinedAppointments, updatedAppointment]);
          }

          // Remove the updated appointment from appointmentData
          const updatedAppointments = appointmentData.filter(appointment => appointment._id !== appointmentId);
          setAppointmentData(updatedAppointments);

          localStorage.setItem('acceptedAppointments', JSON.stringify(acceptedAppointments));
        }
      } else {
        const errorData = await response.json();
        console.error('Error updating appointment:', errorData);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleCompleteAppointment = async (appointmentId, appointmentServices) => {
    const completedAppointmentIndex = acceptedAppointments.findIndex(
      (appointment) => appointment._id === appointmentId
    );

    if (completedAppointmentIndex !== -1) {
      const updatedAcceptedAppointments = [...acceptedAppointments];
      const completedAppointment = { ...updatedAcceptedAppointments[completedAppointmentIndex] };

      if (!completedAppointment.completed) {
        try {
          // Update appointment status to 'Completed' via API
          const response = await fetch(`${BASE_URL}/admin/profile/me/appointments/${appointmentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ action: 'Complete' }), // Update the status to 'Completed'
          });

          if (response.ok) {
            // Mark appointment as completed in local state
            completedAppointment.completed = true;
            updatedAcceptedAppointments[completedAppointmentIndex] = completedAppointment;
            setAcceptedAppointments(updatedAcceptedAppointments);

            // Store completed appointments in local storage
            const completedAppointmentsFromLocalStorage = JSON.parse(localStorage.getItem('completedAppointments')) || [];
            const updatedCompletedAppointments = [...completedAppointmentsFromLocalStorage, appointmentId];
            localStorage.setItem('completedAppointments', JSON.stringify(updatedCompletedAppointments));

            // Update revenue based on all services in the appointment
            if (appointmentServices && Array.isArray(appointmentServices)) {
              const appointmentRevenue = appointmentServices.reduce((total, service) => {
                return total + service.price;
              }, 0);

              console.log('Appointment Revenue:', appointmentRevenue);

              const updatedRevenue = totalRevenue + appointmentRevenue;
              console.log('Updated Revenue:', updatedRevenue);

              setTotalRevenue(updatedRevenue);
              localStorage.setItem('totalRevenue', updatedRevenue.toString());

            }
          } else {
            const errorData = await response.json();
            console.error('Error updating appointment status:', errorData);
            // Handle error updating appointment status
          }
        } catch (error) {
          console.error('Error updating appointment status:', error);
          // Handle other errors related to the fetch request or logic
        }
      }
    }
  };



  useEffect(() => {
    const completedAppointmentsFromLocalStorage = JSON.parse(localStorage.getItem('completedAppointments')) || [];
    const updatedAcceptedAppointments = acceptedAppointments.map(appointment => {
      if (completedAppointmentsFromLocalStorage.includes(appointment._id)) {
        return { ...appointment, completed: true };
      }
      return appointment;
    });
    if (JSON.stringify(updatedAcceptedAppointments) !== JSON.stringify(acceptedAppointments)) {
      setAcceptedAppointments(updatedAcceptedAppointments);
    }
  }, [acceptedAppointments]);



  // Columns for Users Table
  const userColumns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (text, record) => (
        <span>{record.isAdmin ? 'Admin' : 'User'}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button
          onClick={() => {
            setIsModalVisible(true);
            setSelectedUser(record);
          }}
        >
          Make Admin
        </Button>
      ),
    },
  ];

  // Columns for Appointments Table
  const appointmentColumns = [
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'userId',
      render: (text, record) => (
        <span>{record.userId ? record.userId.email : 'No User'}</span>
      ),
    },
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
      title: 'Services',
      dataIndex: 'services',
      key: 'services',
      render: (text, record) => (
        <ul>
          {record.services && Array.isArray(record.services) ? (
            record.services.map((service, index) => (
              <li key={index}>
                {service.serviceName}: ₱{service.price}
              </li>
            ))
          ) : (
            <li>No services available</li>
          )}
        </ul>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button onClick={() => handleAppointmentAction(record._id, 'accept')}>
            Accept
          </Button>
          <Button onClick={() => handleAppointmentAction(record._id, 'decline')}>
            Decline
          </Button>
        </>
      ),
    },
  ];

  const acceptedAppointmentColumns = [
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'userId',
      render: (text, record) => (
        <span>{record.userId ? record.userId.email : 'No User'}</span>
      ),
    },
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
      title: 'Services',
      dataIndex: 'services',
      key: 'services',
      render: (text, record) => (
        <ul>
          {record.services && Array.isArray(record.services) ? (
            record.services.map((service, index) => (
              <li key={index}>
                {service.serviceName}: ₱{service.price}
              </li>
            ))
          ) : (
            <li>No services available</li>
          )}
        </ul>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          onClick={() => handleCompleteAppointment(record._id, record.services)}
          disabled={record.completed}
        >
          {record.completed ? 'Completed' : 'Complete'}
        </Button>
      ),
    },
  ];


  const generatePDFReport = () => {
    const doc = new jsPDF();

    // Function to generate table rows for the report
    const generateTableRows = (data) => {
      const rows = [];

      data.forEach((appointment) => {
        if (appointment.completed && appointment.services && Array.isArray(appointment.services)) {
          appointment.services.forEach((service) => {
            rows.push([
              appointment.userId ? appointment.userId.email : 'No User',
              appointment.date,
              service.serviceName,
              `₱${service.price.toFixed(2)}`,
            ]);
          });
        }
      });

      return rows;
    };

    const completedAppointments = acceptedAppointments.filter((appointment) => appointment.completed);

    const rows = generateTableRows(completedAppointments);

    doc.autoTable({
      head: [['User', 'Date', 'Service', 'Price']],
      body: rows,
    });

    doc.save('sales_report.pdf');
  };




  return (
    <div style={styles.container}>
      <Tabs defaultActiveKey="dashboard">
        <TabPane key="dashboard" tab="Dashboard">
          {/* Display analytics, total revenue, etc. */}
          <h2 style={styles.heading}>Total Revenue: ₱{totalRevenue.toFixed(2)}</h2>
          {/* ... Other dashboard analytics */}
          {/* Button to generate PDF report */}
          <Button type="primary" style={styles.button} onClick={generatePDFReport}>
            Generate Sales Report (PDF)
          </Button>
        </TabPane>
        <TabPane key="users" tab="Users">
          <Table dataSource={userData} columns={userColumns} />
          {/* Modal for making user admin */}
          <Modal
            title={`Make ${selectedUser?.lastName} an Admin`}
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={() => makeUserAdmin(selectedUser?.id)}>
                Make Admin
              </Button>,
            ]}
          >
            {/* User details or any additional information */}
            {selectedUser && (
              <p>
                Name: {selectedUser.lastName}, Email: {selectedUser.email}
              </p>
            )}
          </Modal>
        </TabPane>
        <TabPane key="appointments" tab="Appointments">
          <Table dataSource={appointmentData} columns={appointmentColumns} />
        </TabPane>
        <TabPane key="acceptedAppointments" tab="Accepted Appointments">
          <Table dataSource={acceptedAppointments} columns={acceptedAppointmentColumns} />
        </TabPane>
      </Tabs>

      {/* Modal for making user admin */}
      <Modal
        title={`Make ${selectedUser?.lastName} an Admin`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => makeUserAdmin(selectedUser?.id)}>
            Make Admin
          </Button>,
        ]}
      >
        <div style={styles.modalContent}>
          {/* User details or any additional information */}
          {selectedUser && (
            <p>
              Name: {selectedUser.lastName}, Email: {selectedUser.email}
            </p>
          )}
        </div>
      </Modal>

      {/* Additional styling for tables */}
      <style>
        {`
        .ant-table {
          border-radius: 5px;
          overflow: hidden;
        }
        .ant-table-thead > tr > th {
          background-color: #f2f2f2;
          font-weight: bold;
          text-align: left;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #e8e8e8;
          padding: 12px;
        }
        .ant-table-pagination {
          margin-top: 20px;
          text-align: right;
        }
        .ant-modal-content {
          border-radius: 8px;
        }
        /* Add more custom styles as needed */
      `}
      </style>
    </div>
  );
};

export default Dashboard;


