import async from 'async';
import Joi from 'joi';

import validate from '../../../utils/middlewares/validation';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import verifyToken from '../../../utils/middlewares/userAuth';

import { getUser } from '../../../prisma/user/user';

const schema = {
  body: Joi.object({})
};

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'GET') {
    async.auto(
      {
        main: async () => {
          const { userId } = req.query;
          const userCheck = await getUser({ id: userId });

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
            message: 'User found',
            user: userCheck[0]
          };
        }
      },
      handleResponse(req, res, 'main')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
