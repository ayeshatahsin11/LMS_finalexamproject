//  ============== MAIN SERVER INDEX FILE =========================// 

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const app = express();
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const userRoutes = require("./routes/userRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
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

// `CLIENT_URL` can be one URL or a comma-separated list (useful once
// there's more than one frontend deployment - a custom domain alongside
// the default Vercel URL, for example). Trailing slashes are stripped
// here because a browser's Origin header never has one - if the env var
// has a stray "/" at the end (an easy copy-paste mistake), a plain
// string comparison would otherwise silently reject every request.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      // `origin` is undefined for same-origin requests and tools that
      // don't send one at all (curl, Postman, server-to-server) - let
      // those through rather than blocking anything without an Origin header.
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/lessons", lessonRoutes);

app.use("/api/enrollments", enrollmentRoutes);

app.use("/api/users", userRoutes);

app.use("/api/banners", bannerRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LMS API is running",
  });
});

// 404 handler - any request that didn't match a route above lands here,
// so the client always gets clean JSON instead of an HTML error page.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found - ${req.originalUrl}`,
  });
});

// Global error handler - catches anything that reaches next(err), plus
// errors thrown by body-parsing middleware (e.g. malformed JSON) before
// any route/controller ever runs. Without this, those cases would return
// Express's default HTML error page instead of JSON.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Multer throws a plain "File too large" error with no statusCode -
  // give it a proper 413 and a message that names the actual limit
  // instead of falling through to a generic 500.
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "File is too large.",
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});