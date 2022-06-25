import async from 'async';

import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import verifyToken from '../../../utils/middlewares/userAuth';
import { checkCompany } from '../../../prisma/company/company';
import { getUser } from '../../../prisma/user/user';

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'GET') {
    async.auto(
      {
        main: async () => {
          const { id } = req.user;
          const userCheck = await getUser({ id });
          const progress = {};

          if (userCheck.length == 0) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 404,
                  data: {
                    message: 'User not found'
                  }
                }
              })
            );
          }

          progress.user = userCheck[0];

          const company = await checkCompany({ ownerId: userCheck[0].id });

          if (company.length != 0) {
            progress.company = company;

            if (company[0].tenant) {
              progress.tenant = company[0].tenant;
            }
          }

          return {
            message: 'User progress',
            progress
          };
        }
      },
      handleResponse(req, res, 'main')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;