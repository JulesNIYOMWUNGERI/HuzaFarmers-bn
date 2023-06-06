/* eslint-disable linebreak-style */
import { Product } from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const checkUserAndProductMiddleware = asyncWrapper(async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user.id;

  const product = await Product.findOne({ where: { id: productId } });

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found',
    });
  }
  if (product.userId !== userId) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized',
    });
  }

  req.product = product;
  req.productId = productId;
  req.userId = userId;
  next();
});

export default checkUserAndProductMiddleware;
