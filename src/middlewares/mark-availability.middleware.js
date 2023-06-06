import { Product } from '../Database/models';

const markProductAvailabilityMiddleware = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  // GET PRODUCT BY ID AND USER ID
  const product = await Product.findOne({ where: { id, userId } });

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found',
    });
  }

  // Make sure a user who created product only can updated status
  if (product.userId !== userId) {
    return res.status(403).json({
      status: 'error',
      message: 'Unauthorized',
    });
  }

  req.product = product;
  req.userId = userId;
  next();
};

export default markProductAvailabilityMiddleware;
