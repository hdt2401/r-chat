import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";

import authRoutes from "./routes/auth.js";

dotenv.config({ override: true });
const app = express();
const PORT = process.env.PORT || 3006;

// Middleware to parse JSON requests
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// public routes
app.use("/api/auth", authRoutes);

// Start the server after connecting to the database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
});
