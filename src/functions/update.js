const { app } = require('@azure/functions');
const { container } = require('../lib/azure');

app.http('updateItem', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'items/{id}',
    handler: async (request, context) => {
        const id = request.params.id;

        try {
            const { resource: item } = await container.item(id, id).read();

            if (!item) {
                return { status: 404, body: "Item not found" };
            }

            const body = await request.json();
            
            // Update fields
            if (body.description) {
                item.description = body.description;
            }
            // Add other fields if needed

            const { resource: updatedItem } = await container.item(id, id).replace(item);

            return {
                status: 200,
                jsonBody: updatedItem
            };
        } catch (error) {
            context.log.error(error);
            return { status: 500, body: error.message };
        }
    }
});
