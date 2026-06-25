import dotenv from "dotenv";
import connectDB from "../src/db/index.js";

dotenv.config({
    path :"./env"
})



connectDB()










/*.........................................................................................
-------------------------------------------------------------------------------------------
 This is a common pattern of connecting to the database before starting the Express server.
 ------------------------------------------------------------------------------------------
 ..........................................................................................


import mongoose from "mongoose";
import express from "express";
import { DB_NAME } from "./constant.js"; // Correct file name

const app = express();

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

    console.log("✅ Database Connected Successfully");

    // Listen for Express errors
    app.on("error", (error) => {
      console.error("❌ Application could not talk to the database:", error);
      throw error;
    });

    // Start the server only after DB connection
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });

  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Stop the application
  }
})();

*/