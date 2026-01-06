const { container, containerClient } = require('../src/lib/azure');

module.exports = async function (context, req) {
  const id = context.bindingData.id;
  try {
    const { resource: item } = await container.item(id, id).read();
    if (!item) {
      context.res = { status: 404, body: 'Item not found' };
      return;
    }
    if (item.blobName) {
      const blockBlobClient = containerClient.getBlockBlobClient(item.blobName);
      await blockBlobClient.deleteIfExists();
    }
    await container.item(id, id).delete();
    context.res = { status: 200, body: 'Deleted successfully' };
  } catch (error) {
    context.log.error(error);
    context.res = { status: 500, body: error.message };
  }
};
