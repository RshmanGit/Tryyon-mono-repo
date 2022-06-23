import Joi from 'joi';
import async from 'async';

import { updateCompany, checkCompany } from '../../../prisma/company/company';
import handleResponse from '../../../utils/helpers/handleResponse';
import validate from '../../../utils/middlewares/validation';
import verifyToken from '../../../utils/middlewares/userAuth';
import runMiddleware from '../../../utils/helpers/runMiddleware';

const schema = {
  body: Joi.object({
    id: Joi.string().required(),
    updateData: Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      gstNumber: Joi.string().optional(),
      gstCertificate: Joi.string().guid({ version: 'uuidv4' }).optional(),
      panNumber: Joi.string().optional(),
      panCard: Joi.string().guid({ version: 'uuidv4' }).optional(),
      aadharNumber: Joi.string().optional(),
      aadharCard: Joi.string().guid({ version: 'uuidv4' }).optional(),
      adminApproval: Joi.boolean().optional()
    })
  })
};

const handler = async (req, res) => {
  await runMiddleware(req, res, verifyToken);
  if (req.method == 'POST') {
    async.auto(
      {
        verification: async () => {
          const { id } = req.body;
          const userId = req.user.id;
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

          if (companyCheck[0].ownerId != userId) {
            throw new Error(
              JSON.stringify({
                errorkey: 'verification',
                body: {
                  status: 404,
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
        updateCompany: [
          'verification',
          async () => {
            const { id, updateData } = req.body;

            const company = await updateCompany(id, updateData);

            if (company) {
              return {
                message: 'Company updated',
                company
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'updateCompany',
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
      handleResponse(req, res, 'updateCompany')
    );
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default validate(schema, handler);
