import async from 'async';
import Joi from 'joi';

import { createProductImport } from '../../../prisma/products/product_imports';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import auth from '../../../utils/middlewares/auth';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import { prisma } from '../../../prisma/prisma';

const schema = {
  body: Joi.object({
    productId: Joi.string().required(),
    tenantId: Joi.string().optional(),
    status: Joi.boolean().required(),
    override: Joi.object().default({})
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, auth);

  if (req.method == 'POST') {
    async.auto(
      {
        verify: async () => {
          const { body } = req;
          const { productId, tenantId } = body;

          const productCheck = await prisma.product.findMany({
            where: { id: productId }
          });

          if (productCheck.length == 0) {
            throw new Error(
              JSON.stringify({
                errorKey: 'create',
                body: {
                  status: 404,
                  data: {
                    message: 'Product not found'
                  }
                }
              })
            );
          }

          if (req.admin) {
            if (!tenantId) {
              throw new Error(
                JSON.stringify({
                  errorKey: 'create',
                  body: {
                    status: 404,
                    data: {
                      message: 'Tenant ID not provided'
                    }
                  }
                })
              );
            }

            const tenantCheck = await prisma.tenant.findMany({
              where: { id: tenantId }
            });

            if (tenantCheck.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorKey: 'create',
                  body: {
                    status: 404,
                    data: {
                      message: 'Tenant not found'
                    }
                  }
                })
              );
            }
          } else {
            const { id } = req.user;
            const tenant = await prisma.tenant.findMany({
              where: {
                company: {
                  ownerId: id
                }
              }
            });

            if (tenant.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorKey: 'create',
                  body: {
                    status: 404,
                    data: {
                      message: 'User does not have a tenant'
                    }
                  }
                })
              );
            }

            body.tenantId = tenant[0].id;
          }

          return {
            message: 'Product Import validated',
            body
          };
        },
        create: [
          'verify',
          async (results) => {
            const { body } = results.verify;

            const res = await createProductImport(body);

            if (res) {
              return {
                message: 'New Product Import Created',
                productImport: res
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'create',
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
      handleResponse(req, res, 'create')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
