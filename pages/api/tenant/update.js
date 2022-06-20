import Joi from 'joi';
import async from 'async';

import { updateTenant, checkTenant } from '../../../prisma/tenant/tenant';
import { checkCompany } from '../../../prisma/company/company';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    id: Joi.string().required(),
    updateData: Joi.object()
  })
};

const handler = async (req, res) => {
  if (req.method == 'POST') {
    async.auto(
      {
        verification: async () => {
          const { id, updateData } = req.body;
          const { companyId } = updateData;
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

          if (companyId) {
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

            if (companyCheck[0].tenant) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verification',
                  body: {
                    status: 409,
                    data: {
                      message:
                        'Company with given companyId already has a tenant'
                    }
                  }
                })
              );
            }
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
      handleResponse(req, res, 'updateTenant')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
