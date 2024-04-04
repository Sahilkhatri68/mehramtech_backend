const express = require("express");
const router = express.Router();
const shopkeeperSchema = require("../models/Shopkeeper");
const devices_request_schema = require("../models/devices_request");
const authenticateToken = require("../middleware/CheckToken");
// code to get all request
router.get("/", async (req, res) => {
  try {
    const allrequestedDevices = await devices_request_schema
      .find()
      .sort({ createdAt: -1 });
    // const totalStudent = student.length;
    res.json({
      allrequestedDevices,
      totalDevices: allrequestedDevices.length,
    });
  } catch (error) {
    console.log("Error in getting All request ", error);
    res.status(400).json({
      message: "Error",
      status: "Error",
    });
  }
});

// code to get by id
router.get("/:id", async (req, res) => {
  try {
    const product = await devices_request_schema.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not found",
        status: "Error",
      });
    }
    res.json(product);
  } catch (error) {
    console.log("Error in getting ProductforService by ID", error);
    res.status(400).json({
      message: "Error",
      status: "Error",
    });
  }
});

// code to get request by notification status
router.get("/notification/:status", async (req, res) => {
  try {
    const { status } = req.params;

    // Check if status is not "true" or "false" as strings
    if (status !== "true" && status !== "false") {
      return res.status(400).json({ message: "Invalid Status Provided" });
    }

    const requestedNotificationType = await devices_request_schema
      .find({
        notification: status === "true", // Convert string to boolean
      })
      .sort({ createdAt: -1 });

    res.json({
      requestedNotificationType,
      total: requestedNotificationType.length,
    });
  } catch (error) {
    console.log("Error in getting All request ", error);
    res.status(400).json({
      message: "Error",
      status: "Error",
    });
  }
});

// code to get device by issueResolveStatus which is pending
router.get("/issueresolvestatus/:status", async (req, res) => {
  try {
    const { status } = req.params;

    if (
      status !== "pending" &&
      status !== "completed" &&
      status !== "not-completed"
    ) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    const requestedDevices = await devices_request_schema
      .find({ issueresolveStatus: status })
      .sort({ createdAt: -1 });

    res.json({
      requestedDevices,
      totalDevices: requestedDevices.length,
    });
  } catch (error) {
    console.log("Error in getting devices by issueresolveStatus: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// code to update issueresolveStatus of product by getting id
router.put("/:id", async (req, res) => {
  const productId = req.params.id;

  const { issueresolveStatus } = req.body; //to get main value

  try {
    // Find the product by ID and update the issueresolveStatus
    const updatedProduct = await devices_request_schema.findByIdAndUpdate(
      productId,
      { $set: { issueresolveStatus } },
      { new: true } // Return the updated document
    );
    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
        status: "Error",
      });
    }

    res.json({
      message: "IssuresolveStatus updated successfully",
      status: "Success",
      updatedProduct,
    });
  } catch (error) {
    console.error("Error updating issuresolveStatus:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: "Error",
    });
  }
});

// code to delete request by id
router.delete("/:id", async (req, res) => {
  try {
    const getproductbyid = await devices_request_schema.deleteOne({
      _id: req.params.id,
    });

    if (getproductbyid.deletedCount === 1) {
      res.json({
        message: "Product deleted",
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (error) {
    console.log("Error in deleting product by Id", error);
    res.status(500).json({
      message: "Error",
      status: "Error",
    });
  }
});

// code to post request
router.post("/", async (req, res) => {
  const ProductForService = new devices_request_schema({
    brand: req.body.brand,
    model: req.body.model,
    problem: req.body.problem,
    imei: req.body.imei,
    productdeliveryStatus: req.body.productdeliveryStatus,
    requestGenerator: req.body.requestGenerator,
    notification: false,
  });

  try {
    const NewProductForService = await ProductForService.save();
    res.status(201).json({
      message: "Product Registered with Issue",
      status: "success",
      data: NewProductForService,
    });
    // code to get shopkeeper_id
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// code to get product by RequestGenerator in shopkeeper panel
router.get("/shopkeeper-requested-alldevices/:id", async (req, res) => {
  const shopkeeperIdToGetRequestedProducts = req.params.id;

  try {
    const requestedDevices = await devices_request_schema.find({
      requestGenerator: shopkeeperIdToGetRequestedProducts,
    });

    if (requestedDevices.length > 0) {
      res.json(requestedDevices);
      // console.log(requestedDevices);
    } else {
      res.status(404).json({ error: "Requested devices not found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

module.exports = router;
