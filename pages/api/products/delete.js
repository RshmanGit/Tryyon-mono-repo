import Joi from 'joi';
import async from 'async';

import { deleteProduct, checkProduct } from '../../../prisma/products/products';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    id: Joi.string().required()
  })
};

const handler = async (req, res) => {
  if (req.method == 'DELETE') {
    async.auto(
      {
        verification: async () => {
          const { id } = req.body;
          const productCheck = await checkProduct(id);

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
        removeProduct: [
          'verification',
          async () => {
            const { id } = req.body;

            const res = await deleteProduct(id);

            if (res) {
              return {
                message: 'Product deleted',
                product: res
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'removeProduct',
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
      handleResponse(req, res, 'removeProduct')
    );
  } else {
    res.send(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
