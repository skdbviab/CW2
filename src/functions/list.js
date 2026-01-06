const { app } = require('@azure/functions');
const { container } = require('../lib/azure');

app.http('getItems', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'items',
    handler: async (request, context) => {
        try {
            const querySpec = {
                query: "SELECT * from c ORDER BY c.uploadedAt DESC"
            };

            const { resources: items } = await container.items.query(querySpec).fetchAll();

            return {
                status: 200,
                jsonBody: items
            };
        } catch (error) {
            context.log.error(error);
            return { status: 500, body: error.message };
        }
    }
});
