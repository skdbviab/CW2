const { container } = require('../src/lib/azure');

module.exports = async function (context, req) {
  const id = context.bindingData.id;

  if (!id) {
    context.res = { status: 400, body: 'Please pass an id in the route' };
    return;
  }

  try {
    const { resource: item } = await container.item(id, id).read();
    if (!item) {
      context.res = { status: 404, body: 'Item not found' };
      return;
    }
    context.res = { status: 200, body: item };
  } catch (error) {
    context.log.error(error);
    context.res = { status: 500, body: error.message };
  }
};
