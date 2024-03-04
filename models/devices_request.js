const mongoose = require("mongoose");
const devices_request = new mongoose.Schema(
  {
    brand: {
      type: String,
      require: true,
    },
    model: {
      type: String,
      require: true,
    },
    imei: {
      type: String,
      require: true,
    },
    problem: {
      type: String,
      require: true,
    },
    problemStatus: {
      type: String,
      require: true,
    },
    productdeliveryStatus: {
      type: String,
      require: true,
    },
    issueresolveStatus: {
      type: String,
      default: "pending",
    },
    requestGenerator: [
      {
        type: mongoose.Types.ObjectId,
        ref: "shopkeeperSchema",
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("device_request", devices_request);
