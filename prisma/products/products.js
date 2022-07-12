import { prisma } from '../prisma';

// Create Product
export const createProduct = async (data) => {
  const { supplierId, categoryIds, ...rest } = data;

  if (supplierId) rest.supplier = { connect: { id: supplierId } };
  if (categoryIds && categoryIds.length != 0) {
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
  priceFrom,
  priceTo,
  sortBy,
  order,
  categoryId,
  pagination,
  offset,
  limit
}) => {
  const condition = {},
    sortProducts = {},
    pipeline = [];

  let total_count;

  if (attributes) {
    for (let prop in attributes) {
      condition[`attributes.${prop}`] = {
        $elemMatch: { $eq: attributes[prop] }
      };
    }
  }

  if (id) condition._id = { $eq: { $oid: id } };
  if (supplierId) condition.supplierId = { $eq: { $oid: supplierId } };
  if (query) condition.name = { $regex: query, $options: 'i' };
  if (inStock == true) condition.quantity = { $gt: 0 };
  else if (inStock == false) condition.quantity = { $eq: 0 };

  if (published != undefined) condition.published = published;
  if (categoryId)
    condition.categoryIds = { $elemMatch: { $eq: { $oid: categoryId } } };

  if (sortBy) {
    sortProducts[sortBy] = order == 'desc' ? -1 : 1;
  }

  pipeline.push({ $match: condition });
  pipeline.push({
    $lookup: {
      from: 'Category',
      localField: 'categoryIds',
      foreignField: '_id',
      as: 'categories'
    }
  });

  pipeline.push({
    $lookup: {
      from: 'SKU',
      localField: '_id',
      foreignField: 'productId',
      as: 'sku'
    }
  });

  if (priceFrom || priceTo) {
    const price = {};
    if (priceFrom) price.$gte = priceFrom;
    if (priceTo) price.$lte = priceTo;

    pipeline.push({
      $match: {
        sku: {
          $elemMatch: {
            price
          }
        }
      }
    });
  }

  if (Object.keys(sortProducts).length !== 0)
    pipeline.push({ $sort: sortProducts });

  if (pagination) {
    if (offset) pipeline.push({ $skip: offset });
    if (limit) pipeline.push({ $skip: limit });

    total_count = await prisma.$runCommandRaw({
      count: 'Product',
      query: condition
    });
  }

  pipeline.push({
    $project: {
      _id: 1,
      name: 1,
      description: 1,
      shortDescriptions: 1,
      slug: 1,
      quantity: 1,
      supplierId: 1,
      published: 1,
      attributes: 1,
      categoryIds: 1,
      'categories.name': 1,
      'categories.description': 1,
      'categories.slug': 1
    }
  });

  const products = await prisma.product.aggregateRaw({
    pipeline
  });

  let res = products.map((product) => {
    let tmpId = product._id.$oid;
    delete product._id;
    product.id = tmpId;

    if (product.supplierId) {
      let tmp = product.supplierId.$oid;
      delete product.supplierId;

      product.supplierId = tmp;
    }

    if (Array.isArray(product.categoryIds)) {
      let tmpArr = product.categoryIds.map((e) => e.$oid);
      delete product.categoryIds;

      product.categoryIds = tmpArr;
    }

    return product;
  });

  if (pagination) {
    return {
      products: res,
      pagination: {
        total_count: total_count.n,
        limit,
        offset
      }
    };
  }

  return res;
};

// Update Product
export const updateProduct = async (id, updateData) => {
  const { supplierId, categoryIds, ...rest } = updateData;

  if (supplierId) rest.supplier = { connect: { id: supplierId } };

  if (categoryIds && categoryIds.length != 0) {
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
