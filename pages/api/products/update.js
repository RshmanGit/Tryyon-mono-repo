import Joi from 'joi';
import async from 'async';

import { updateProduct, getProduct } from '../../../prisma/products/products';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    id: Joi.string().required(),
    updateData: Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      shortDescriptions: Joi.string().optional(),
      slug: Joi.string().optional(),
      quantity: Joi.number(),
      published: Joi.boolean().default(false),
      attributes: Joi.object().optional(),
      categoryIds: Joi.array().optional()
    })
  })
};

const handler = async (req, res) => {
  if (req.method == 'POST') {
    async.auto(
      {
        verification: async () => {
          const { id } = req.body;
          const productCheck = await getProduct(id);

          if (productCheck.length == 0) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 404,
                  data: {
                    message: 'No such product found'
                  }
                }
              })
            );
          }

          return {
            message: 'Product found'
          };
        },
        updateProduct: [
          'verification',
          async () => {
            const { id, updateData } = req.body;

            const product = await updateProduct(id, updateData);

            if (product) {
              return {
                message: 'Product updated',
                product
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'updateProduct',
                body: {
                  status: 404,
                  data: {
                    message: 'No such Product found'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'updateProduct')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
