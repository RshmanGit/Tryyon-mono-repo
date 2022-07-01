import Joi from 'joi';
import async from 'async';

import { updateSKU, getSKU } from '../../../prisma/products/sku';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    id: Joi.string().required(),
    updateData: Joi.object({
      slug: Joi.string().optional(),
      quantity: Joi.number(),
      productId: Joi.string().optional(),
      published: Joi.boolean().default(false),
      attributes: Joi.object().optional(),
      categoryIds: Joi.array().optional(),
      price: Joi.number().optional(),
      discountedPrice: Joi.number().optional()
    })
  })
};

const handler = async (req, res) => {
  if (req.method == 'POST') {
    async.auto(
      {
        verification: async () => {
          const { id } = req.body;
          const productCheck = await getSKU(id);

          if (productCheck.length == 0) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 404,
                  data: {
                    message: 'No such SKU found'
                  }
                }
              })
            );
          }

          return {
            message: 'SKU found'
          };
        },
        update: [
          'verification',
          async () => {
            const { id, updateData } = req.body;

            const sku = await updateSKU(id, updateData);

            if (sku) {
              return {
                message: 'SKU updated',
                sku
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'update',
                body: {
                  status: 404,
                  data: {
                    message: 'No such SKU found'
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
