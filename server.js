require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// 1. Import Internal Modules
const connectDB = require("./config/db");
const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");
const issueRouter = require("./routes/issueRoutes");

// 2. Initialize App
const app = express();

// 3. Global Middleware (Security & Parsing)
app.use(helmet()); // Sets secure HTTP headers
app.use(cors()); // Allows cross-origin requests for Frontend/Mobile
app.use(express.json()); // Parses incoming JSON payloads

// Logging for Development
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// 4. Routes
// Health Check: To verify server status
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CityFix API is running securely!",
        environment: process.env.NODE_ENV
    });
});

// Mounting Issue Routes
app.use("/api/v1/issues", issueRouter);

// 5. Error Handling
// Catch-all for undefined routes (Express 5/Node 25 compatible)
app.all(/.*/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler Middleware
app.use(errorHandler);

// 6. Database Connection & Server Start
const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();
        
        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();