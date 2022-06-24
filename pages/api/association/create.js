import async from 'async';
import Joi from 'joi';

import {
  getAssociation,
  createAssociation
} from '../../../prisma/association/association';
import { getTenant } from '../../../prisma/tenant/tenant';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import auth from '../../../utils/middlewares/auth';
import validate from '../../../utils/middlewares/validation';
import { checkCompany } from '../../../prisma/company/company';

const schema = {
  body: Joi.object({
    userId: Joi.string().optional(),
    tenantId: Joi.string().required(),
    approval: Joi.boolean().default(false)
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, auth);
  if (req.method == 'POST') {
    async.auto(
      {
        verify: async () => {
          // if admin user is trying to make a new Association
          if (req.admin) {
            const { userId, tenantId } = req.body;

            // userId is needed
            if (!userId) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verify',
                  body: {
                    status: 409,
                    data: {
                      message: 'userId not provided'
                    }
                  }
                })
              );
            }

            const associationCheck = await getAssociation({ userId });

            // if the user is already having an association
            if (associationCheck.length != 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verify',
                  body: {
                    status: 409,
                    data: {
                      message: 'Given user already has an association'
                    }
                  }
                })
              );
            }

            const company = await checkCompany({ ownerId: userId });

            if (company.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verify',
                  body: {
                    status: 409,
                    data: {
                      message: 'User does not have a company'
                    }
                  }
                })
              );
            }

            const tenant = await getTenant(tenantId);

            if (tenant.length != 0) {
              // check if given user is the owner of the tenant
              if (company[0].id == tenant[0].companyId) {
                return {
                  message: 'Association validated'
                };
              }

              throw new Error(
                JSON.stringify({
                  errorkey: 'verify',
                  body: {
                    status: 409,
                    data: {
                      message: 'Given user is not the owner of tenant'
                    }
                  }
                })
              );
            }

            throw new Error(
              JSON.stringify({
                errorkey: 'verify',
                body: {
                  status: 404,
                  data: {
                    message: 'Tenant not found'
                  }
                }
              })
            );
          }

          // if an authenticated user is trying to create an association
          if (req.user) {
            const { id } = req.user; // userId is not needed to be there in body
            const { tenantId } = req.body;
            const associationCheck = await getAssociation({ userId: id });

            // if the user is already having an association
            if (associationCheck.length != 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'verify',
                  body: {
                    status: 409,
                    data: {
                      message: 'User already has an association'
                    }
                  }
                })
              );
            }

            const tenant = await getTenant(tenantId);

            if (tenant.length != 0) {
              const company = await checkCompany({ ownerId: id });

              if (company.length == 0) {
                throw new Error(
                  JSON.stringify({
                    errorkey: 'verify',
                    body: {
                      status: 409,
                      data: {
                        message: 'User does not have a company'
                      }
                    }
                  })
                );
              }
              // check if the user is the owner of the tenant
              if (company[0].id == tenant[0].companyId) {
                req.body.userId = id;
                return {
                  message: 'Association validated'
                };
              }

              throw new Error(
                JSON.stringify({
                  errorkey: 'verify',
                  body: {
                    status: 409,
                    data: {
                      message: 'User is not the owner of tenant'
                    }
                  }
                })
              );
            }

            throw new Error(
              JSON.stringify({
                errorkey: 'verify',
                body: {
                  status: 404,
                  data: {
                    message: 'Tenant not found'
                  }
                }
              })
            );
          }
        },
        create: [
          'verify',
          async () => {
            const { body } = req;
            if (req.user) body.userId = req.user.id;
            const createdAssociation = await createAssociation(body);

            if (createdAssociation)
              return { message: 'New Association Created', createdAssociation };

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
