const { container, containerClient } = require('../src/lib/azure');
const { v4: uuidv4 } = require('uuid');
const multiparty = require('multiparty');
const fs = require('fs');

module.exports = async function (context, req) {
  try {
    const form = new multiparty.Form();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const fileObj = files.file && files.file[0];
    const description = fields.description ? fields.description[0] : 'No description';

    if (!fileObj) {
      context.res = { status: 400, body: 'No file uploaded' };
      return;
    }

    const id = uuidv4();
    const blobName = `${id}-${fileObj.originalFilename}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const buffer = await fs.promises.readFile(fileObj.path);
    await blockBlobClient.upload(buffer, buffer.length);

    const newItem = {
      id: id,
      fileName: fileObj.originalFilename,
      blobName: blobName,
      blobUrl: blockBlobClient.url,
      description: description,
      uploadedAt: new Date().toISOString()
    };

    const { resource: createdItem } = await container.items.create(newItem);
    context.res = { status: 201, body: createdItem };
  } catch (error) {
    context.log.error(error);
    context.res = { status: 500, body: error.message };
  }
};
