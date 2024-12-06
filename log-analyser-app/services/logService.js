const fs = require("fs");
const csvParser = require("csv-parser");

async function parseJSONLogs(filePath) {
    try {
        // Attempt to read the file synchronously
        const data = fs.readFileSync(filePath, "utf8");

        // parse data as json object
        return JSON.parse(data);
    } catch (err) {
        throw new Error("Failed to read or parse the JSON log file.");
    }
}


async function parseCSVLogs(filePath) {
    return new Promise((resolve, reject) => {
        const logs = [];
        fs.createReadStream(filePath) // create read stream
            .pipe(csvParser()) // parse CSV
            .on("data", (row) => {
                // Ensure the row has all required fields
                const { timestamp, type, message } = row; 
                if (timestamp && type && message) {
                    logs.push({ timestamp, type, message });
                } else {
                    logs.push({ malformed: true, originalLine: row }); // append malformed set to true in case of malformed logs
                }
            })
            .on("end", () => resolve(logs))
            .on("error", (err) => reject(err));
    });
}


function parsePlainTextLogs(filePath) {
    const data = fs.readFileSync(filePath, "utf8");
    return data
        .split("\n")
        .filter((line) => line.trim() !== "") // Ignore empty lines
        .map((line) => {
            const regex = /\[(.*?)\] \[(.*?)\] (.*)/; // regex to match [timestamp] [type] message
            const match = line.match(regex);

            return match
                ? { timestamp: match[1], type: match[2], message: match[3] }
                : { malformed: true, originalLine: line.trim() }; // Flag malformed lines
        });
}


async function parseLogs(filePath, fileExt) {

    let logs;
    if (fileExt === ".json") { // uploded file is a json file
        logs = await parseJSONLogs(filePath);
    } else if (fileExt === ".csv") { // uploaded file is a CSV file
        logs = await parseCSVLogs(filePath);
    } else if ( fileExt === ".txt") { // uploaded file is a plain text file
        logs = parsePlainTextLogs(filePath);
    }
    else{
        throw new Error ("Unsupported file extension: " + fileExt);
    }
    return logs;
}




const validateLog = (log, index, format, fileName) => {
    const requiredFields = ["type", "timestamp", "message"];
    // console.log("Validating log:", log);  // Log the entire log to inspect its structure

    // Log the properties of the log to check for unexpected values
    // console.log("Log fields:", Object.keys(log));

    const missingFields = requiredFields.filter((field) => !log[field]);
    if (missingFields.length > 0) {
        console.log(`Validation failed for log at index ${index}: Missing fields: ${missingFields.join(", ")}`);
        return {
            isValid: false,
            index,
            format,
            error: `Missing fields: ${missingFields.join(", ")}`,
            log,
        };
    }

    // Check timestamp format validity (ISO 8601)
    if (isNaN(Date.parse(log.timestamp))) {
        console.log(`Validation failed for log at index ${index}: Invalid timestamp format: ${log.timestamp}`);
        return {
            isValid: false,
            index,
            format,
            error: "Invalid timestamp format",
            log,
        };
    }

    console.log(`Validation successful for log at index ${index}`);
    return { isValid: true, fileName, log };
};




module.exports = { parseLogs, validateLog };
