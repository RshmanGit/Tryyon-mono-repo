import async from 'async';
import Joi from 'joi';

import validate from '../../../utils/middlewares/validation';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import verifyToken from '../../../utils/middlewares/userAuth';

import { deleteUser, getUser } from '../../../prisma/user/user';

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
        verification: async () => {
          const { id } = req.body;
          const userCheck = await getUser({ id });

          if (userCheck.length == 0) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 404,
                  data: {
                    message: 'No such user found'
                  }
                }
              })
            );
          }

          return {
            message: 'User Validated'
          };
        },
        removeUser: [
          'verification',
          async () => {
            const { id } = req.body;

            const user = await deleteUser(id);

            if (user) {
              return {
                message: 'User deleted',
                user
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'removeUser',
                body: {
                  status: 500,
                  data: {
                    message: 'Internal server error'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'removeUser')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
