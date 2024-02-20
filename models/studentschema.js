const mongoose = require("mongoose");
require("dotenv").config();

const studentscheman = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  class: [
    {
      type: mongoose.Types.ObjectId,
      ref: "classSchema",
    },
  ],
  section: {
    type: String,
    // require: true,
  },
  age: {
    type: String,
    require: true,
  },
  rollnumber: {
    type: Number,
    // require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    reqired: true,
  },
  fathersname: {
    type: String,
    require: true,
  },
  dob: {
    type: String,
    require: true,
  },
  academicResult: {
    type: String,
    // require: false,
  },
  joindate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("students", studentscheman);
