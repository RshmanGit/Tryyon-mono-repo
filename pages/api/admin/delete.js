import async from 'async';
import Joi from 'joi';

import validate from '../../../utils/middlewares/validation';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import verifyToken from '../../../utils/middlewares/adminAuth';

import { deleteAdmin } from '../../../prisma/admin/admin';

const schema = {
  body: Joi.object({
    email: Joi.string().email().required()
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'DELETE') {
    async.auto(
      {
        removeAdmin: [
          async () => {
            const { email } = req.body;

            const admin = await deleteAdmin({ email });

            if (admin) {
              return {
                message: 'Admin deleted',
                admin
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'removeAdmin',
                body: {
                  status: 404,
                  data: {
                    message: 'No such Amin found'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'removeAdmin')
    );
  } else {
    res.send(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
