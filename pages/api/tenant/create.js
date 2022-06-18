import async from 'async';
import Joi from 'joi';

import { createTenant } from '../../../prisma/tenant/tenant';
import { checkCompany } from '../../../prisma/company/company';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    companyId: Joi.string().required(),
    ownerId: Joi.string().required()
  })
};

const handler = async (req, res) => {
  if (req.method == 'POST') {
    async.auto(
      {
        verification: async () => {
          const { companyId } = req.body;
          const companyCheck = await checkCompany({ id: companyId });

          if (companyCheck.length == 0) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 404,
                  data: {
                    message: 'No company with given companyId found'
                  }
                }
              })
            );
          }

          return {
            message: 'Company found'
          };
        },
        create: [
          'verification',
          async () => {
            const { body } = req;

            const res = await createTenant(body);

            if (res) {
              return {
                message: 'New Tenant Created',
                tenant: res
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'create',
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
