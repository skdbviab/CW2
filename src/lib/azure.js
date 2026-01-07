const { CosmosClient } = require("@azure/cosmos");
const { BlobServiceClient } = require("@azure/storage-blob");
const appInsights = require("applicationinsights");
const crypto = require("crypto"); // Import crypto module

// Initialize App Insights
try {
    const aiConnectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
    const aiInstrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;
    const connectionString = aiConnectionString || aiInstrumentationKey;

    if (connectionString) {
        appInsights.setup(connectionString)
            .setAutoDependencyCorrelation(true)
            .setAutoCollectRequests(true)
            .setAutoCollectPerformance(true, true)
            .setAutoCollectExceptions(true)
            .setAutoCollectDependencies(true)
            .setAutoCollectConsole(true)
            .setUseDiskRetryCaching(true)
            .setSendLiveMetrics(true)
            .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
            .start();
    }
} catch (e) {
    console.error("Failed to initialize Application Insights:", e);
}

const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const container = cosmosClient
  .database(process.env.COSMOS_DATABASE_NAME)
  .container(process.env.COSMOS_CONTAINER_NAME);

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
  process.env.STORAGE_CONTAINER_NAME
);

async function init() {
    // Ensure containers exist (optional, good for demo)
    try {
        await containerClient.createIfNotExists({ access: 'blob' });
    } catch (e) { console.log("Storage container might already exist"); }
}
// Call init vaguely, or just rely on user creating them. 
// For production, we usually pre-create. For this assignment, auto-creation is nice.
init();

module.exports = {
  container,
  containerClient
};
