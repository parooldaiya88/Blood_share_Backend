import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import usersRouter from "./routes/userRouter.js";
import supplyRouter from "./routes/supplyRouter.js";
import dashboardRouter from "./routes/dashBoardRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import { handleErrors, throw404 } from "./middlewares/errorHandler.js";
//^ Load environment variables
dotenv.config();

// Create an instance of Express
const app = express();

// Middleware setup
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true, // such as cookies or HTTP authentication) to be included in CORS requests
  })
);
app.use("/supply", supplyRouter);
app.use("/users", usersRouter);
app.use("/dashboard", dashboardRouter);
app.use("/appointment", appointmentRouter);
//^ Error handling middlewares
app.use(throw404);
app.use(handleErrors);

//^ Setup server listening port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

//! In cas you are using the variable DB_URI form .env

const uri = process.env.DB_URI;

mongoose.connect(uri);

mongoose.connection
  .on("error", console.error)
  .on("open", () =>
    console.log(`Connected to MongoDB / ${mongoose.connection.name}`)
  );
