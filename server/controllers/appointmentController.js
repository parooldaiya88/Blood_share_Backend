import Appointment from "../models/appointmentModel.js";
import successHandler from "../middlewares/successHandler.js";




export const addAppointmentController = async (req, res, next) => {
    try {
      const appointment = new Appointment(req.body); //it will not return promise
      await appointment.save();
      successHandler(res, 201, appointment);
    } catch (error) {
      next(error);
    }
  };