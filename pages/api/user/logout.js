import async from 'async';

import { getUser, updateUser } from '../../../prisma/user/user';
import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import verifyToken from '../../../utils/middlewares/userAuth';

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'GET') {
    async.auto(
      {
        check: [
          async () => {
            const { id } = req.user;
            const user = await getUser({ id });

            if (user.length == 0) {
              throw new Error(
                JSON.stringify({
                  errorkey: 'check',
                  body: {
                    status: 404,
                    data: {
                      message: 'User not found'
                    }
                  }
                })
              );
            }
          }
        ],
        logout: [
          'check',
          async () => {
            const { id } = req.user;
            const user = await updateUser(id, { token: null });
            delete req.user;

            if (user) {
              return {
                message: 'User logged out',
                user
              };
            }

            throw Error(
              JSON.stringify({
                errorkey: 'logout',
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
      handleResponse(req, res, 'logout')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
