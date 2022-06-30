import async from 'async';
import Joi from 'joi';

import {
  searchProducts,
  searchProductsPaginated
} from '../../../prisma/products/products';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    id: Joi.string().optional(),
    query: Joi.string().optional(),
    inStock: Joi.boolean().optional(),
    published: Joi.boolean().optional(),
    supplierId: Joi.string().optional(),
    categoryId: Joi.string().optional(),
    attributes: Joi.object().optional(),
    sortBy: Joi.string().optional(),
    order: Joi.string().allow('desc', 'asc').optional()
  })
};

const handler = async (req, res) => {
  if (req.method == 'POST') {
    async.auto(
      {
        read: [
          async () => {
            const { paginated, count, offset, ...rest } = req.body;

            if (paginated == 'true' && (!count || !offset)) {
              throw new Error(
                JSON.stringify({
                  errorKey: 'read',
                  body: {
                    status: 422,
                    data: {
                      message:
                        'Missing query parameter, both count and offset need with paginated'
                    }
                  }
                })
              );
            }

            let products;

            if (paginated) {
              products = await searchProductsPaginated({
                offset: Number(offset),
                count: Number(count),
                ...rest
              });
            } else products = await searchProducts(rest);

            if (products) {
              return {
                message: 'Products found',
                products
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'read',
                body: {
                  status: 404,
                  data: {
                    message: 'No Product found'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'read')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
