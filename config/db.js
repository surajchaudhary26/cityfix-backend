const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Connect to MongoDB using the URI from our .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        // If the database fails, the app shouldn't run. Exit with failure (1).
        process.exit(1); 
    }
};

module.exports = connectDB;