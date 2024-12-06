require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db");
const logRoutes = require("./routes/logRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true})); // middleware to handle request body
app.use("/api/logs", logRoutes);

connectDB(); // initiate connection to database

const PORT = process.env.PORT || 3000; // default port to connect to database server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //start the server on defined port
