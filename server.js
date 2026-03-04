require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");

const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");

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

// Use a regular expression directly - this is the "Universal" way
app.all(/.*/, (req, res, next) => {   // We create a new AppError and pass it into next(). 
    // Express immediately skips everything else and jumps to the Error Handler.
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// 2. THE GLOBAL ERROR HANDLER: This catches the error from above, or any database crashes.
app.use(errorHandler);

// 6. Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});