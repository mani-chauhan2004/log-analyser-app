const Log = require("../models/log");
const { validateLog } = require("../services/logService"); //validates log for malformation errors
const { bulkIndexLogs } = require("../services/elasticService"); 

const processLogs = async (req, res) => {
    try {
        const logsToProcess = await Log.find({ processed: false }).limit(100); //process frst 100 logs with processed key set to false

        const validLogs = []; // stores logs with valid formation
        const invalidLogs = []; // stores malformed logs

        // Process each log in the array, validate it, and add it to the appropriate array
        for (const logDoc of logsToProcess) {
            const log = logDoc.rawLog;
            const fileName = logDoc.fileName;
            const validation = validateLog(log, "logs-index", 'JSON');
            if (validation.isValid) {
                validation.log.fileName = fileName;
                validLogs.push(validation.log);
            } else {
                invalidLogs.push({ id: logDoc._id, error: validation.error });
            }

            logDoc.processed = true; // change the processed key to true after processed
            await logDoc.save(); // save changes in the database
        }

        if (validLogs.length > 0) {
            await bulkIndexLogs("logs-index", validLogs); // insert valid logs into index
        }

        // response for the successful completion of the processing process
        res.status(200).json({
            message: "Logs processed successfully.",
            totalProcessed: logsToProcess.length,
            validLogs: validLogs.length,
            invalidLogs: invalidLogs.length,
        });
    } catch (error) {
        console.error("Error processing logs:", error.message);
        res.status(500).json({ error: "Failed to process logs." });
    }
};

module.exports = { processLogs };
