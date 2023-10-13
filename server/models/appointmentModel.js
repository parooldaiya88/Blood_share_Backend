import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    // common for all
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


export default model("Appointment", appointmentSchema);