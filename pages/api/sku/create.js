import async from 'async';
import Joi from 'joi';

import { createSKU } from '../../../prisma/products/sku';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    slug: Joi.string().required(),
    quantity: Joi.number(),
    productId: Joi.string().required(),
    supplierId: Joi.string().required(),
    published: Joi.boolean().default(false),
    attributes: Joi.object().required(),
    categoryIds: Joi.array().required(),
    price: Joi.number().required(),
    discountedPrice: Joi.number().required()
  })
};

const handler = async (req, res) => {
  if (req.method == 'POST') {
    async.auto(
      {
        create: async () => {
          const { body } = req;

          const res = await createSKU(body);

          if (res) {
            return {
              message: 'New SKU Created',
              sku: res
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
      },
      handleResponse(req, res, 'create')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
