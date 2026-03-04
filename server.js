require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");

// Database Connection
const connectDB = require("./config/db");
const app = express();
connectDB();

// 2. Global Middleware (Security & Parsing)
app.use(helmet()); // Sets secure HTTP headers
app.use(cors()); // Allows your future React/React Native apps to connect
app.use(express.json()); // Parses incoming JSON payloads
app.use(mongoSanitize()); // Prevents NoSQL injection attacks

// Morgan will log every API request to the terminal in development mode
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// 4. Routes (Health Check)
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CityFix API is running securely!",
        environment: process.env.NODE_ENV
    });
});

// 5. Global Error Handler Placeholder (We build this next!)
// app.use(errorHandler);

// 6. Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});