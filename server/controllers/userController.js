import Users from "../models/userModel.js";
import successHandler from "../middlewares/successHandler.js";
import mongoose from "mongoose";
import Supply from "../models/supplyModel.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find();

    successHandler(res, 200, users, users.length);
  } catch (error) {
    next(error);
  }
};

//req.user.id is from protect function which is equal to decoded.id
// getUser is connected with GetCurrentUser inside userApiCalls.js
export const getUser = async (req, res) => {
  try {
    const user = await Users.findOne({ _id: req.user.id });
    res.send({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

//* The Mongoose Query API distinct() method is used to find the distinct values for a particular field in a collection and return the response as an array.

// controller made to fetch all the Donors for organization profile
//getAllDonors is connected to GetAllDonors inside userApiCalls.js
export const getAllDonorsForOrganization = async (req, res, next) => {
  try {
    const organizationId = new mongoose.Types.ObjectId(req.user.id);

    // used a distinct method from mongoose to find out donors who are linked to this organization

    const allDonors = await Supply.distinct("donor", {
      organization: organizationId,
    });
    //The $in operator returns documents where the specified field's value(_id) matches any of the values provided in the array(allDonors)._id(MongoBB)
    const donors = await Users.find({
      _id: { $in: allDonors },
    });

    res.send({
      success: true,
      message: "Donors fetched successfully",
      data: donors,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// controller made to fetch all the Hospitals for organization profile
export const getAllHospitalsForOrganization = async (req, res, next) => {
  try {
    const organizationId = new mongoose.Types.ObjectId(req.user.id);

    // used a distinct method from mongoose to find out hospitals who are linked to this organization
    const allHospitals = await Supply.distinct("hospital", {
      organization: organizationId,
    });

    //The $in operator returns documents where the specified field's value(_id) matches any of the values provided in the array(allHospitals)._id(MongoBB)
    const hospitals = await Users.find({
      // this _id is coming from MongoDb, that is specified for each data
      _id: { $in: allHospitals }, // _id <- $in -> [klinikum, apolo]
    });

    res.send({
      success: true,
      message: "Hospitals fetched successfully",
      data: hospitals,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// controller made to fetch all the organizations for Donor profile
export const getDisplayedOrganizationsForDonor = async (req, res, next) => {
  try {
    const donorID = new mongoose.Types.ObjectId(req.user.id);
    // used a distinct method from mongoose

    const allOrganizations = await Supply.distinct("organization", {
      donor: donorID,
    });

    const donors = await Users.find({
      _id: { $in: allOrganizations },
    });
    res.send({
      success: true,
      message: "All Organizations fetched successfully",
      data: donors,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// controller made to fetch all the organizations for hospital profile
export const getDisplayedOrganizationsForHospital = async (req, res, next) => {
  try {
    const hospitalID = new mongoose.Types.ObjectId(req.user.id);
    // used a distinct method from mongoose
    console.log(req);
    const allOrganizations = await Supply.distinct("organization", {
      hospital: hospitalID,
    });

    const hospitals = await Users.find({
      _id: { $in: allOrganizations },
    });

    res.send({
      success: true,
      message: "All Organizations fetched successfully",
      data: hospitals,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
