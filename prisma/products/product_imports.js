import { prisma } from '../prisma';

// create
export const createProductImport = async (data) => {
  const { tenantId, productId, ...rest } = data;

  if (tenantId) rest.tenant = { connect: { id: tenantId } };
  if (productId) rest.product = { connect: { id: productId } };

  const productImport = await prisma.productImports.create({
    data: rest
  });

  return productImport;
};

// read
export const getProductImport = async ({ id, tenantId, productId }) => {
  if (!id && !tenantId && !productId) return [];

  const condition = { OR: [] };

  if (id) condition.OR.push({ id });
  if (tenantId) condition.OR.push({ tenantIds: { contains: tenantId } });
  if (productId) condition.OR.push({ productId });

  const productImports = await prisma.productImports.findMany({
    where: condition
  });

  return productImports;
};

export const searchProductImport = async ({
  id,
  tenantId,
  productId,
  status
}) => {
  if (!id && !tenantId && !productId && status === undefined) {
    const productImports = await prisma.productImports.findMany({
      where: {}
    });

    return productImports;
  }

  const condition = { AND: [] };

  if (id) condition.AND.push({ id });
  if (tenantId) condition.AND.push({ tenantId });
  if (productId) condition.AND.push({ productId });
  if (status != undefined) condition.AND.push({ status });

  const productImports = await prisma.productImports.findMany({
    where: condition
  });

  return productImports;
};

// update
export const updateProductImport = async (id, updateData) => {
  const { tenantId, productId, ...rest } = updateData;

  if (tenantId) rest.tenant = { connect: { id: tenantId } };
  if (productId) rest.product = { connect: { id: productId } };

  const productImport = await prisma.productImports.update({
    where: { id },
    data: rest
  });

  return productImport;
};

// delete
export const deleteProductImport = async (id) => {
  const productImport = await prisma.productImports.delete({
    where: { id }
  });

  return productImport;
};

// toggle status
export const toggleStatus = async (id) => {
  const productImport = await prisma.productImports.findMany({
    where: { id }
  });

  if (productImport.length == 0) {
    throw new Error(
      JSON.stringify({
        status: 409,
        message: 'Product Import ID is not valid'
      })
    );
  }

  const updatedProductImport = await prisma.productImports.update({
    where: { id },
    data: {
      status: !productImport[0].status
    }
  });

  return updatedProductImport;
};
