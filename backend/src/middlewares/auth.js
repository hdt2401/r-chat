import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const secureRoute = async (req, res, next) => {
  try {
    // get token from Authorization header
    const authHeader = req?.headers['authorization'];   
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // compare token with secret key
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(403).json({ message: 'Token has expired or uncorrect' });
      }
      const user = await User.findById(decodedUser.userId).select('-hashedPassword');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      req.user = user;
      next();
    });    
  } catch (error) {
    console.log("Something went wrong with auth jwt!", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};