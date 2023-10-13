import Users from "../models/userModel.js";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import { handleErrors } from "../middlewares/errorHandler.js";
import bcrypt from "bcryptjs";
import nodemailer from 'nodemailer'
//! Create token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
//! Response handler
const sendResponse = (res, statusCode, token, user) =>
  res.status(statusCode).json({
    message: "success",
    success: true,
    status: statusCode,
    token,
    user,
  });
//! Register controller
export const register = async (req, res, next) => {
  try {
    const userExist = await Users.findOne({ email: req.body.email });
    if (userExist) {
      return res.send({ success: false, message: "User already exist" });
    }
    const user = await Users.create(req.body);
    const token = signToken(user._id);
    sendResponse(res, 201, token, user);
  } catch (error) {
    next(error);
  }
};
//! login controller
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createError(400, "Please provide email and password");
    }
    const user = await Users.findOne({ email });
    const correct = await user.correctPassword(password, user.password);
    if (!user || !correct) {
      const user = await Users.create(req.body);
      const token = signToken(user._id);
      sendResponse(res, 201, token, user);
      throw createError(401, "Incorrect email or password");
    }
    const token = signToken(user._id);
    sendResponse(res, 200, token, user);
  } catch (error) {
    next(error);
  }
};
//! Protect route middleware
export const protect = async (req, res, next) => {
  try {
    let token;
    const { authorization } = req.headers;
    //* 1)  Check if token is exist
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
    }
    if (!token) {
      throw createError(404, "Please login to access this resource");
    }
    //* 2) Verify the token
    // const decoded = jwt.verify(
    //   token,
    //   process.env.JWT_SECRET,
    // (error, decodedValue) => {
    //   if (error) {
    //     throw createError(403, error.message);
    //   }
    //   return decodedValue;
    // }
    //);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //req.body.id = decoded.id;//! This is creating problem because when we submit supply, ID is already filled with organization id

    //* 3) Check if user is still exist
    const user = await Users.findById(decoded.id);
    if (!user) {
      throw createError(
        401,
        "The user belonging to this token is no longer exist"
      );
    }
    req.user = user;
    req.user.id = decoded.id;
    next();
  } catch (error) {
    next(error);
  }
};

//! forgot Password controller
export const forgotPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;
    // if (!email) {
    //   res.send({
    //     success: false,
    //     message: "Email is required",
    //   });
    // }
    //check
    const user = await Users.findOne({ email });
    //validation
    if (!user) {
      res.send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const token = signToken(user._id);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bloodshare9@gmail.com",
        pass: "eiso yzlv xjqh zmye",
      },
    });
    var mailOptions = {
      from: "bloodshare9@gmail.com",
      to: email,
      subject: "Reset your password",
      text:`Please reset your password by using following link: https://blood-share-frontend.onrender.com/#/reset-password/${user._id}/${token}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.send({
          success: false,
          message: error.message,
        });
      } else {
        res.send({
          success: true,
          message: "Email Sent",
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

//! Reset Password controller
export const resetPasswordController = async (req, res, next) => {
  const { password } = req.body;
  const { id, token } = req.params;

   jwt.verify(
    token,
    process.env.JWT_SECRET,
    async (error, decodedValue) => {
      if (error) {
        return res
          .status(400)
          .json({ error: "Error occurred while verifying token" });
      } else {
        try {
          const hash = await bcrypt.hash(password, 12);
          await Users.findByIdAndUpdate(
            { _id:id },
            { password:hash }
          );
          res.send({
            success: true,
            message: "Password Reset Successfully",
          });
        } catch (error) {
          res.send({
            success: true,
            message: "Password Reset Failed",
          });
        }
      }
    }
  );
};
