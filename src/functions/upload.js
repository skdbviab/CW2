const { app } = require('@azure/functions');
const { container, containerClient } = require('../lib/azure');
const { v4: uuidv4 } = require('uuid');

app.http('uploadItem', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'items',
    handler: async (request, context) => {
        context.log('Upload Item triggered');

        try {
            // Parse form data
            const formData = await request.formData();
            const file = formData.get('file');
            const description = formData.get('description') || 'No description';
            
            if (!file) {
                return { status: 400, body: "No file uploaded" };
            }

            // Generate ID and Blob Name
            const id = uuidv4();
            const blobName = `${id}-${file.name}`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            // Upload to Blob Storage
            // file is a File object (Blob), we can get arrayBuffer
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            await blockBlobClient.upload(buffer, buffer.length);

            // Save metadata to Cosmos DB
            const newItem = {
                id: id,
                fileName: file.name,
                blobName: blobName,
                blobUrl: blockBlobClient.url,
                description: description,
                uploadedAt: new Date().toISOString()
            };

            const { resource: createdItem } = await container.items.create(newItem);

            return {
                status: 201,
                jsonBody: createdItem
            };

        } catch (error) {
            context.log.error(error);
            return { status: 500, body: error.message };
        }
    }
});
