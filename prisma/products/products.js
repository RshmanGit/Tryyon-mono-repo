import { prisma } from '../prisma';

// Create Product
export const createProduct = async (data) => {
  const { supplierId, categoryIds, ...rest } = data;

  if (supplierId) rest.supplier = { connect: { id: supplierId } };
  if (categoryIds.length != 0) {
    rest.categories = { connect: [] };
    categoryIds.forEach((id) => {
      rest.categories.connect.push({ id });
    });
  }

  const product = await prisma.product.create({
    data: rest
  });

  return product;
};

// Read Product
export const getProduct = async (id) => {
  const products = await prisma.product.findMany({
    where: { id }
  });

  return products;
};

export const searchProducts = async ({
  id,
  query,
  inStock,
  published,
  supplierId,
  attributes,
  sortBy,
  order,
  categoryId
}) => {
  const condition = { $and: [] },
    sortProducts = {},
    options = {};

  const productProperties = ['name', 'description', 'quantity'];

  if (attributes) {
    const attr = {};

    for (let prop in attributes) {
      attr[`attributes.${prop}`] = { $elemMatch: { $eq: attributes[prop] } };
    }

    condition.$and.push(attr);
    console.log(attr);
  }

  if (id) condition.$and.push({ _id: { $eq: { $oid: id } } });
  if (supplierId)
    condition.$and.push({ supplierId: { $eq: { $oid: supplierId } } });
  if (query) condition.$and.push({ name: { $regex: query, $options: 'i' } });
  if (inStock == true) condition.$and.push({ quantity: { $gt: 0 } });
  if (published != undefined) condition.$and.push({ published: published });
  if (categoryId)
    condition.$and.push({
      categoryIds: { $elemMatch: { $eq: { $oid: categoryId } } }
    });

  if (sortBy) {
    if (!(sortBy in productProperties)) sortBy = 'price';
    sortProducts[sortBy] = order == 'desc' ? -1 : 1;
    options.$orderby = sortProducts;
  }

  if (condition.$and.length == 0) {
    delete condition.$and;
  }

  prisma.product.findRaw({
    filter: condition
  });
  const products = await prisma.product.findRaw({
    filter: condition,
    options
  });

  let res = products.map((product) => {
    let tmpId = product._id.$oid;
    delete product._id;
    product.id = tmpId;

    let tmp = product.supplierId.$oid;
    delete product.supplierId;

    product.supplierId = tmp;

    let tmpArr = product.categoryIds.map((e) => e.$oid);
    delete product.categoryIds;

    product.categoryIds = tmpArr;

    return product;
  });

  return res;
};

// Update Product
export const updateProduct = async (id, updateData) => {
  const { supplierId, categoryIds, ...rest } = updateData;

  if (supplierId) rest.supplier = { connect: { id: supplierId } };

  if (categoryIds.length != 0) {
    rest.categories = { connect: [] };
    categoryIds.forEach((id) => {
      rest.categories.connect.push({ id });
    });
  }

  const product = await prisma.product.update({
    where: { id },
    data: rest
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
