import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    userType: {
      type: String,
      required: true,
      enum: ["donor", "organization", "hospital", "admin"],
    },
    // is required if userType is donor or admin

    name: {
      type: String,
      required: function () {
        if (this.userType === "admin" || this.userType === "donor") {
          return true;
        }
        return false;
      },
    },
    age: {
      type: Number,
      required: function () {
        if (this.userType === "donor") {
          return true;
        }
        return false;
      },
    },
    // is required if userType is hospitalName
    hospitalName: {
      type: String,
      required: function () {
        if (this.userType === "hospital") {
          return true;
        }
        return false;
      },
    },

    // is required if userType is organization

    organizationName: {
      type: String,
      required: function () {
        if (this.userType === "organization") {
          return true;
        }
        return false;
      },
    },
    // is required if userType is organization or hospital

    address: {
      type: String,
      required: function () {
        if (this.userType === "organization" || this.userType === "hospital") {
          return true;
        }
        return false;
      },
    },

    // common for all
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: [8, "password should be 8 characters long"],
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

userSchema.methods.correctPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

export default model("Users", userSchema);
