//  ============== MAIN SERVER INDEX FILE =========================// 

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const app = express();
const protect = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const userRoutes = require("./routes/userRoutes");
// Connect MongoDB
connectDB();

// Security middlewares
app.use(helmet());

// Basic rate limiting to slow down brute-force/abuse on the whole API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/lessons", lessonRoutes);

app.use("/api/enrollments", enrollmentRoutes);

app.use("/api/users", userRoutes);

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