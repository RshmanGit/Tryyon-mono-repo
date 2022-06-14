import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import async from 'async';
import Joi from 'joi';

import {
  checkAdmin,
  createAdmin,
  updateAdmin
} from '../../../../prisma/user-master/admin';
import validate from '../../../../utils/middlewares/validation';
import handleResponse from '../../../../utils/helpers/handleResponse';

const schema = {
  body: Joi.object({
    username: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    phone: Joi.number().min(1000000000).max(9999999999).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

const handler = async (req, res) => {
  if (req.method == 'POST') {
    async.auto(
      {
        verification: async () => {
          const { email, username, phone } = req.body;
          const adminCheck = await checkAdmin(username, email, phone);

          if (adminCheck) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 409,
                  data: {
                    message: 'Admin User Already Exists'
                  }
                }
              })
            );
          }

          return {
            message: 'New Admin Validated'
          };
        },
        register: [
          'verification',
          async () => {
            const { body } = req;
            body.passwordHash = await bcrypt.hash(body.password, 10);
            delete body.password;

            const createdAdmin = await createAdmin(body);

            if (createdAdmin) {
              const token = jwt.sign(
                { id: createdAdmin.id, email: createdAdmin.email },
                process.env.TOKEN_KEY,
                { expiresIn: '2h' }
              );
              const adminToken = jwt.sign(
                { id: createdAdmin.id, email: createdAdmin.email },
                process.env.ADMIN_TOKEN_KEY,
                { expiresIn: '2h' }
              );

              const admin = await updateAdmin(createdAdmin.id, {
                token,
                adminToken
              });
              return { message: 'New admin registered', admin };
            }
            throw new Error(
              JSON.stringify({
                errorkey: 'register',
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
      handleResponse(req, res, 'register')
    );
  } else {
    res.send(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
