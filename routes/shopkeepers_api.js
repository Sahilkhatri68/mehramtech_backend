const express = require("express");
const router = express.Router();
const shopkeeperSchema = require("../models/Shopkeeper");

// code to get shopkeepers list
router.get("/", async (req, res) => {
  try {
    const shopkeepers = await shopkeeperSchema.find();
    // const totalStudent = shopkeepers.length;
    res.json(shopkeepers);
  } catch (error) {
    console.log("Error in getting shopkeepers ", error);
    res.status(400).json({
      message: "Error",
      status: "Error",
    });
  }
});

// code to get shopkeeper form id
router.get("/:id", async (req, res) => {
  try {
    const shopkeeper = await shopkeeperSchema.findById(req.params.id);
    if (!shopkeeper) {
      return res.status(404).json({
        message: "Shopkeeper not found",
        status: "Error",
      });
    }

    res.json(shopkeeper);
  } catch (error) {
    console.log("Error in getting shopkeeper by ID", error);
    res.status(400).json({
      message: "Error",
      status: "Error",
    });
  }
});

// code to post shopkeeper in db
router.post("/", async (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  console.log("URL IS " + url);
  console.log(req.body);

  const uniqueId = Math.floor(Math.random() * 1000000000 + 1);
  const shopkeeper = new shopkeeperSchema({
    shopname: req.body.shopname,
    shopkeeperName: req.body.shopkeeperName,
    email: req.body.email,
    uniqueId: uniqueId,
    shopaddress: req.body.shopaddress,
    shopkeeperphoneno: req.body.shopkeeperphoneno,
    country: req.body.country,
    state: req.body.state,
    district: req.body.district,
    city: req.body.city,
  });

  try {
    const newshopkeeper = await shopkeeper.save();
    res.status(201).json({
      message: "Shopkeeper Registered",
      status: "success",
      data: newshopkeeper,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// code to delete shops by id
router.delete("/:id", async (req, res) => {
  try {
    await shopkeeperSchema.findByIdAndDelete({
      _id: req.params.id,
    });
    res.json({
      message: "Shop deleted Successfuly",
      status: "success",
    });
  } catch (error) {
    console.log("Error in getting shop by Id", error);
    res.status(400).json({
      message: "Error",
      status: "Error",
    });
  }
});
module.exports = router;
