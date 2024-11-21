const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const studentRoutes = require("./routes/student");
const teacherRoutes = require("./routes/teacher");
const classRoutes = require("./routes/class");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
const fileupload = require("express-fileupload");

// Load environment variables
dotenv.config({ path: "./.env" });

const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON requests
app.use(express.json());
app.use(fileupload());

// Middleware for logging in development mode
if (process.env.NODE_ENV === "development") {
  app.use(logger);
}

app.use(cookieParser());

// Mount the routes
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/auth", authRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).send("School Management API");
});

// Use the error handler middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
