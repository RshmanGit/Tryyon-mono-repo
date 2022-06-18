import async from 'async';

import { getProduct, checkProduct } from '../../../prisma/products/products';
import handleResponse from '../../../utils/helpers/handleResponse';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    async.auto(
      {
        verification: async () => {
          const { productId } = req.query;
          const productCheck = await checkProduct(productId);

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
        main: [
          'verification',
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
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
