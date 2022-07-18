import Joi from 'joi';
import async from 'async';

import {
  getProductImport,
  updateProductImport
} from '../../../prisma/products/product_imports';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import { prisma } from '../../../prisma/prisma';

const schema = {
  body: Joi.object({
    id: Joi.string().required(),
    updateData: Joi.object({
      productId: Joi.string().optional(),
      tenantId: Joi.string().optional(),
      status: Joi.boolean().optional(),
      override: Joi.object().optional()
    })
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, auth);

  if (req.method == 'POST') {
    async.auto(
      {
        verification: async () => {
          const { id, updateData } = req.body;

          if (req.admin) {
            const productImportCheck = await getProductImport({ id });

            if (productImportCheck.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verification',
                  body: {
                    status: 404,
                    data: {
                      message: 'No such product import found'
                    }
                  }
                })
              );
            }

            return {
              message: 'Product Import found',
              id,
              updateData
            };
          } else {
            const ownerId = req.user.id;

            if (updateData.tenantId) {
              delete updateData.tenantId;
            }

            const productImportCheck = await prisma.productImports.findMany({
              where: {
                id,
                tenant: {
                  company: {
                    ownerId
                  }
                }
              }
            });

            if (productImportCheck.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verification',
                  body: {
                    status: 404,
                    data: {
                      message: 'No such product import found'
                    }
                  }
                })
              );
            }

            return {
              message: 'Product Import found',
              id,
              updateData
            };
          }
        },
        update: [
          'verification',
          async (results) => {
            const { id, updateData } = results.verification;

            const updatedProductImport = await updateProductImport(
              id,
              updateData
            );

            if (updatedProductImport) {
              return {
                message: 'Product Import updated',
                updatedProductImport
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'update',
                body: {
                  status: 500,
                  data: {
                    message: 'Internal Server Error'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'update')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
