import Joi from 'joi';
import async from 'async';

import { deleteTenant, checkTenant } from '../../../prisma/tenant/tenant';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    id: Joi.string().required()
  })
};

const handler = async (req, res) => {
  if (req.method == 'DELETE') {
    async.auto(
      {
        verification: async () => {
          const { id } = req.body;
          const tenantCheck = await checkTenant(id);

          if (tenantCheck.length == 0) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 404,
                  data: {
                    message: 'No such tenant found'
                  }
                }
              })
            );
          }

          return {
            message: 'Tenant found'
          };
        },
        removeTenant: [
          'verification',
          async () => {
            const { id } = req.body;

            const res = await deleteTenant(id);

            if (res) {
              return {
                message: 'Tenant deleted',
                tenant: res
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'removeTenant',
                body: {
                  status: 404,
                  data: {
                    message: 'No such Tenant found'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'removeTenant')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
