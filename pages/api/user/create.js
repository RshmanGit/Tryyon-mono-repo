import async from 'async';
import Joi from 'joi';

import { checkUser, createUser, updateUser } from '../../../prisma/user/user';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    username: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
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
          const userCheck = await checkUser({ username, email, phone });

          if (userCheck.length != 0) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 409,
                  data: {
                    message: 'User Already Exists'
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

              //uuid needs to be implemented for verificationCode
              const user = await updateUser(createdUser.id, {
                token,
                verificationCode
              });
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
