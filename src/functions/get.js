const { app } = require('@azure/functions');
const { container } = require('../lib/azure');

app.http('getItem', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'items/{id}',
    handler: async (request, context) => {
        const id = request.params.id;

        try {
            const { resource: item } = await container.item(id, id).read();

            if (!item) {
                return { status: 404, body: "Item not found" };
            }

            return {
                status: 200,
                jsonBody: item
            };
        } catch (error) {
            context.log.error(error);
            return { status: 500, body: error.message };
        }
    }
});
