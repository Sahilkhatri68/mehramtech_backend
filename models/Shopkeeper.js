const mongoose = require("mongoose");

const shopkeeperSchema = {
  shopname: {
    type: String,
    require: true,
  },
  shopkeeperName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  uniqueId: {
    type: Number,
    require: true,
  },
  shopaddress: {
    type: String,
    require: true,
  },
  shopkeeperphoneno: {
    type: Number,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  state: {
    type: String,
    require: true,
  },
  district: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },

  joindate: {
    type: Date,
    default: Date.now,
  },
  productsforservices: [
    {
      type: mongoose.Types.ObjectId,
      ref: "device_request",
    },
  ],
};

module.exports = mongoose.model("shopkeeperSchema", shopkeeperSchema);
