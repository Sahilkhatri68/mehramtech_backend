const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  try {
    // Clear the authentication token from cookies
    res.clearCookie("auth_token");

    // Optionally, you can clear any other relevant session data or perform additional cleanup
    // If using JWT, you might want to handle token invalidation on the server side (e.g., store invalidated tokens in a blacklist)

    res.status(200).json({ message: "Logout success", status: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

module.exports = router;
