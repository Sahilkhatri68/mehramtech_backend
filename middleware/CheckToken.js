const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token =
    // (req.headers && req.headers["x-auth-token"]) ||
    req.cookies && req.cookies["auth_token"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Handle specific JWT verification errors
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ error: "Token expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(403).json({ error: "Invalid token" });
      } else {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
