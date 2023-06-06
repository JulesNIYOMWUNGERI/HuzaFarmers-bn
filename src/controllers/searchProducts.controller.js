import { Op } from 'sequelize';
import db from '../Database/models';
import searchQuery from '../validation/searchProduct.validator';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const { Product } = db;

const searchProduct = asyncWrapper(async (req, res) => {
  const { error } = searchQuery(req.query);

  if (error) {
    return res.status(406).send(error.details[0].message);
  }

  // Define the where object with the search conditions
  const where = {};

  if (req.searchQuery.name) {
    where.name = { [Op.iLike]: `%${req.searchQuery.name}%` };
  }

  if (req.searchQuery.category) {
    where.category = { [Op.iLike]: `%${req.searchQuery.category}%` };
  }

  if (req.searchQuery.minPrice && req.searchQuery.maxPrice) {
    where.price = {
      [Op.between]: [req.searchQuery.minPrice, req.searchQuery.maxPrice],
    };
  } else if (req.searchQuery.minPrice) {
    where.price = { [Op.gte]: req.searchQuery.minPrice };
  } else if (req.searchQuery.maxPrice) {
    where.price = { [Op.lte]: req.searchQuery.maxPrice };
  }

  const items = await Product.findAll({ where });
  if (items.length === 0) {
    return res.status(404).send({ message: 'Product not found' });
  }
  return res.status(200).json({
    status: 200,
    message: 'successfully Products found.',
    data: items,
  });
});

export default searchProduct;
