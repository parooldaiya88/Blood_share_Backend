import express from "express";

import { protect } from "../controllers/authController.js";
import {
  userSupplyController,
  getSupplyController,
  donationOfBloodSupplyController,
  utilizationOfBloodSupplyController,
} from "../controllers/supplyController.js";

const router = express.Router();

router.post("/add", protect, userSupplyController);
router.get("/get", protect, getSupplyController);
router.get("/utilization", protect, utilizationOfBloodSupplyController);
router.get("/donation", protect, donationOfBloodSupplyController);
export default router;
