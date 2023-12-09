import User from "../models/userSchema.js";
import Booking from "../models/bookingSchema.js";
import nodemailer from 'nodemailer';

export const updateUser = async (req, res) => {
  const id = req.params.id

  try {
    const updateUser = await User.findByIdAndUpdate(id, { $set: req.body }, { new: true })

    res.status(200).json({ success: true, message: "Successfully updated", data: updateUser })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" })
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id

  try {
    await User.findByIdAndDelete(id)

    res.status(200).json({ success: true, message: "Successfully deleted", })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" })
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id

  try {
    const user = await User.findById(id)

    res.status(200).json({ success: true, message: "User found", data: user })
  } catch (err) {
    res.status(404).json({ success: false, message: "No user found" })
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false });

    res.status(200).json({ success: true, message: "Users found", data: users });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId

  try {
    const user = await User.findById(userId)

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" })
    }
    const { password, ...rest } = user._doc
    res.status(200).json({ success: true, message: "Profile info is getting", data: { ...rest } })
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong, cannot get" })
  }
};


export const getMyAppointments = async (req, res) => {

  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let appointments;
    if (user.isAdmin) {
      appointments = await Booking.find().populate('userId');
    } else {
      appointments = await Booking.find({ userId });
    }

    res.status(200).json({ success: true, message: 'Appointments retrieved', data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong, could not retrieve appointments' });
  }
};



export const createAppointment = async (req, res) => {
  const { date, time, services } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newAppointment = new Booking({
      userId: user._id,
      date,
      time,
      services,
      status: 'Pending',
    });

    const savedAppointment = await newAppointment.save();

    user.appointments.push(savedAppointment._id);
    await user.save();


    res.status(201).json({ success: true, message: 'Appointment created', data: savedAppointment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create appointment', error: err.message });
  }
};

export const updateAppointmentAndNotify = async (req, res) => {
  const { appointmentId } = req.params;
  const { action } = req.body; // Assuming 'action' is provided in the request body

  try {
    let statusToUpdate = 'Accepted';
    let emailText = '';

    const updatedAppointment = await Booking.findByIdAndUpdate(
      appointmentId,
      { status: statusToUpdate },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const user = await User.findById(updatedAppointment.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }


    if (action === 'decline') {
      statusToUpdate = 'Declined';
      emailText = `
      Dear ${user.firstName} ${user.lastName},
      
      We regret to inform you that your booking request on ${updatedAppointment.date} at ${updatedAppointment.time} has been declined. 
      While we appreciate your interest in our offerings, we are unable to accommodate your request at this time.
      
      The reasons for the decline may include:
      - Availability: The event/service you requested is fully booked or not available on the specified date and time.
      - Technical issues: There might have been a technical problem with the booking process.
      
      We apologize for any inconvenience this may cause and appreciate your understanding. We hope you will consider trying to book the event/service again in the future, as we would be delighted to have you as our guest.
      
      In the meantime, if you have any questions or concerns, please do not hesitate to reach out to us. We are here to help and ensure that your experience with us is exceptional.
      
      Thank you for your interest in Petra and Pepita Salon. We look forward to serving you in the future.
      
      Best regards,
      Petra and Pepita Salon
      `;
    } else {
      emailText = `
      Dear ${user.firstName} ${user.lastName},
      
      We are pleased to confirm that your booking on ${updatedAppointment.date} at ${updatedAppointment.time} 
      is now confirmed. Thank you for choosing us to provide you with this experience. We look forward to welcoming you and ensuring a memorable time.
      
      Your booking details are as follows:
      Date: ${updatedAppointment.date}
      Time: ${updatedAppointment.time}
      
      Best regards,
      Petra and Pepita Salon
      `;
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "petraandpepita447@gmail.com",
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: "petraandpepita447@gmail.com",
      to: user.email,
      subject: 'Appointment Accepted',
      text: emailText,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Appointment status updated and email sent' });
  } catch (error) {
    console.error('Error updating appointment and sending email:', error);
    res.status(500).json({ success: false, message: 'Error updating appointment and sending email' });
  }
};


export const updateUserAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const { date, time, services } = req.body;

  try {
    const updatedAppointment = await Booking.findByIdAndUpdate(
      appointmentId,
      { date, time, services },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, message: 'Appointment updated', data: updatedAppointment });
  } catch (error) {
    console.error('Error updating user appointment:', error);
    res.status(500).json({ success: false, message: 'Failed to update appointment' });
  }
};


export const deleteUserAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const deletedAppointment = await Booking.findByIdAndDelete(appointmentId);

    if (!deletedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { appointments: appointmentId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    console.error('Error deleting user appointment:', error);
    res.status(500).json({ success: false, message: 'Failed to delete appointment' });
  }
};






