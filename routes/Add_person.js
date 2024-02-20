const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const cookiParser = require("cookie-parser");
const person_data = require("../models/Person_Schema");
const bcryptjs = require("bcryptjs");
const sixDigitRandomNumber = Math.floor(Math.random() * 900000) + 100000;
router.use(cookiParser()); //to store cookies

// console.log(sixDigitRandomNumber);
// code to send mail with nodemailer

// code to add person_data with validation
router.post("/", async (req, res) => {
  const url = req.protocol + "://" + req.get("host");

  // Check if required fields are present
  const requiredFields = ["name", "email", "password", "phone_no"];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ message: `${field} is required`, status: "error" });
    }
  }

  // Check if email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    return res
      .status(400)
      .json({ message: "Invalid email address", status: "error" });
  }

  // Check if phone_no is a valid number
  const phoneNo = req.body.phone_no;
  if (isNaN(phoneNo) || phoneNo.length !== 10) {
    return res.status(400).json({
      message: "Phone number must be a valid 10-digit number",
      status: "error",
    });
  }

  // code to send email for verification
  const OTPemail = req.body.email;
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // set to true if you're using SSL/TLS
    auth: {
      user: "support@motilearn.info",
      pass: "Sahil@2024",
    },
  });

  const sendEmailOtp = (OTPemail) => {
    // Define email options
    const mailOptions = {
      from: "support@motilearn.info", // replace with your email
      to: OTPemail,
      subject: "TESTING EMAIL VERIFICATION",
      text: `Hello

OTP Code: ${sixDigitRandomNumber}

Above is your login verification code for Motilearn.com

Thank you,
The Motilearn Team `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send("Email sent: " + info.response);
    });
  };
  sendEmailOtp(OTPemail);

  // code to hash password
  const salt = await bcryptjs.genSalt();
  const hashed_password = await bcryptjs.hash(req.body.password, salt); //for hashing password

  // code to make random otp
  const unique_Id = Math.floor(Math.random() * 1000000000 + 1);

  const fetchedEmailOtp = req.body.email_otp;

  console.log("fetchedEmailOtp : " + fetchedEmailOtp);
  console.log("sixDigitRandomNumber : " + sixDigitRandomNumber);

  // code to match otp with cookies otp then it will give permessioin to signin
  const student = new person_data({
    name: req.body.name,
    email: req.body.email,
    password: hashed_password,
    unique_Id: unique_Id,
    phone_no: req.body.phone_no,
    gender: req.body.gender,
    dob: req.body.dob,
    otp: sixDigitRandomNumber,
  });

  try {
    // const newstudent = await student.save();
    // if (fetchedEmailOtp === sixDigitRandomNumber) {
    const newstudent = await student.save();
    res.status(201).json({
      message: "Student Registered",
      status: "success",
      data: newstudent,
    });
    // } else {
    //   console.log("Verification failed");
    // }

    // Additional code for updating class can be added here
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// code to delete by id
router.delete("/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const getstudentById = await person_data.findByIdAndDelete({
      _id: req.params.id,
    });
    res.json({
      message: "Student deleted",
    });
  } catch (error) {
    console.log("Error in getting student by Id", error);
    res.status(400).json({
      message: "Error",
      status: "Error",
    });
  }
});

// code to get student by id
router.get("/getstudent/:id", async (req, res) => {
  try {
    const classbyId = await person_data.findById(req.params.id);
    // .populate([{ path: "classStudents" }]);
    res.json(classbyId);
  } catch (error) {
    res.status(400).json({ message: error.message, status: "error" });
  }
});

// code to get all students
router.get("/", async (req, res) => {
  try {
    const student = await person_data.find();
    // const totalStudent = student.length;
    res.json({
      student: student,
      totalStudents: student.length,
    });
  } catch (error) {
    console.log("Error in getting student ", error);
    res.status(400).json({
      message: "Error",
      status: "Error",
    });
  }
});

module.exports = router;
