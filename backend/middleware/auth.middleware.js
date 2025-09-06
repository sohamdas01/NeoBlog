

import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  try {
    let token;
    
    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } 
    // If no Authorization header, check for cookie
    else if (req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }
      req.user = user; // Attach user info to request object
      next();
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

