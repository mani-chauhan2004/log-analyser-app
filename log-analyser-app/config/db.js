const mongoose = require("mongoose");
const { Client } = require("@elastic/elasticsearch");

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);

        // Retry logic: Retry connection if it fails
        if (process.env.NODE_ENV !== "production") {
            console.log("Retrying MongoDB connection in 5 seconds...");
            setTimeout(connectDB, 5000); // Retry after 5 seconds
        } else {
            console.error("Unable to connect to MongoDB in production. Exiting.");
            process.exit(1); // Exit the process for production environments
        }
    }
};


// Creating an instance of elastic client class to connect
const elasticClient = new Client({ node: process.env.ELASTICSEARCH_URI });

module.exports = { connectDB, elasticClient };
