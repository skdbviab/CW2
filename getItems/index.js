const { container } = require('../src/lib/azure');

module.exports = async function (context, req) {
  try {
    const querySpec = { query: 'SELECT * from c ORDER BY c.uploadedAt DESC' };
    const { resources: items } = await container.items.query(querySpec).fetchAll();
    context.res = { status: 200, body: items };
  } catch (error) {
    context.log.error(error);
    context.res = { status: 500, body: error.message };
  }
};
