import Joi from 'joi';
import async from 'async';
import { updateRole } from '../../../../prisma/admin/roles';
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
        updateRole: [
          async () => {
            const { id, updateData } = req.body;

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
    res.send(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
