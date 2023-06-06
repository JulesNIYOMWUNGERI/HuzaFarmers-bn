import { Product } from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const findOne = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const data = await Product.findOne({ where: { id } });
  if (data) {
    return res
      .status(200)
      .json({ message: 'Product Retrieved succesfully', data });
  }
  if (!data) {
    return res
      .status(404)
      .json({ message: 'Product not found' });
  }
});

export default findOne;
