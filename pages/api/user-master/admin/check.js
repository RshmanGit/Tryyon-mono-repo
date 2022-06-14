import async from 'async';
import Joi from 'joi';

import validate from '../../../../utils/middlewares/validation';
import handleResponse from '../../../../utils/helpers/handleResponse';
import runMiddleware from '../../../../utils/helpers/runMiddleware';
import verifyToken from '../../../../utils/middlewares/user-master/adminAuth';

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
            message: 'Admin Authenticated',
            admin: req.admin
          })
        ]
      },
      handleResponse(req, res, 'check')
    );
  } else {
    res.send(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
