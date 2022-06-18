import Joi from 'joi';
import async from 'async';

import { deleteRole } from '../../../../prisma/admin/roles';
import handleResponse from '../../../../utils/helpers/handleResponse';
import runMiddleware from '../../../../utils/helpers/runMiddleware';
import verifyToken from '../../../../utils/middlewares/adminAuth';
import validate from '../../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    id: Joi.string().required()
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'DELETE') {
    async.auto(
      {
        removeRole: [
          async () => {
            const { id } = req.body;

            const role = await deleteRole({ id });

            if (role) {
              return {
                message: 'Role deleted',
                role
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'removeRole',
                body: {
                  status: 404,
                  data: {
                    message: 'No such Role found'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'removeRole')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
