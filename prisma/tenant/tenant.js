import { prisma } from '../prisma';

// Create Tenant
export const createTenant = async (data) => {
  const { companyId, ...rest } = data;

  rest.company = { connect: { id: companyId } };

  const tenant = await prisma.tenant.create({
    data: rest
  });

  return tenant;
};

// Read Tenant
export const getAllTenants = async () => {
  const [tenants, total_count] = await prisma.$transaction([
    prisma.tenant.findMany(),
    prisma.tenant.count()
  ]);

  return { tenants, total_count };
};

export const getAllTenantsPaginated = async (offset, count) => {
  const [tenants, total_count] = await prisma.$transaction([
    prisma.tenant.findMany({
      skip: offset,
      take: count
    }),
    prisma.tenant.count()
  ]);

  const pagination = {
    offset,
    count,
    total_count
  };

  return { tenants, pagination };
};

export const getTenant = async (id) => {
  const tenant = await prisma.tenant.findMany({
    where: { id }
  });

  return tenant;
};

export const searchTenants = async ({ query, companyId, adminApproval }) => {
  const condition = {};

  if (query) condition.name = { contains: query, mode: 'insensitive' };
  if (companyId) condition.companyId = companyId;
  if (adminApproval !== undefined)
    condition.adminApproval = adminApproval == 'true';

  const tenants = await prisma.tenant.findMany({
    where: condition
  });

  return tenants;
};

export const searchTenantsPaginated = async ({
  query,
  companyId,
  adminApproval,
  count,
  offset
}) => {
  const condition = {};

  if (query) condition.name = { contains: query, mode: 'insensitive' };
  if (companyId) condition.companyId = companyId;
  if (adminApproval !== undefined)
    condition.adminApproval = adminApproval == 'true';

  const [tenants, total_count] = await prisma.$transaction([
    prisma.tenant.findMany({
      skip: offset,
      take: count,
      where: condition
    }),
    prisma.tenant.count({
      where: condition
    })
  ]);

  const pagination = {
    offset,
    count,
    total_count
  };

  return { tenants, pagination };
};

// Update Tenant
export const updateTenant = async (id, updateData) => {
  const { companyId, ...rest } = updateData;

  if (companyId) rest.company = { connect: { id: companyId } };

  const tenant = await prisma.tenant.update({
    where: { id },
    data: { ...rest }
  });

  return tenant;
};

// Delete Tenant
export const deleteTenant = async (id) => {
  const deletedTenant = await prisma.tenant.delete({
    where: { id }
  });

  return deletedTenant;
};
