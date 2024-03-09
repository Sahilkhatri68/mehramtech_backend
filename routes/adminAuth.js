const express = require("express");
const router = express.Router();
const adminSchema = require("../models/Admin");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookiParser = require("cookie-parser");
require("dotenv").config();
router.use(cookiParser());

// code to login shopkeeper with email and unique_id
router.post("/adminLogin", async (req, res) => {
  try {
    const { adminEmail, password } = req.body;
    const fetchedAdmin = await adminSchema.findOne({ adminEmail }).lean();
    if (!fetchedAdmin)
      return res
        .status(400)
        .json({ message: "Admin Email is wrong ", status: "warning" });

    const hash_psw = fetchedAdmin.password;

    if (!bcryptjs.compareSync(password, hash_psw))
      return res
        .status(400)
        .json({ message: "Admin Passord is wrong ", status: "warning" });

    // token
    const token = jwt.sign(
      {
        id: fetchedAdmin._id,
        adminEmail: fetchedAdmin.adminEmail,
      },
      process.env.JWT_SECRET
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 300,
      sameSite: "none",
      secure: true,
    });

    res.setHeader("x-auth-token", token);

    res.status(200).json({
      message: "login success",
      status: "success",
      token: token,
      fetchedAdmin: res.locals.fetchedAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// code to check admin have token or not
router.get("/check_have_token", async (req, res) => {
  try {
    let token = req.cookies["auth_token"] || req.headers["x-auth-token"];

    if (!token) {
      return res.status(400).json({
        message: "No token provided",
        token: null,
      });
    }

    const have_valid_token = jwt.verify(token, process.env.JWT_SECRET);

    const id_from_token = have_valid_token.id;

    // Use async/await to wait for the result
    const user_id = await adminSchema.findById(id_from_token);

    if (!user_id) {
      return res.status(400).json({
        message: "Error",
        token: null,
      });
    } else {
      return res.status(200).json({
        token: true,
        info: user_id,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

// code to adminlogout
router.post("/adminlogout", (req, res) => {
  try {
    // Clear the authentication token from cookies
    res.clearCookie("auth_token");

    res.status(200).json({ message: "Logout success", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

module.exports = router;
