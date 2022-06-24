import Joi from 'joi';
import async from 'async';

import { updateTenant, getTenant } from '../../../prisma/tenant/tenant';
import { checkCompany } from '../../../prisma/company/company';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import verifyToken from '../../../utils/middlewares/userAuth';
import runMiddleware from '../../../utils/helpers/runMiddleware';

const schema = {
  body: Joi.object({
    id: Joi.string().required(),
    updateData: Joi.object()
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'POST') {
    async.auto(
      {
        verification: async () => {
          const { id } = req.body;
          const ownerId = req.user.id;

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
        updateTenant: [
          'verification',
          async () => {
            const { id, updateData } = req.body;

            const tenant = await updateTenant(id, updateData);

            if (tenant) {
              return {
                message: 'Tenant updated',
                tenant
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'updateTenant',
                body: {
                  status: 500,
                  data: {
                    message: 'Internal server error'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'updateTenant')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
