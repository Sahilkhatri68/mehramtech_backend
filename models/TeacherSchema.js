const mongoose = require("mongoose");

const teacherschema = new mongoose.Schema({
  teachername: {
    type: String,
    require: true,
  },
  teacherage: {
    type: String,
    require: true,
  },
  teacherPhone: {
    type: String,
    require: true,
  },
  teacheremial: {
    type: String,
    require: true,
  },
  teacherpassword: {
    type: String,
    require: true,
  },
  teacheraddress: {
    type: String,
    require: true,
  },
  teacherqualification: {
    type: String,
    require: true,
  },
  assignedclass: [
    {
      type: mongoose.Types.ObjectId,
      ref: "classSchema",
    },
  ],
  teacherKeyId: {
    type: String,
    require: true,
  },
  joindate: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("teacherschema", teacherschema);
