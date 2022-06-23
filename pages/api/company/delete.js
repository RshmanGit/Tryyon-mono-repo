import Joi from 'joi';
import async from 'async';

import { deleteCompany, checkCompany } from '../../../prisma/company/company';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import verifyToken from '../../../utils/middlewares/userAuth';
import runMiddleware from '../../../utils/helpers/runMiddleware';

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
          const { id } = req.body;
          const ownerId = req.user.id;
          const companyCheck = await checkCompany({ id });

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

          if (companyCheck[0].ownerId != ownerId) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 401,
                  data: {
                    message: 'User is not the owner of this company'
                  }
                }
              })
            );
          }

          return {
            message: 'Company found'
          };
        },
        removeCompany: [
          'verification',
          async () => {
            const { id } = req.body;

            const res = await deleteCompany(id);

            if (res) {
              return {
                message: 'Company deleted',
                company: res
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'removeCompany',
                body: {
                  status: 404,
                  data: {
                    message: 'No such Company found'
                  }
                }
              })
            );
          }
        ]
      },
      handleResponse(req, res, 'removeCompany')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
