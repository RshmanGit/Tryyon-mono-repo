import async from 'async';
import Joi from 'joi';
import { uuid } from 'uuidv4';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { getUser, updateUser } from '../../../prisma/user/user';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    id: Joi.string().required(),
    updateData: Joi.object({
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
  })
};

const handler = async (req, res) => {
  if (req.method == 'POST') {
    async.auto(
      {
        verification: async () => {
          const { email, username, phone } = req.body;
          const userCheck = await getUser({ username, email, phone });

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

          return {
            message: 'User Validated'
          };
        },
        update: [
          'verification',
          async () => {
            const { body } = req;

            if (body.password) {
              body.passwordHash = await bcrypt.hash(body.password, 10);
              delete body.password;
            }

            const { id, updateData } = body;
            const updatedUser = await updateUser(id, updateData);

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
