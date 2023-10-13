import express from "express";

import { protect } from "../controllers/authController.js";
import { addAppointmentController } from '../controllers/appointmentController.js';


const router = express.Router();

router.post("/add-appointment", protect, addAppointmentController)
export default router;
