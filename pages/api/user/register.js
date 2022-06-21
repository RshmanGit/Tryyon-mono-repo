import async from 'async';
import Joi from 'joi';
import { uuid } from 'uuidv4';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { getUser, createUser, updateUser } from '../../../prisma/user/user';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import transporter from '../../../mail/transporter';

const schema = {
  body: Joi.object({
    username: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    phone: Joi.number().min(1000000000).max(9999999999).required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    email_verified: Joi.boolean().default(false)
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
            message: 'New User Validated'
          };
        },
        create: [
          'verification',
          async () => {
            const { body } = req;
            body.passwordHash = await bcrypt.hash(body.password, 10);
            delete body.password;

            const createdUser = await createUser(body);

            if (createdUser) {
              const token = jwt.sign(
                { id: createdUser.id, email: createdUser.email },
                process.env.TOKEN_KEY,
                { expiresIn: '2h' }
              );

              const verificationCode = uuid();
              const verificationExpiry = new Date(
                new Date().getTime() + 48 * 60 * 60 * 1000
              );

              const user = await updateUser(createdUser.id, {
                token,
                verificationCode,
                verificationExpiry
              });

              const mailOptions = {
                from: process.env.MAIL_USERNAME,
                to: user.email,
                subject: 'Verify your account',
                text: `The code is ${verificationCode}`
              };

              const info = await transporter.sendMail(mailOptions);

              console.log(info);
              if (info.rejected.length != 0) {
                throw new Error(
                  JSON.stringify({
                    errorkey: 'create',
                    body: {
                      status: 500,
                      data: {
                        message: 'Verification mail not sent'
                      }
                    }
                  })
                );
              }

              return { message: 'New user registered', user };
            }
            throw new Error(
              JSON.stringify({
                errorkey: 'create',
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
      handleResponse(req, res, 'create')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
