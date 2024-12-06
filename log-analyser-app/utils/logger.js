const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: process.env.ELASTICSEARCH_URL || "http://localhost:9200" });

const ensureIndexExists = async (indexName) => {
    const exists = await client.indices.exists({ index: indexName });   // check if the index already exists
    
    // create index if it doesn't exist
    if (!exists) {
        console.log(`Creating index ${indexName}`);

        // construct body of the index
        const requestBody = {
            mappings: {
                properties: {
                    type: { type: "keyword" }, // stores the log-level
                    timestamp: { type: "date" }, // stores the timestamp
                    message: { type: "text" }, // stores the log message
                    source: { type: "keyword" }, // stores the source of the log
                },
            },
        };
        await client.indices.create({ index: indexName, body: requestBody }); // creates index with the index name "logs-index"
        console.log(`Index ${indexName} created successfully.`);
    }
        
    else {
        console.log(`Using pre existing index ${indexName}.`);
    }
};

module.exports = { ensureIndexExists};
