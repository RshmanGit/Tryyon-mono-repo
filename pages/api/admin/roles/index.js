import async from 'async';

import { getRoles } from '../../../../prisma/admin/roles';
import handleResponse from '../../../../utils/helpers/handleResponse';
import runMiddleware from '../../../../utils/helpers/runMiddleware';
import verifyToken from '../../../../utils/middlewares/adminAuth';

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'GET') {
    async.auto(
      {
        read: [
          async () => {
            const roles = await getRoles();

            if (roles) {
              return {
                message: 'Roles found',
                roles
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'read',
                body: {
                  status: 404,
                  data: {
                    message: 'No Role found'
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
    res.send(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
