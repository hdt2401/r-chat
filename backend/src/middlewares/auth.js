import jwt from "jsonwebtoken";
import User from "../models/User";

export const secureRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;   
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Something went wrong with auth jwt!", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};