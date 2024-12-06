// Required modules and dependencies
const fs = require("fs");
const path = require("path");
const Log = require("../models/log"); // mongodb model for logs
const { parseLogs } = require("../services/logService"); // log parsing services
const { elasticClient } = require("../config/db");
const { ensureIndexExists } = require("../utils/logger"); 

//handles uploading of logFiles
const uploadLogs = async (req, res) => {
    try {
        const indexName = "logs-index"; //elsaticSearch index name
        await ensureIndexExists(indexName);
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded." });
        }

        const bulkOperations = []; // Array to store MongoDB bulk operations

        // Iterates over each log file
        for (const file of req.files) {
            const filePath = file.path
            const fileExt = path.extname(file.originalname).toLowerCase();
            const logs = await parseLogs(filePath, fileExt);
            //insert logs into bulkoperations
            logs.forEach((log) => {
                bulkOperations.push({
                    insertOne: {
                        document: {
                            rawLog: log, 
                            fileName: file.originalname,
                            processed: false,
                        },
                    },
                });
            });

            // Delete the temporary uploaded file from upload directory after parsing
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file ${filePath}:`, err.message);
                } else {
                    console.log(`Successfully deleted file: ${filePath}`);
                }
            });
        }

        // Bulk insert logs into MongoDB
        await Log.bulkWrite(bulkOperations);

        res.status(200).json({ message: "Logs uploaded and stored in the database successfully!" });
        
    } 
    catch (error) {
        console.error("Error uploading logs:", error.message);
        res.status(500).json({ error: "Failed to upload logs." });
    }
};


const searchLogs = async (req, res) => {

    // Build Elasticsearch query
    try {
        const { type, keyword, startDate, endDate, sortBy, sortOrder} = req.query;

        const query = {
            bool: {
                must: [], // Conditions for matching logs
                filter: [], // Filters for timestamp range
            },
        };

        // Match log type
        if (type) query.bool.must.push({ match: { type } });

        // Match keyword in log message
        if (keyword) query.bool.must.push({ match: { message: keyword } });

        // Filter by timestamp range
        if (startDate || endDate) {
            query.bool.filter.push({
                range: {
                    timestamp: {
                        ...(startDate ? { gte: startDate } : {}),
                        ...(endDate ? { lte: endDate } : {}),
                    },
                },
            });
        }

        const body = { query }; // Construct the body for the search query

        //If sortBy is provided
        if (sortBy) {
            body.sort = [
                {
                    [sortBy]: {
                        order: sortOrder, // "asc" or "desc"
                    },
                },
            ];
        }

        // Search elastic search index for results
        const response = await elasticClient.search({
            index: "logs-index",
            body,
        });

        const hits = response.hits.hits.map((hit) => hit._source); // stores search results

        res.status(200).json(hits);
    } catch (error) {
        console.error("Error searching logs:", error.message);
        res.status(500).json({ error: "Failed to search logs." });
    }
};



module.exports = { uploadLogs, searchLogs};
