//  ============== MAIN SERVER INDEX FILE =========================// 

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const app = express();
const protect = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");
const courseRoutes = require("./routes/courseRoutes");
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

app.use("/api/auth", authRoutes);

app.use("/api/courses", courseRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LMS API is running",
  });
});
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Frontend and Backend are connected!",
  });
});

app.get("/api/auth/protected", protect, (req, res) => {
  res.json({
    success: true,
    message: "You can access this protected route!",
    user: req.user,
  });
});
app.get(
  "/api/admin/test",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin! You have access to this route.",
      user: req.user,
    });
  }
);
app.get(
  "/api/student/test",
  protect,
  authorizeRoles("student"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Student! You have access to this route.",
      user: req.user,
    });
  }
);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});