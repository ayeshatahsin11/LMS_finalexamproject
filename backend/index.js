const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");

const app = express();

// Connect MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LMS API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});