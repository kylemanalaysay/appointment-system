import express from "express"
import { updateUser, deleteUser, getAllUser, getSingleUser, getUserProfile, getMyAppointments, updateAppointmentAndNotify } from "../Controllers/userController.js";

import { verifyAdmin, verifyUser, authenticate } from '../utils/verifyToken.js';

const router = express.Router()

router.get('/:id', authenticate, verifyAdmin, getSingleUser)
router.get('/',  authenticate, verifyAdmin, getAllUser)
router.put('/:id',  authenticate, updateUser)
router.delete('/:id',  authenticate, verifyAdmin, deleteUser)
router.get('/profile/me', authenticate, verifyAdmin)
router.get('/profile/me/users', authenticate, verifyAdmin, getAllUser)
router.get('/profile/me/appointments', authenticate, verifyAdmin, getMyAppointments )
router.put('/profile/me/appointments/:appointmentId', authenticate, verifyAdmin, updateAppointmentAndNotify)
router.get('/profile/me/appointments/:appointmentId', authenticate, verifyAdmin)


export default router;