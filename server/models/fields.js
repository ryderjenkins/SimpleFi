const prisma = require('./db');
const path = require ('path');

async function getFields() {
  try {
    const fields = await prisma.field.findMany({
      include: {
        seedTokens: {
          select: {
            tokenId: true
          }
        },
        cropTokens: {
          select: {
            tokenId: true
          }
        }
      }
    });
    return fields;
  } catch (err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
  }
  finally {
    (async () => {await prisma.$disconnect()})();
  }
}

async function getFieldWithReceiptToken(receiptToken) {
  try {
    const field = await prisma.field.findOne({
      where: {
        receiptToken: receiptToken,
      },
      include: {
        fieldSeed: {
          select: {
            tokenId: true
          }
        },
        fieldCrop: {
          select: {
            tokenId: true
          }
        }
      }
    })
    return field;
  } catch (err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
  } finally {
    (async () => {await prisma.$disconnect()})();
  }
}

module.exports = {
  getFields,
  getFieldWithReceiptToken
}