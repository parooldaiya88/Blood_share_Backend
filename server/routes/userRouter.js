import express from "express";
import { register, login, protect, forgotPasswordController , resetPasswordController} from "../controllers/authController.js";
import {
  getAllUsers,
  getUser,
  getAllDonorsForOrganization,
  getAllHospitalsForOrganization,
  getDisplayedOrganizationsForDonor,
  getDisplayedOrganizationsForHospital,

} from "../controllers/userController.js";
import validateInput from "../middlewares/validateInput.js";
import sanitizeInput from "../middlewares/sanitizeInput.js";

//Routes made
const router = express.Router();
router.post("/register", validateInput, sanitizeInput, register); //!updated sanitizeInput
// router.post("/register", validateInput,register);
router.post("/login", login);
// forget Password

router.post('/forgot-password', forgotPasswordController)

router.post('/reset-password/:id/:token', resetPasswordController)
router.route("/").get(protect, getAllUsers);

router.get("/get-current-user", protect, getUser);
//route for getting all the Donors and calling the controller function given below!
router.get("/get-all-donors", protect, getAllDonorsForOrganization);

//route for getting all the hospitals and calling the controller function given below!
router.get("/get-all-hospitals", protect, getAllHospitalsForOrganization);

//route for getting all organizations and calling  controller function given below!
router.get(
  "/get-displayed-organizations-for-donor",
  protect,
  getDisplayedOrganizationsForDonor
);

//route for getting all organizations for hospital and calling  controller function given below!
router.get(
  "/get-displayed-organizations-for-hospital",
  protect,
  getDisplayedOrganizationsForHospital
);

export default router;
