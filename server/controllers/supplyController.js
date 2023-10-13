import mongoose from "mongoose";
import Supply from "../models/supplyModel.js";
import Users from "../models/userModel.js";
import successHandler from "../middlewares/successHandler.js";

//userSupplyController is connected with AddSupply inside supply.js
//will be use in organization profile to check the availability of blood in our blood store(SupplyForm.jsx)
export const userSupplyController = async (req, res, next) => {
  try {
    const { email, supplyType, bloodGroup, quantity, organization } = req.body;
    // Find the user by email
    const user = await Users.findOne({ email });
    if (!user) throw new Error("Invalid Email");
    if (
      (supplyType === "in" && user.userType !== "donor") ||
      (supplyType === "out" && user.userType !== "hospital")
    ) {
      throw new Error(`This email is not registered as a ${user.userType}`);
    }

    if (supplyType === "out") {
      //Before Giving Blood out here we are going to check if we have enough blood to give out. otherwise will throw error written in line 50

      const inSupplyEntries = await Supply.find({
        supplyType: "in",
        bloodGroup,
        organization: new mongoose.Types.ObjectId(organization),
      });
      const outSupplyEntries = await Supply.find({
        supplyType: "out",
        bloodGroup,
        organization: new mongoose.Types.ObjectId(organization),
      });
      // Calculate available quantity
      const totalIn = inSupplyEntries.reduce(
        (total, entry) => total + entry.quantity,
        0
      );
      console.log(totalIn);
      const totalOut = outSupplyEntries.reduce(
        (total, entry) => total + entry.quantity,
        0
      );

      const availableQuantityOfRequestedGroup = totalIn - totalOut;
      if (availableQuantityOfRequestedGroup < quantity) {
        throw new Error(
          `Only ${availableQuantityOfRequestedGroup} units of ${bloodGroup.toUpperCase()} is available`
        );
      }
      //user.id is decoded.id from protect function
      req.body.hospital = user.id;
      console.log(user.id);
    } else {
      req.body.donor = user.id;
    }
    const supply = new Supply(req.body);
    await supply.save();
    successHandler(res, 200, supply);
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
//getSupplyController is connected to GetSupply inside supplyApi.js
//.populate() method in Mongoose, you will receive an array of created instances of the data instead of the actual data from related collections
export const getSupplyController = async (req, res, next) => {
  try {
    //pagination is implemented using below code, it's inside supplyApi.js & Supply.jsx
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    // Query the database with pagination
    const supply = await Supply.find({
      organization: req.user.id,
    })
      .sort({ createdAt: -1 })
      .populate("donor")
      .populate("hospital")
      .skip(skip)
      .limit(limit);
    res.send({
      success: true,
      data: supply,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

// export const getSupplyController = async (req, res, next) => {
//   try {
//     const apiQuery = new ApiQueryHandler(Supply, req.query).paginateDocs();

//     const supply = await apiQuery.model;

//     res.send({
//       success: true,
//       data: supply,
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: error.message,
//     });
//   }
// };

//utilizationOfBloodSupplyController is connected with utilizationOfBloodSupply inside supplyApi.jsx
export const utilizationOfBloodSupplyController = async (req, res, next) => {
  try {
    const supply = await Supply.find({ hospital: req.user.id })
      .sort({ createdAt: -1 })
      .populate("organization");

    console.log(supply);
    res.send({
      success: true,
      data: supply,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

//DonationOfBloodSupplyController is connected with donationOfBloodSupply inside supplyApi.jsx
export const donationOfBloodSupplyController = async (req, res, next) => {
  try {
    const supply = await Supply.find({ donor: req.user.id })
      .sort({ createdAt: -1 })
      .populate("organization");

    console.log(supply);
    res.send({
      success: true,
      data: supply,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

//This controller is connected with GetAllBloodGroups inside supplyApi.jsx and it is responsible for displaying DashboardOrganizations
export const getAllBloodGroupsController = async (req, res, next) => {
  try {
    const allBloodGroups = ["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"];
    const bloodGroupData = [];
    //Before Giving Blood out here we are going to check if we have enough blood to give out. otherwise will throw error written in line 50
    await Promise.all(
      allBloodGroups.map(async (bloodGroup) => {
        const inSupplyEntries = await Supply.find({
          supplyType: "in",
          bloodGroup,
          organization: new mongoose.Types.ObjectId(req.user.id),
        });
        const outSupplyEntries = await Supply.find({
          supplyType: "out",
          bloodGroup,
          organization: new mongoose.Types.ObjectId(req.user.id),
        });
        //Calculate available quantity
        const totalIn = inSupplyEntries.reduce(
          (total, entry) => total + entry.quantity,
          0
        );
        console.log(totalIn);
        const totalOut = outSupplyEntries.reduce(
          (total, entry) => total + entry.quantity,
          0
        );
        console.log(inSupplyEntries);
        console.log(outSupplyEntries);
        console.log(totalOut);

        const available = totalIn - totalOut;

        bloodGroupData.push({
          bloodGroup,
          totalIn,
          totalOut,
          available,
        });
      })
    );

    res.send({
      success: true,
      message: "all Blood Groups fetched Successfully",
      data: bloodGroupData,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
