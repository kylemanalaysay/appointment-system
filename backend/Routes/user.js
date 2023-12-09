import express from "express"
import { updateUser, getUserProfile, getMyAppointments, createAppointment, deleteUserAppointment, updateUserAppointment } from "../Controllers/userController.js";

import { verifyAdmin, verifyUser, authenticate } from '../utils/verifyToken.js';

const router = express.Router()


router.put('/:id',  authenticate, updateUser)
router.get('/profile/me',  authenticate, verifyUser, getUserProfile)
router.get('/appointments/my-appointment', authenticate, verifyUser, getMyAppointments)
router.post('/services/book-appointment', authenticate, verifyUser, createAppointment);
router.put('/appointments/my-appointment/:appointmentId', authenticate, verifyUser, updateUserAppointment);
router.delete('/appointments/my-appointment/:appointmentId', authenticate, verifyUser, deleteUserAppointment);


export default router;