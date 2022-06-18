import async from 'async';

import {
  getAllProducts,
  getAllProductsPaginated,
  searchProducts,
  searchProductsPaginated
} from '../../../prisma/products/products';
import handleResponse from '../../../utils/helpers/handleResponse';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    async.auto(
      {
        read: [
          async () => {
            const { paginated, count, offset, ...rest } = req.query;

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

            if (Object.keys(rest).length == 0) {
              if (paginated)
                products = await getAllProductsPaginated(
                  Number(offset),
                  Number(count)
                );
              else products = await getAllProducts();
            } else {
              if (paginated) {
                products = await searchProductsPaginated({
                  offset: Number(offset),
                  count: Number(count),
                  ...rest
                });
              } else products = await searchProducts(rest);
            }

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

export default handler;
