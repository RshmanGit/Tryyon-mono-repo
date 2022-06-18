import async from 'async';
import Joi from 'joi';

import validate from '../../../utils/middlewares/validation';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import verifyToken from '../../../utils/middlewares/adminAuth';

import { getAdminByID } from '../../../prisma/admin/admin';

const schema = {
  body: Joi.object({})
};

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'GET') {
    async.auto(
      {
        main: [
          async () => {
            const { adminId } = req.query;

            const admin = await getAdminByID(adminId);

            if (admin) {
              return {
                message: 'Admin found',
                admin
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'main',
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
      handleResponse(req, res, 'main')
    );
  } else {
    res.send(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
