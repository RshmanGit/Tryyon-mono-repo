import Joi from 'joi';
import async from 'async';

import { updateRole, checkRole } from '../../../../prisma/admin/roles';
import handleResponse from '../../../../utils/helpers/handleResponse';
import runMiddleware from '../../../../utils/helpers/runMiddleware';
import verifyToken from '../../../../utils/middlewares/adminAuth';
import validate from '../../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    id: Joi.string().required(),
    updateData: Joi.object()
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'POST') {
    async.auto(
      {
        verify: async () => {
          const { id } = req.body;
          const roleCheck = await checkRole({ id });

          if (roleCheck.length == 0) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verify',
                body: {
                  status: 404,
                  data: {
                    message: 'Role does not exist'
                  }
                }
              })
            );
          }

          return {
            message: 'New Role Validated'
          };
        },
        updateRole: [
          'verify',
          async () => {
            const { id, updateData } = req.body;

            const { title } = updateData;

            if (title) {
              const roleCheck = await checkRole({ title });

              if (roleCheck.length != 0) {
                throw new Error(
                  JSON.stringify({
                    errorkey: 'verify',
                    body: {
                      status: 409,
                      data: {
                        message: 'Role already exists'
                      }
                    }
                  })
                );
              }
            }

            const role = await updateRole(id, updateData);

            if (role) {
              return {
                message: 'Role updated',
                role
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'updateRole',
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
      handleResponse(req, res, 'updateRole')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
