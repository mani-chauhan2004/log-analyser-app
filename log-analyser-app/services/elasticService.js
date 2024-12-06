const { elasticClient } = require("../config/db");

const bulkIndexLogs = async (indexName, logs) => {
    // console.log(logs);
    const body = logs.flatMap((log) => {
        // Ensure the timestamp is in ISO 8601 format
        const timestamp = new Date(log.timestamp).toISOString(); // Convert to ISO 8601 format

        // Ensure the _id is set properly
        const id = `${timestamp}-${log.fileName}-${log._id || log.timestamp}`;

        // Format each log for bulk indexing
        return [
            { index: { _index: indexName, _id: id } }, // Include unique ID for each log
            { ...log, timestamp } // Add the corrected timestamp
        ];
    });

    try {
        // Perform the bulk indexing operation
        const response = await elasticClient.bulk({ refresh: true, body });

        // logs response errors
        if (response.errors) {
            console.error('Bulk indexing errors occurred:', response.errors);
            response.items.forEach((item, index) => {
                if (item.index && item.index.error) {
                    console.error(`Error indexing log with ID ${body[index * 2 + 1]._id}:`, item.index.error);
                }
            });
            throw new Error('Bulk indexing failed with errors');
        }

        console.log(`${logs.length} logs indexed successfully.`);
    } catch (error) {
        // Logs any error that occurred during the bulk indexing process
        console.error('Error during bulk indexing:', error.message);
        console.error(error.stack);
    }
};





module.exports = { bulkIndexLogs };
