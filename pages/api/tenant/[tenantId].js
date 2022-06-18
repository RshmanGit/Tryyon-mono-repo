import async from 'async';

import { getTenant, checkTenant } from '../../../prisma/tenant/tenant';
import handleResponse from '../../../utils/helpers/handleResponse';

const handler = async (req, res) => {
  if (req.method == 'GET') {
    async.auto(
      {
        main: [
          async () => {
            const { tenantId } = req.query;
            const tenant = await checkTenant(tenantId);

            if (tenant.length != 0) {
              return {
                message: 'Tenant found',
                tenant: tenant[0]
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'main',
                body: {
                  status: 404,
                  data: {
                    message: 'No such tenant found'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'main')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
