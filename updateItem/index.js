const { container } = require('../src/lib/azure');

module.exports = async function (context, req) {
  const id = context.bindingData.id;
  try {
    const { resource: item } = await container.item(id, id).read();
    if (!item) {
      context.res = { status: 404, body: 'Item not found' };
      return;
    }
    const body = req.body || {};
    if (body.description) item.description = body.description;
    const { resource: updatedItem } = await container.item(id, id).replace(item);
    context.res = { status: 200, body: updatedItem };
  } catch (error) {
    context.log.error(error);
    context.res = { status: 500, body: error.message };
  }
};
