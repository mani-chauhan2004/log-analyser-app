const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    rawLog: mongoose.Schema.Types.Mixed, // Allows objects or any data type
    fileName: String,                   // Name of the source file
    timestamp: { type: Date, default: Date.now }, // Upload timestamp
    processed: { type: Boolean, default: false }, // Processing status
});

module.exports = mongoose.model("Log", logSchema);
