const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookiParser = require("cookie-parser");
require("dotenv").config();
const router = express.Router();
router.use(cookiParser());
const shopkeeperSchema = require("../models/Shopkeeper");

// code to login shopkeeper with email and unique_id
router.post("/", async (req, res) => {
  try {
    const { email, uniqueId } = req.body;
    const fetched_shopkeeper = await shopkeeperSchema.findOne({ email }).lean();

    if (!fetched_shopkeeper)
      return res
        .status(400)
        .json({ message: "Shopkeeper Email is wrong ", status: "warning" });

    const fetched_uniqueId = fetched_shopkeeper.uniqueId;

    if (fetched_uniqueId != uniqueId)
      return res
        .status(400)
        .json({ message: "Shopkeeper Passord is wrong ", status: "warning" });

    // token
    const token = jwt.sign(
      {
        id: fetched_shopkeeper._id,
        email: fetched_shopkeeper.email,
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
      fetched_shopkeeper: res.locals.fetched_shopkeeper,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// code to check shopkeeper is logged in or not
router.get("/check_have_token", async (req, res) => {
  try {
    let token = req.cookies["auth_token"] || req.headers["x-auth-token"];

    const have_valid_token = jwt.verify(token, process.env.JWT_SECRET);

    // get shopkeeper from token
    const id_from_token = have_valid_token.id;

    // check if the shopkeeper with the given ID exists in the database
    const shopkeeper = await shopkeeperSchema.findById(id_from_token);

    if (!shopkeeper) {
      res.status(400).json(false);
    } else {
      res.status(200).json({
        token: true,
        shopkeeperid: id_from_token,
        shopkeeper: shopkeeper, // Return complete information of the shopkeeper
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// shopkeeper LogOut Code

router.post("/shopkeeperLogout", (req, res) => {
  try {
    // Clear the authentication token from cookies
    res.clearCookie("auth_token");

    res.status(200).json({ message: "Logout success", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

module.exports = router;
