const express = require("express");
const router = express.Router();
const adminSchema = require("../models/Admin");
const bcryptjs = require("bcryptjs");

// code to get admin
router.get("/", async (req, res) => {
  try {
    const admin = await adminSchema.find();
    res.json({
      admin: admin,
    });
  } catch (error) {
    console.log("Error in getting student ", error);
    res.status(400).json({
      message: "Error",
      status: "Error",
    });
  }
});

// code to get admin by id
router.get("/getadmin/:id", async (req, res) => {
  try {
    const admin = await adminSchema.findById(req.params.id);
    res.json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message, status: "error" });
  }
});

// code to post admin
router.post("/", async (req, res) => {
  // Check if required fields are present
  const requiredFields = [
    "adminName",
    "adminAge",
    "adminEmail",
    "password",
    "adminAddress",
  ];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ message: `${field} is required`, status: "error" });
    }
  }

  // Check if email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.adminEmail)) {
    return res
      .status(400)
      .json({ message: "Invalid email address", status: "error" });
  }

  // Check if phone_no is a valid number
  //   const phoneNo = req.body.phone_no;
  //   if (isNaN(phoneNo) || phoneNo.length !== 10) {
  //     return res.status(400).json({
  //       message: "Phone number must be a valid 10-digit number",
  //       status: "error",
  //     });
  //   }

  // code to hash password
  const salt = await bcryptjs.genSalt();
  const hashed_password = await bcryptjs.hash(req.body.password, salt); //for hashing password

  // code to match otp with cookies otp then it will give permessioin to signin
  const admin = new adminSchema({
    adminName: req.body.adminName,
    adminAge: req.body.adminAge,
    adminEmail: req.body.adminEmail,
    password: hashed_password,
    adminAddress: req.body.adminAddress,
    phone_no: req.body.phone_no,
  });

  try {
    const newadmin = await admin.save();
    res.status(201).json({
      message: "Admin Registered",
      status: "success",
      data: newadmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// code to change admin availability
// code to change admin availability by toggle from frontend
router.put("/availability/:id", async (req, res) => {
  try {
    // Find the current admin availability
    const adminAvailability = await adminSchema.findById(req.params.id);
    console.log(adminAvailability);
    // Ensure the admin is found before attempting to update availability
    if (!adminAvailability) {
      return res
        .status(404)
        .json({ message: "Admin not found", status: "error" });
    }

    // Toggle the 'available' field
    adminAvailability.available = !adminAvailability.available;

    // Save the updated availability
    await adminAvailability.save();
    res.json({
      message: "Admin availability updated successfully",
      newAvailability: adminAvailability.available,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, status: "error" });
  }
});

module.exports = router;
