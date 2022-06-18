import { prisma } from '../prisma';

// Create Company
export const createCompany = async (data) => {
  const company = await prisma.company.create({
    data: data
  });

  return company;
};

// Read Company
export const getAllCompanies = async () => {
  const [companies, total_count] = await prisma.$transaction([
    prisma.company.findMany({
      include: {
        tenants: true
      }
    }),
    prisma.company.count()
  ]);

  return { companies, total_count };
};

export const getAllCompaniesPaginated = async (offset, count) => {
  const [companies, total_count] = await prisma.$transaction([
    prisma.company.findMany({
      skip: offset,
      take: count,
      include: {
        tenants: true
      }
    }),
    prisma.company.count()
  ]);

  const pagination = {
    offset,
    count,
    total_count
  };

  return { companies, pagination };
};

export const getCompany = async (id) => {
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      tenants: true
    }
  });

  return company;
};

export const checkCompany = async ({
  id,
  gstNumber,
  panNumber,
  aadharNumber
}) => {
  const query = { OR: [] };

  if (id) query.OR.push({ id });
  if (gstNumber) query.OR.push({ gstNumber });
  if (panNumber) query.OR.push({ panNumber });
  if (aadharNumber) query.OR.push({ aadharNumber });

  const company = await prisma.company.findMany({
    where: { id },
    include: {
      tenants: true
    }
  });

  return company;
};

export const searchCompanies = async ({ query, adminApproval }) => {
  const condition = {};

  if (query) condition.name = { contains: query, mode: 'insensitive' };
  if (adminApproval != undefined) condition.approved = approved == 'true';

  const companies = await prisma.company.findMany({
    where: condition,
    include: {
      tenants: true
    }
  });

  return companies;
};

export const searchCompaniesPaginated = async ({
  query,
  adminApproval,
  count,
  offset
}) => {
  const condition = {};

  if (query) condition.name = { contains: query, mode: 'insensitive' };
  if (adminApproval != undefined) condition.approved = approved == 'true';

  const [companies, total_count] = await prisma.$transaction([
    prisma.company.findMany({
      skip: offset,
      take: count,
      where: condition,
      include: {
        tenants: true
      }
    }),
    prisma.company.count()
  ]);

  const pagination = {
    offset,
    count,
    total_count
  };

  return { companies, pagination };
};

// Update Company
export const updateCompany = async (id, updateData) => {
  const company = await prisma.company.update({
    where: { id },
    data: { ...updateData },
    include: {
      tenants: true
    }
  });

  return company;
};

// Delete Company
export const deleteCompany = async (id) => {
  const deletedCompany = await prisma.company.delete({
    where: { id },
    include: {
      tenants: true
    }
  });

  return deletedCompany;
};
