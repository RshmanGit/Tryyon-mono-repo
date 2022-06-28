import async from 'async';

import { searchAttribute } from '../../../../prisma/products/attribute';
import handleResponse from '../../../../utils/helpers/handleResponse';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    async.auto(
      {
        read: [
          async () => {
            const { query } = req;

            const attributes = await searchAttribute(query);

            if (attributes.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'read',
                  body: {
                    status: 404,
                    data: {
                      message: 'No attribute found'
                    }
                  }
                })
              );
            }

            return {
              message: 'Attributes found',
              attributes
            };
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
