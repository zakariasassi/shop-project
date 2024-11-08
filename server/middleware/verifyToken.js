const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function authenticateToken(req, res, next) {
  // Get the Authorization header from the request
  const authorization = req.headers.authorization;



    // Check if the Authorization header is present
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: "Access denied. No authorization header provided or it is malformed." });
  }

  // Extract the token from the header
  const token = authorization.split(' ')[1];

  if (!token) {
    console.log("Token missing in Authorization header");
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const secret = process.env.TOKEN_SECRET;

    if (!secret) {
      throw new Error("TOKEN_SECRET not set in environment variables");
    }

    // Verify the token
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Attach the decoded token payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.log("Token verification error:", err);
    res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = authenticateToken;
