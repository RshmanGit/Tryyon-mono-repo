import async from 'async';
import Joi from 'joi';

import validate from '../../../utils/middlewares/validation';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import verifyToken from '../../../utils/middlewares/userAuth';

const schema = {
  body: Joi.object({})
};

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'GET') {
    async.auto(
      {
        check: [
          async () => ({
            message: 'User Authenticated',
            user: req.user
          })
        ]
      },
      handleResponse(req, res, 'check')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);