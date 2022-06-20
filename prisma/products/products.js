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

export const checkProduct = async (id) => {
  const products = await prisma.product.findMany({
    where: { id }
  });

  return products;
};

export const searchProducts = async ({
  query,
  inStock,
  approved,
  published,
  priceFrom,
  priceTo,
  sortBy,
  order
}) => {
  const condition = {},
    sortProducts = {};
  const productProperties = [
    'name',
    'description',
    'price',
    'discountedPrice',
    'quantity'
  ];

  if (query) condition.name = { contains: query, mode: 'insensitive' };
  if (inStock == 'true') condition.quantity = { gt: 0 };
  if (approved != undefined) condition.approved = approved == 'true';
  if (published != undefined) condition.published = published == 'true';
  if (priceFrom) condition.price = { gt: parseInt(priceFrom, 10) };
  if (priceTo) condition.price = { lt: parseInt(priceTo, 10) };

  if (sortBy) {
    if (!(sortBy in productProperties)) sortBy = 'price';
    sortProducts[sortBy] = order ? order : 'asc';
  }

  const products = await prisma.product.findMany({
    where: condition,
    orderBy: sortProducts
  });

  return products;
};

export const searchProductsPaginated = async ({
  query,
  inStock,
  approved,
  published,
  priceFrom,
  priceTo,
  sortBy,
  order,
  count,
  offset
}) => {
  const condition = {},
    sortProducts = {};
  const productProperties = [
    'name',
    'description',
    'price',
    'discountedPrice',
    'quantity'
  ];

  if (query) condition.name = { contains: query, mode: 'insensitive' };
  if (inStock == 'true') condition.quantity = { gt: 0 };
  if (approved != undefined) condition.approved = approved == 'true';
  if (published != undefined) condition.published = published == 'true';
  if (priceFrom) condition.price = { gt: parseInt(priceFrom, 10) };
  if (priceTo) condition.price = { lt: parseInt(priceTo, 10) };

  if (sortBy) {
    if (!(sortBy in productProperties)) sortBy = 'price';
    sortProducts[sortBy] = order ? order : 'asc';
  }

  const [products, total_count] = await prisma.$transaction([
    prisma.product.findMany({
      skip: offset,
      take: count,
      where: condition,
      orderBy: sortProducts
    }),
    prisma.product.count({
      where: condition
    })
  ]);

  const pagination = {
    offset,
    count,
    total_count
  };

  return { products, pagination };
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
