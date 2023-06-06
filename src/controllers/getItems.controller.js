import db from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const { Product } = db;

export const getAllBuyerItems = asyncWrapper(async (req, res) => {
  const pageAsNumber = Number.parseInt(req.query.page, 10);
  const sizeAsNumber = Number.parseInt(req.query.size, 10);

  let page = 1;
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 1) {
    page = pageAsNumber;
  }

  let size = 5;
  if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
    size = sizeAsNumber;
  }
  const offset = (page - 1) * size;

  const items = await Product.findAndCountAll({
    where: {
      status: 'available',
    },
    limit: size,
    offset,
  });

  if (items.rows.length === 0) {
    return res
      .status(404)
      .json({ message: `There is no items found on page ${page}` });
  }

  // Returning paginated results
  return res.status(200).json({
    status: 200,
    data: {
      totalItems: items.count,
      totalPages: Math.ceil(items.count / size),
      itemsPerPage: size,
      currentPage: page,
      items: items.rows
    },
    message: 'product retrived'
  });
});

export const getAllSellerItems = asyncWrapper(async (req, res) => {
  const pageAsNumber = Number.parseInt(req.query.page, 10);
  const sizeAsNumber = Number.parseInt(req.query.size, 10);

  let page = 1;
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 1) {
    page = pageAsNumber;
  }

  let size = 5;
  if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
    size = sizeAsNumber;
  }
  const offset = (page - 1) * size;

  const { user } = req;

  const items = await Product.findAndCountAll({
    where: {
      userId: `${user.id}`,
    },
    limit: size,
    offset,
  });

  if (items.rows.length === 0) {
    return res
      .status(404)
      .json({ message: `There is no items found on page ${page}` });
  }

  // Returning paginated results
  return res.status(200).json({
    status: 200,
    data: {
      totalItems: items.count,
      totalPages: Math.ceil(items.count / size),
      itemsPerPage: size,
      currentPage: page,
      items: items.rows
    },
    message: 'product retrived'
  });
});
