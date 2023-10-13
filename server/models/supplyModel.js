import mongoose from "mongoose";
import { Schema, model } from "mongoose";
//import userModel from "./userModel";

const bloodSupplySchema = new Schema(
  {
    supplyType: {
      type: String,
      required: true,
      enum: ["in", "out"],
    },
    // is required if supplyType is in or out

    bloodGroup: {
      type: String,
      required: true,
      //Already given in frontend in supplyForm
      // enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    quantity: {
      type: Number,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    
    },
    //*if supplyType is out ,  then hospital will be required.
    //*If supplyType is in, Donor will be required.
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: function () {
        return this.supplyType === "out"
        
      },

      
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: function () {
        return this.supplyType === "in";
      },
    },
  },

  {
    timestamps: true,
  }
);

export default model("Supply", bloodSupplySchema);
