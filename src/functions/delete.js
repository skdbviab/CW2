const { app } = require('@azure/functions');
const { container, containerClient } = require('../lib/azure');

app.http('deleteItem', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'items/{id}',
    handler: async (request, context) => {
        const id = request.params.id;

        try {
            // Get item to find blob name
            const { resource: item } = await container.item(id, id).read();

            if (!item) {
                return { status: 404, body: "Item not found" };
            }

            // Delete Blob
            if (item.blobName) {
                const blockBlobClient = containerClient.getBlockBlobClient(item.blobName);
                await blockBlobClient.deleteIfExists();
            }

            // Delete from Cosmos
            await container.item(id, id).delete();

            return {
                status: 200,
                body: "Deleted successfully"
            };
        } catch (error) {
            context.log.error(error);
            return { status: 500, body: error.message };
        }
    }
});
