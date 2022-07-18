import async from 'async';

import { searchProductImport } from '../../../prisma/products/product_imports';
import handleResponse from '../../../utils/helpers/handleResponse';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    async.auto(
      {
        read: [
          async () => {
            const { status } = req.query;

            if (status) {
              req.query.status = status == 'true';
            }

            const productImports = await searchProductImport(req.query);

            if (productImports.length != 0) {
              return {
                message: 'Product Imports found',
                productImports
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'read',
                body: {
                  status: 404,
                  data: {
                    message: 'No Product Import found'
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
