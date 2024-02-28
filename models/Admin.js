const express = require("express");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  adminName: {
    type: String,
    require: true,
  },
  adminAge: {
    type: Number,
    require: true,
  },
  adminEmail: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  phone_no: {
    type: Number,
    require: true,
  },
  adminAddress: {
    type: String,
    require: true,
  },
  adminavailability: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("admindetail", adminSchema);
