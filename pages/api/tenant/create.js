import async from 'async';
import Joi from 'joi';

import { createTenant } from '../../../prisma/tenant/tenant';
import { checkCompany } from '../../../prisma/company/company';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import verifyToken from '../../../utils/middlewares/userAuth';
import runMiddleware from '../../../utils/helpers/runMiddleware';

const schema = {
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required()
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'POST') {
    async.auto(
      {
        verification: async () => {
          const { id } = req.user;
          const companyCheck = await checkCompany({ ownerId: id });

          if (companyCheck.length == 0) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 404,
                  data: {
                    message: 'User does not have a company'
                  }
                }
              })
            );
          }

          if (companyCheck[0].tenant) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 409,
                  data: {
                    message: 'User already has a tenant'
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
            const { id } = req.user;
            const company = await checkCompany({ ownerId: id });

            body.companyId = company[0].id;

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
