import async from 'async';
import Joi from 'joi';
import bcrypt from 'bcryptjs';

import { getUser, updateUser } from '../../../prisma/user/user';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import verifyToken from '../../../utils/middlewares/userAuth';

const schema = {
  body: Joi.object({
    username: Joi.string().optional(),
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .optional(),
    email: Joi.string().optional(),
    password: Joi.string().optional(),
    email_verified: Joi.boolean().optional()
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'POST') {
    async.auto(
      {
        verification: async () => {
          const { email, username, phone } = req.body;
          const { id } = req.user;

          let userCheck = [];
          if (email || username || phone)
            userCheck = await getUser({ username, email, phone });

          const checkExistence = await getUser({ id });

          if (userCheck.length != 0) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 409,
                  data: {
                    message:
                      'User with same username or email or phone already exists'
                  }
                }
              })
            );
          }

          if (checkExistence.length == 0) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 409,
                  data: {
                    message: 'User with given id is deleted or does not exists'
                  }
                }
              })
            );
          }

          return {
            message: 'User Validated'
          };
        },
        update: [
          'verification',
          async () => {
            const { body } = req;
            const { id } = req.user;

            if (body.password) {
              body.passwordHash = await bcrypt.hash(body.password, 10);
              delete body.password;
            }

            const updatedUser = await updateUser(id, body);

            if (updatedUser) return { message: 'User updated', updatedUser };

            throw new Error(
              JSON.stringify({
                errorkey: 'update',
                body: {
                  status: 500,
                  data: {
                    message: 'Internal Server Error'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'update')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
