import express from "express";
import { protect } from "../controllers/authController.js";
import { getAllBloodGroupsController } from "../controllers/supplyController.js";




const router = express.Router();

//This route is connected with GetAllBloodGroups inside supplyApi.jsx
router.get("/get-bloodGroups", protect, getAllBloodGroupsController)
export default router;
