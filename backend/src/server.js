import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import cookieParser from "cookie-parser";
import { secureRoute } from "./middlewares/auth.js";

dotenv.config({ override: true });
const app = express();
const PORT = process.env.PORT || 3006;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());

// Sample route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// public routes
app.use("/api/auth", authRoutes);

// private routes
app.use(secureRoute);
app.use("/api/user", userRoutes);


// Start the server after connecting to the database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
});
