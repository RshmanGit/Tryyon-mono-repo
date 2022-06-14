import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import async from 'async';
import Joi from 'joi';

import {
  getAdminByEmail,
  updateAdmin
} from '../../../../prisma/user-master/admin';
import validate from '../../../../utils/middlewares/validation';
import handleResponse from '../../../../utils/helpers/handleResponse';

const schema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

const handler = async (req, res) => {
  if (req.method == 'POST') {
    async.auto(
      {
        login: [
          async () => {
            const { email, password } = req.body;
            const admin = await getAdminByEmail(email);

            if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
              const token = jwt.sign(
                { id: admin.id, email: admin.email },
                process.env.TOKEN_KEY,
                { expiresIn: '2h' }
              );

              const adminToken = jwt.sign(
                { id: admin.id, email: admin.email },
                process.env.ADMIN_TOKEN_KEY,
                { expiresIn: '2h' }
              );

              const updatedAdmin = await updateAdmin(admin.id, {
                token,
                adminToken
              });

              return {
                message: 'admin Authenticated',
                updatedAdmin
              };
            }

            throw new Error(
              JSON.stringify({
                errorkey: 'login',
                body: {
                  status: 400,
                  data: {
                    message: 'Invalid Credentials'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'login')
    );
  } else {
    res.send(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
