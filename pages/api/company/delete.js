import Joi from 'joi';
import async from 'async';

import { deleteCompany, checkCompany } from '../../../prisma/company/company';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    id: Joi.string().required()
  })
};

const handler = async (req, res) => {
  if (req.method == 'DELETE') {
    async.auto(
      {
        verification: async () => {
          const { id } = req.body;
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
