import async from 'async';

import {
  getAllCompanies,
  getAllCompaniesPaginated,
  searchCompanies,
  searchCompaniesPaginated
} from '../../../prisma/company/company';
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

            let companies;

            if (Object.keys(rest).length == 0) {
              if (paginated)
                companies = await getAllCompaniesPaginated(
                  Number(offset),
                  Number(count)
                );
              else companies = await getAllCompanies();
            } else {
              if (paginated) {
                companies = await searchCompaniesPaginated({
                  offset: Number(offset),
                  count: Number(count),
                  ...rest
                });
              } else companies = await searchCompanies(rest);
            }

            if (companies) {
              return {
                message: 'Companies found',
                companies
              };
            }

            throw new Error(
              JSON.stringify({
                errorKey: 'read',
                body: {
                  status: 404,
                  data: {
                    message: 'No Company found'
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
