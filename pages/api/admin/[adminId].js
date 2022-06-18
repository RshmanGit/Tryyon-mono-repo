import async from 'async';
import Joi from 'joi';

import validate from '../../../utils/middlewares/validation';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import verifyToken from '../../../utils/middlewares/adminAuth';

import { getAdminByID, checkAdmin } from '../../../prisma/admin/admin';

const schema = {
  body: Joi.object({})
};

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'GET') {
    async.auto(
      {
        verification: async () => {
          const { email } = req.body;
          const adminCheck = await checkAdmin({ email });

          if (adminCheck.length == 0) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 404,
                  data: {
                    message: 'No such admin found'
                  }
                }
              })
            );
          }

          return {
            message: 'Admin Validated'
          };
        },
        main: [
          'verification',
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
                    message: 'No such Admin found'
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

export default validate(schema, handler);
