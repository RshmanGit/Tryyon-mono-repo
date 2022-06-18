import async from 'async';
import Joi from 'joi';

import { createCompany, checkCompany } from '../../../prisma/company/company';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';

const schema = {
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    gstNumber: Joi.string().required(),
    gstCertificate: Joi.string().guid({ version: 'uuidv4' }),
    panNumber: Joi.string().required(),
    panCard: Joi.string().guid({ version: 'uuidv4' }),
    aadharNumber: Joi.string().required(),
    aadharCard: Joi.string().guid({ version: 'uuidv4' }),
    adminApproval: Joi.boolean().default(false)
  })
};

const handler = async (req, res) => {
  if (req.method == 'POST') {
    async.auto(
      {
        verification: async () => {
          const { gstNumber, aadharNumber, panNumber } = req.body;
          const companyCheck = await checkCompany({
            gstNumber,
            aadharNumber,
            panNumber
          });

          if (companyCheck.length != 0) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 404,
                  data: {
                    message:
                      'Company with same GST Number or Aadhar Number or PAN Number already exists'
                  }
                }
              })
            );
          }

          return {
            message: 'Company validated'
          };
        },
        create: [
          'verification',
          async () => {
            const { body } = req;

            const res = await createCompany(body);

            if (res) {
              return {
                message: 'New Company Created',
                company: res
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'create',
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
