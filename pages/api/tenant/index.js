import async from 'async';

import {
  getAllTenants,
  getAllTenantsPaginated,
  searchTenants,
  searchTenantsPaginated
} from '../../../prisma/tenant/tenant';
import handleResponse from '../../../utils/helpers/handleResponse';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    async.auto(
      {
        read: [
          async () => {
            const { paginated, count, offset, ...rest } = req.query;

            if (paginated == 'true' && (!count || !offset)) {
              throw new Error(
                JSON.stringify({
                  errorKey: 'read',
                  body: {
                    status: 422,
                    data: {
                      message:
                        'Missing query parameter, both count and offset need with paginated'
                    }
                  }
                })
              );
            }

            let tenants;

            if (Object.keys(rest).length == 0) {
              if (paginated)
                tenants = await getAllTenantsPaginated(
                  Number(offset),
                  Number(count)
                );
              else tenants = await getAllTenants();
            } else {
              if (paginated) {
                tenants = await searchTenantsPaginated({
                  offset: Number(offset),
                  count: Number(count),
                  ...rest
                });
              } else tenants = await searchTenants(rest);
            }

            if (tenants) {
              return {
                message: 'Tenants found',
                tenants
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'read',
                body: {
                  status: 404,
                  data: {
                    message: 'No Tenant found'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'read')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
