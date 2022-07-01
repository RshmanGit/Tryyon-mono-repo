import async from 'async';

import { getSKU } from '../../../prisma/products/sku';
import handleResponse from '../../../utils/helpers/handleResponse';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    async.auto(
      {
        main: [
          async () => {
            const { skuId } = req.query;
            const sku = await getSKU(skuId);

            if (sku.length != 0) {
              return {
                message: 'SKU found',
                sku
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'main',
                body: {
                  status: 404,
                  data: {
                    message: 'No such sku found'
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
