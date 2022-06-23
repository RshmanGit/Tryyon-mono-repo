import Joi from 'joi';
import async from 'async';

import { deleteTenant, getTenant } from '../../../prisma/tenant/tenant';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import verifyToken from '../../../utils/middlewares/userAuth';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import { checkCompany } from '../../../prisma/company/company';

const schema = {
  body: Joi.object({
    id: Joi.string().required()
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'DELETE') {
    async.auto(
      {
        verification: async () => {
          const ownerId = req.user.id;
          const { id } = req.body;

          const company = await checkCompany({ ownerId });

          if (company.length == 0) {
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

          if (!company[0].tenant) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 404,
                  data: {
                    message: 'User does not have a tenant'
                  }
                }
              })
            );
          }

          const tenantCheck = await getTenant(id);

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

          if (company[0].tenant.id != id) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 401,
                  data: {
                    message: 'User is not the owner of this tenant'
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
