import { prisma } from '../prisma';

// Create Product
export const createProduct = async (data) => {
  const product = await prisma.product.create({
    data: data
  });

  return product;
};

// Read Product
export const getAllProducts = async () => {
  const [products, total_count] = await prisma.$transaction([
    prisma.product.findMany(),
    prisma.product.count()
  ]);

  return { products, total_count };
};

export const getAllProductsPaginated = async (offset, count) => {
  const [products, total_count] = await prisma.$transaction([
    prisma.product.findMany({
      skip: offset,
      take: count
    }),
    prisma.product.count()
  ]);

  const pagination = {
    offset,
    count,
    total_count
  };

  return { products, pagination };
};

export const getProduct = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id }
  });

  return product;
};

// Update Product
export const updateProduct = async (id, updateData) => {
  const product = await prisma.product.update({
    where: { id },
    data: { ...updateData }
  });

  return product;
};

// Delete Product
export const deleteProduct = async (id) => {
  const deletedProduct = await prisma.product.delete({
    where: { id }
  });

  return deletedProduct;
};
