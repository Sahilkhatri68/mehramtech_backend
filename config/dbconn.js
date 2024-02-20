require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Motilearn_DB is connected successfully...");
  } catch (error) {
    console.log("Motilearn_DB not connected!....", error);
  }
};
module.exports = connectDB;
