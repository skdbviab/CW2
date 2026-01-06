# CW2 - Cloud Native File Manager

This project implements a cloud-native file management system using Azure Functions, Azure Cosmos DB, and Azure Blob Storage.

## Prerequisites

- Node.js (v18 or later)
- Azure CLI (optional)
- Azure Subscription

## Setup Instructions

### 1. Azure Resources
You need to create the following resources in the Azure Portal:
1.  **Storage Account**: Create a container named `uploads`.
2.  **Azure Cosmos DB for NoSQL**: Create a database named `CW2Db` and a container named `Items` (Partition Key: `/id`).
3.  **Application Insights**: Create a resource for monitoring.
4.  **Function App**: Create a Node.js Function App.

### 2. Configuration (Local)
Update `local.settings.json` with your connection strings:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "COSMOS_CONNECTION_STRING": "your_cosmos_connection_string",
    "COSMOS_DATABASE_NAME": "CW2Db",
    "COSMOS_CONTAINER_NAME": "Items",
    "STORAGE_CONNECTION_STRING": "your_storage_connection_string",
    "STORAGE_CONTAINER_NAME": "uploads",
    "APPINSIGHTS_INSTRUMENTATIONKEY": "your_app_insights_key"
  }
}
```

### 3. Installation & Run
```bash
npm install
npm start
```
The API will run at `http://localhost:7071/api`.

### 4. Frontend
Open `frontend/index.html` in your browser.
Make sure to enable CORS in your local function (host.json allows `*` by default).

## Deployment (CI/CD)
1.  Push this code to GitHub.
2.  Go to your Azure Function App in the Portal -> **Deployment Center**.
3.  Select **GitHub** as the source and link your repository.
4.  Azure will automatically create a workflow file (or use the one provided in `.github/workflows`).
5.  **Important**: Go to **Configuration** (Environment Variables) in the Function App and add the settings from `local.settings.json` (COSMOS_CONNECTION_STRING, etc.).
6.  Enable **CORS** in the Function App blade: Add `*` (or your frontend URL).

## API Endpoints
- `POST /api/items`: Upload file (Multipart form-data: `file`, `description`)
- `GET /api/items`: List all items
- `GET /api/items/{id}`: Get item details
- `PUT /api/items/{id}`: Update item description
- `DELETE /api/items/{id}`: Delete item
