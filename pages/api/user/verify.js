import async from 'async';

import handleResponse from '../../../utils/helpers/handleResponse';
import runMiddleware from '../../../utils/helpers/runMiddleware';
import verifyToken from '../../../utils/middlewares/userAuth';
import { getUser, updateUser } from '../../../prisma/user/user';

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'GET') {
    async.auto(
      {
        verify: [
          async () => {
            const { code } = req.query;
            const { id } = req.user;

            const user = await getUser({ id });

            if (user.length != 0) {
              if (
                user[0].verificationCode == code &&
                user[0].verificationExpiry.getTime() > new Date().getTime()
              ) {
                const verifiedUser = await updateUser(id, {
                  email_verified: true
                });

                return {
                  message: 'User verified',
                  verifiedUser
                };
              }

              throw new Error(
                JSON.stringify({
                  errorkey: 'verify',
                  body: {
                    status: 409,
                    data: {
                      message: 'Verification code is invalid or expired'
                    }
                  }
                })
              );
            }

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
        ]
      },
      handleResponse(req, res, 'verify')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
