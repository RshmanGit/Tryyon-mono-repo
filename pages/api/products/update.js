import Joi from 'joi';
import async from 'async';

import { updateProduct } from '../../../prisma/products/products';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    id: Joi.string().required(),
    updateData: Joi.object()
  })
};

const handler = async (req, res) => {
  if (req.method == 'POST') {
    async.auto(
      {
        updateProduct: [
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
    res.send(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
