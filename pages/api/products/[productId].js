import async from 'async';

import { getProduct } from '../../../prisma/products/products';
import handleResponse from '../../../utils/helpers/handleResponse';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    async.auto(
      {
        main: [
          async () => {
            const { productId } = req.query;
            const product = await getProduct(productId);

            if (product) {
              return {
                message: 'Product found',
                product
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'main',
                body: {
                  status: 404,
                  data: {
                    message: 'No such product found'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'main')
    );
  } else {
    res.send(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
