import async from 'async';

import { checkCompany, getCompany } from '../../../prisma/company/company';
import handleResponse from '../../../utils/helpers/handleResponse';

const handler = async (req, res) => {
  if (req.method == 'GET') {
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
                    message: 'No such company found'
                  }
                }
              })
            );
          }

          return {
            message: 'Company found'
          };
        },
        main: [
          'verification',
          async () => {
            const { companyId } = req.query;
            const company = await getCompany(companyId);

            if (company) {
              return {
                message: 'Company found',
                company
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'main',
                body: {
                  status: 404,
                  data: {
                    message: 'No such company found'
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
