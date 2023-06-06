import asyncWrapper from '../utils/handlingTryCatchBlocks';

const searchProductValidator = asyncWrapper(async (req, res, next) => {
  const {
    name, category, minPrice, maxPrice
  } = req.query;

  if (name || category || minPrice || maxPrice) {
    req.searchQuery = req.query;
    next();
  } else {
    return res
      .status(406)
      .json({ message: 'you should provide at least one query' });
  }
});

export default searchProductValidator;
